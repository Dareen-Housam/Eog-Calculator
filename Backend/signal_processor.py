import numpy as np
from scipy.signal import butter, filtfilt

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