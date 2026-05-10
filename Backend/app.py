from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
import io
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
    
    filename = file.filename.lower()
    if not (filename.endswith('.txt') or filename.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .txt or .xlsx file.")

    try:
        content = await file.read()
        
        movement_map = {
            0: 'Left',
            1: 'Right',
            2: 'Up',
            3: 'Down',
            4: 'Blink'
        }
        
        detected_movements = []

        if filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(content), header=None)
            for col_idx in range(df.shape[1]):
                col_data = df.iloc[:, col_idx].dropna().values.astype(float)
                if len(col_data) < 50:
                    continue
                    
                features = extract_features(col_data)
                prediction_number = int(model.predict(features)[0])
                detected_movements.append(movement_map.get(prediction_number, "Unknown"))

        elif filename.endswith('.txt'):
            decoded_content = content.decode('utf-8')
            raw_signal = [float(line.strip()) for line in decoded_content.split('\n') if line.strip()]
            raw_signal_np = np.array(raw_signal)

            chunk_size = 251 
            
            for i in range(0, len(raw_signal_np), chunk_size):
                chunk = raw_signal_np[i : i + chunk_size]
                
                if len(chunk) < 200:
                    continue
                
                amplitude = np.max(chunk) - np.min(chunk)
                if amplitude < 10.0:
                    continue 

                features = extract_features(chunk)
                prediction_number = int(model.predict(features)[0])
                detected_movements.append(movement_map.get(prediction_number, "Unknown"))

        if not detected_movements:
            return {"success": False, "detail": "No clear eye movements detected (signal too flat)."}

        return {
            "success": True,
            "predictions": detected_movements
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Data parsing error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")