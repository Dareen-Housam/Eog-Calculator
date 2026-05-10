from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from signal_processor import extract_features

app = FastAPI(title="EOG Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = joblib.load('best_model.pkl')
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

@app.get("/")
async def health_check():
    return {"status": "API is running"}

@app.post("/predict")
async def predict_movement(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Machine Learning model is not loaded.")
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .txt file.")

    try:
        content = await file.read()
        decoded_content = content.decode('utf-8')
        raw_signal = [float(line.strip()) for line in decoded_content.split('\n') if line.strip()]
        raw_signal_np = np.array(raw_signal)

        features = extract_features(raw_signal_np)
        
        # 1. Get the integer prediction from the SVM (0, 1, 2, 3, or 4)
        prediction_number = int(model.predict(features)[0])
        
        # 2. Translate the number to the exact word React expects
        movement_map = {
            0: 'Up',
            1: 'Down',
            2: 'Right',
            3: 'Left',
            4: 'Blink'
        }
        
        prediction_word = movement_map.get(prediction_number, "Unknown")
        
        return {
            "success": True,
            "prediction": prediction_word
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Data parsing error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during prediction: {str(e)}")