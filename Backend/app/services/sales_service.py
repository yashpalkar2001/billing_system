"""
Business rules for sales belong here, not in the AI agent.

Implement sale creation in one database transaction:
1. Lock/read the relevant inventory rows.
2. Re-check active product, variant, price and available quantity.
3. Create sale + sale_items using server-side prices.
4. Write stock_movements and decrement inventory.
5. Enforce an idempotency key to prevent duplicate voice submissions.
6. Commit only after every operation succeeds.
"""
