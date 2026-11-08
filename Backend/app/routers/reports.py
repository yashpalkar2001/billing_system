import csv
from datetime import date, datetime, timedelta
from io import StringIO
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models import Sale

router = APIRouter()


def _summary(start: date, end: date, db: Session):
    sales = db.scalars(
        select(Sale).where(
            Sale.date >= start,
            Sale.date <= end,
            Sale.status == "Completed",
        ).order_by(Sale.date.desc(), Sale.id.desc())
    ).all()
    by_day = {}
    current = start
    while current <= end:
        by_day[current.isoformat()] = {"date": current.isoformat(), "bills": 0, "units": 0, "total": 0.0}
        current += timedelta(days=1)
    for sale in sales:
        day = by_day[sale.date.isoformat()]
        day["bills"] += 1
        day["units"] += sale.qty
        day["total"] += float(sale.amount)
    return {
        "from_date": start.isoformat(),
        "to_date": end.isoformat(),
        "total": round(sum(float(sale.amount) for sale in sales), 2),
        "bills": len(sales),
        "units": sum(sale.qty for sale in sales),
        "days": list(reversed(list(by_day.values()))),
    }


@router.get("/daily")
def daily_report(on_date: date | None = None, db: Session = Depends(get_db)):
    report_date = on_date or datetime.now(ZoneInfo(settings.TIMEZONE)).date()
    return _summary(report_date, report_date, db)


@router.get("/range")
def range_report(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
):
    if from_date > to_date:
        raise HTTPException(status_code=422, detail="from_date must be on or before to_date.")
    if (to_date - from_date).days > 365:
        raise HTTPException(status_code=422, detail="Report range cannot exceed 366 days.")
    return _summary(from_date, to_date, db)


@router.get("/export")
def export_report(
    from_date: date = Query(...),
    to_date: date = Query(...),
    db: Session = Depends(get_db),
):
    report = range_report(from_date, to_date, db)
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Completed bills", "Units sold", "Sales total"])
    for day in report["days"]:
        writer.writerow([day["date"], day["bills"], day["units"], day["total"]])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sales-{from_date}-{to_date}.csv"},
    )
