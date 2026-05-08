# 👁️ EOG-Based Interactive Calculator (HCI Project)

An advanced Human-Computer Interaction (HCI) project that translates Electrooculography (EOG) signals (eye movements and blinks) into actionable inputs for a digital calculator interface.

This project demonstrates how traditional machine learning can be integrated with modern web technologies to build highly accessible, spatial-aware user interfaces.

---

## 🚀 Live Demo

- 🔗 Frontend: http://eog-calculator.netlify.app/

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
- Extracts advanced EOG features
- Classifies eye movements into actionable commands

---

# 🏗️ System Architecture

The project is divided into three main modules:

---

## 1️⃣ Machine Learning Module (Python / Scikit-Learn)

### 📌 Responsibilities
- EOG signal preprocessing
- Feature extraction
- Eye movement classification

### ⚙️ Preprocessing Pipeline
- DC Offset Removal
- Butterworth Bandpass Filter (`0.5Hz → 20Hz`)
- Signal Normalization

### 🧠 Feature Extraction Techniques
- Discrete Wavelet Transform (DWT)
- Autoregression (AR) Coefficients
- Morphological Features
  - Peaks
  - Area Under Curve (AUC)

### 🎯 Classification
- Support Vector Machine (SVM)
- Grid Search Cross Validation
- Multi-class classification for:
  - Up
  - Down
  - Left
  - Right
  - Blink

---

## 2️⃣ Frontend Interface (React / Vite / Tailwind CSS)

### 📌 Responsibilities
- Real-time UI interaction
- Spatial navigation system
- Simulation tools

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
- Spatial navigation feedback system

---

## 3️⃣ Backend API (FastAPI)

### 📌 Responsibilities
- Real-time inference server
- Communication bridge between ML model and frontend

### ⚙️ Planned Features
- Load trained `.pkl` SVM models
- Process incoming EOG signal chunks
- Return predicted eye movement commands to frontend

---

# 🚀 How to Run the Project

## ▶️ Running the Frontend Simulation

The frontend currently supports a complete simulation mode and does **not** require the backend to be active.

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

Visit:

```text
http://localhost:5173
```

Use:
- The on-screen D-Pad
- Or upload `.txt` signal files

to simulate eye movement interactions.

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

## Machine Learning
- Python
- NumPy
- SciPy
- Scikit-Learn
- PyWavelets

## Backend
- FastAPI
- REST APIs

---

# 📜 License

This project is intended for educational and research purposes.
