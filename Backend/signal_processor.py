import numpy as np
from scipy.signal import butter, filtfilt
import pywt

# ==========================================
# 1. PREPROCESSING 
# ==========================================

def butter_bandpass_filter(data, lowcut=0.5, highcut=20.0, fs=176, order=4):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)


# ==========================================
# 2. FEATURE EXTRACTION (15 Features)
# ==========================================

def extract_dwt_features(signal, wavelet='db1'):
    coeffs = pywt.wavedec(signal, wavelet, level=4)
    cA4, cD4, cD3 = coeffs[0], coeffs[1], coeffs[2]
    
    useful_bands = [cA4, cD4, cD3]
    features = []
    
    for band in useful_bands:
        energy = np.mean(np.square(band))
        mean = np.mean(band)
        std = np.std(band)
        max_val = np.max(np.abs(band))
        features.extend([energy, mean, std, max_val])
        
    return np.array(features)

def extract_morphological_features(signal):
    max_peak = np.max(signal)
    min_peak = np.min(signal)
    auc = np.trapezoid(np.abs(signal))
    return np.array([max_peak, min_peak, auc])


# ==========================================
# 3. THE MAIN FUNCTION
# ==========================================

def extract_features(raw_signal):
    # 1. Clean the incoming signal
    clean_signal = butter_bandpass_filter(raw_signal)
    
    # 2. Extract Wavelet db1 (12 features)
    f_db1 = extract_dwt_features(clean_signal, wavelet='db1')
    
    # 3. Extract Morphological (3 features)
    f_morph = extract_morphological_features(clean_signal)
    
    # 4. Concatenate them (12 + 3 = 15 features)
    final_features = np.concatenate([f_db1, f_morph])
    
    # 5. Reshape for Scikit-Learn
    return final_features.reshape(1, -1)