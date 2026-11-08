from fastapi import APIRouter

router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio():
    # TODO: Accept an uploaded audio file and call the configured transcription service.
    return {"message": "Audio transcription endpoint is scaffolded; implementation pending."}


@router.post("/command")
async def process_voice_command():
    # TODO: Parse a transcript with an AI model and expose only allow-listed backend tools.
    # The AI must never write directly to the database.
    return {"message": "Voice command endpoint is scaffolded; implementation pending."}
