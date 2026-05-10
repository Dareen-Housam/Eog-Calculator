import numpy as np
from scipy.signal import butter, filtfilt
import pywt

# ==========================================
# 1. PREPROCESSING
# ==========================================

def remove_dc(signal):
    return signal - np.mean(signal)

def butter_bandpass_filter(data, lowcut=0.5, highcut=20.0, fs=176, order=4):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)

def preprocess_signal(signal):
    signal = remove_dc(signal)
    filtered = butter_bandpass_filter(signal)
    normalized = (filtered - np.mean(filtered)) / (np.std(filtered) + 1e-6)
    return normalized


# ==========================================
# 2. FEATURE EXTRACTION
# ==========================================

def extract_dwt_features(signal, wavelet='db4'):
    coeffs = pywt.wavedec(signal, wavelet, level=4)
    cA4, cD4, cD3, cD2, cD1 = coeffs
    
    # The notebook only uses these 3 bands
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
# 3. THE MAIN BRIDGE FUNCTION
# ==========================================

def extract_features(raw_signal):
    
    # 1. Clean the incoming signal
    clean_signal = preprocess_signal(raw_signal)
    
    # 2. Extract Wavelets (12 features each)
    f_db1 = extract_dwt_features(clean_signal, wavelet='db1')
    f_db2 = extract_dwt_features(clean_signal, wavelet='db2')
    f_db4 = extract_dwt_features(clean_signal, wavelet='db4')
    
    # 3. Extract Morphological (3 features)
    f_morph = extract_morphological_features(clean_signal)
    
    # 4. Concatenate them all together (12 + 12 + 12 + 3 = 39 features)
    final_features = np.concatenate([f_db1, f_db2, f_db4, f_morph])
    
    # 5. Reshape for Scikit-Learn (1 sample, 39 features)
    return final_features.reshape(1, -1)