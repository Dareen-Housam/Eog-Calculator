from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from signal_processor import extract_features

# Initialize FastAPI app
app = FastAPI(title="EOG Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change to specific domains in production)
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
    return {"status": "API is running", "message": "Send EOG .txt files to /predict"}

@app.post("/predict")
async def predict_movement(file: UploadFile = File(...)):
    """Receives a .txt file, extracts features, and returns the predicted EOG movement."""
    if not model:
        raise HTTPException(status_code=500, detail="Machine Learning model is not loaded.")

    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .txt file.")

    try:
        # 1. Read the uploaded file asynchronously
        content = await file.read()
        
        # 2. Decode and parse the text into a list of floats
        decoded_content = content.decode('utf-8')
        raw_signal = [
            float(line.strip()) 
            for line in decoded_content.split('\n') 
            if line.strip()
        ]
        
        # Convert to numpy array
        raw_signal_np = np.array(raw_signal)

        # 3. Clean the signal and extract the 39 features
        features = extract_features(raw_signal_np)

        # 4. Predict using the SVM model
        prediction = model.predict(features)[0]
        
        return {
            "success": True,
            "prediction": str(prediction)
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Data parsing error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during prediction: {str(e)}")