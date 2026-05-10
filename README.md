# 👁️ EOG-Based Interactive Calculator (HCI Project)

An advanced Human-Computer Interaction (HCI) project that translates Electrooculography (EOG) signals (eye movements and blinks) into actionable inputs for a digital calculator interface.

This project demonstrates how traditional machine learning can be integrated with modern web technologies to build highly accessible, spatial-aware user interfaces.

---

## 🚀 Live Demo

- 🔗 Frontend: https://eog-calculator.netlify.app/

---

## ✨ Features

### 🎯 Two-Step Spatial Navigation
A custom 16-button calculator UI designed around a strict HCI constraint:
users can select any number or operation using exactly **two eye movements and one blink**.

### 🌟 Glowing Focus Indicator
A pulsing visual cursor provides real-time feedback, tracking the user's spatial focus across the 4x4 calculator grid to reduce cognitive load.

### ⚡ Auto-Evaluating Logic
The calculator instantly computes equations (e.g., `7 + 2`) as soon as the second digit is confirmed, minimizing required user input.

### 🧪 Signal Simulation Mode
A built-in dashboard allows:
- Manual simulation using a D-Pad
- Uploading pre-recorded `.txt` EOG signal files directly in the browser

### 🤖 Robust Machine Learning Pipeline
A fully trained Support Vector Machine (SVM) pipeline that:
- Filters signal noise
- Extracts advanced EOG features (Wavelets & Morphological)
- Classifies eye movements into actionable commands

---

# 📂 Repository Structure

```text

HCI_EOG_Calculator/
│
├── Machine_Learning/                   # Jupyter notebooks and dataset
│     ├── data/                         # Raw .txt EOG files
│     ├── HCI_Project.ipynb             # ML Pipeline, Feature Extraction, SVM Grid Search
│     └── models/                       # Exported .pkl model files
│
├── Backend/                            # FastAPI Python Server
│     ├── app.py                        # RESTful API endpoints
│     ├── signal_processor.py           # Signal cleaning & 39-feature DWT extraction
│     ├── best_model.pkl                # Trained SVM Model
│     └── requirements.txt              # Python dependencies
│
└── Frontend/                           # React UI
      ├── src/
      │   ├── components/
      │   │   ├── CalculatorGrid.jsx    # The spatial 4x4 interactive grid
      │   │   ├── SimulatorPanel.jsx    # Mock D-pad and File Upload logic
      │   │   └── CalculatorScreen.jsx  # Display for equations
      │   ├── App.jsx                   # Main state manager
      │   └── index.css                 # Tailwind directives
      ├── package.json
      └── tailwind.config.js
```

---

# 🏗️ System Architecture

The project is divided into three main modules:

## 1️⃣ Machine Learning Module (Python / Scikit-Learn)

### 📌 Responsibilities
- EOG signal preprocessing
- Feature extraction
- Eye movement classification

### ⚙️ Preprocessing Pipeline
- DC Offset Removal
- Butterworth Bandpass Filter (`0.5Hz → 20Hz`)
- Signal Normalization

### 🧠 Feature Extraction Techniques (39 Features)
- Discrete Wavelet Transform (DWT - db1, db2, db4)
- Morphological Features (Peaks, Area Under Curve)

### 🎯 Classification
- Support Vector Machine (SVM)
- Grid Search Cross Validation
- Multi-class classification for: Up, Down, Left, Right, Blink

---

## 2️⃣ Frontend Interface (React / Vite / Tailwind CSS)

### 📌 Responsibilities
- Real-time UI interaction
- Spatial navigation system
- API communication


### 🔄 State Machine Flow

```text
IDLE
  ↓
QUADRANT_ACTIVE
  ↓
BUTTON_ACTIVE
```

### 🎨 UI / UX Features
- Responsive mobile-first design
- High-contrast glowing indicators
- Smooth transitions and animations

---

## 3️⃣ Backend API (FastAPI)

### 📌 Responsibilities
- Real-time inference server
- Communication bridge between the ML model and the React frontend

### ⚙️ Features
- **Live Inference:** Loads the trained `best_model.pkl` SVM model on startup.
- **Dynamic Feature Extraction:** Cleans raw signal uploads and processes them through the 39-feature DWT/Morphological pipeline.
- **RESTful Endpoints:** Provides a `/predict` POST endpoint to instantly classify signals and return actionable movement commands.

---

# 🚀 How to Run the Project

## ⚙️ Running the FastAPI Backend (Required for File Uploads)

To process real `.txt` signal files locally, the Python backend must be running.

### 1️⃣ Navigate to Backend Directory
```bash
cd Backend
```

### 2️⃣ Create and Activate a Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Start the Server
```bash
uvicorn app:app --reload --port 5000
```
*The API will now be listening on `http://localhost:5000`, and you can test endpoints directly at `http://localhost:5000/docs`.*

---

## ▶️ Running the Frontend Interface

### 1️⃣ Navigate to Frontend Directory
```bash
cd Frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

### 4️⃣ Open in Browser
Visit `http://localhost:5173`. You can now use the D-Pad or upload `.txt` signal files to interact with the calculator!

---

# 🧪 Machine Learning Workflow

```text
Raw EOG Signals
        ↓
Signal Cleaning
        ↓
Feature Extraction
        ↓
Feature Selection
        ↓
SVM Classification
        ↓
Predicted Eye Movement
        ↓
Frontend Interaction
```

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS

## Machine Learning & Backend
- Python
- FastAPI
- NumPy / SciPy
- Scikit-Learn
- PyWavelets

---

# 📜 License

This project is intended for educational and research purposes.
