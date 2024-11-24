from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import vosk

# Set up Vosk model path (replace with the path to the model you've downloaded)
MODEL_PATH = 'F:\Kode\Projects\CGP_InterviewBot\\vosk-model-en-us-0.22-lgraph'  # Example: path to Vosk model

# Initialize the Vosk model
model = vosk.Model(MODEL_PATH)

router = APIRouter()

# WebSocket endpoint to handle live transcription
@router.websocket("/ws/live-stt")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    rec = vosk.KaldiRecognizer(model, 16000)

    try:
        while True:
            data = await websocket.receive_bytes()  # Receive audio chunk from frontend
            if rec.AcceptWaveform(data):
                result = rec.Result()
                await websocket.send_text(result)
            else:
                partial_result = rec.PartialResult()
                await websocket.send_text(partial_result)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
        await websocket.close()
