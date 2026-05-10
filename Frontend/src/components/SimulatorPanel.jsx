import { useState } from "react";

export default function SimulatorPanel({ onSimulateMove }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const btnStyle =
    "bg-slate-700 hover:bg-blue-500 active:bg-blue-600 active:scale-95 text-white font-bold p-3 lg:p-4 rounded-xl shadow-[0_4px_0_rgb(51,65,85)] hover:shadow-[0_4px_0_rgb(37,99,235)] transition-all flex items-center justify-center text-xs lg:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://dareen-housam-eog-calculator-api.hf.space/predict",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        onSimulateMove(data.prediction);
      } else {
        alert(`Backend Error: ${data.detail || "Could not process signal"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the Python backend. Is FastAPI running?");
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 lg:p-8 rounded-3xl shadow-2xl w-full flex flex-col items-center">
      <h2 className="text-sm lg:text-lg font-black mb-6 text-center text-blue-400 uppercase tracking-[0.3em]">
        EOG Input
      </h2>

      <div className="w-full mb-8">
        <label
          className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isProcessing ? "border-yellow-400 bg-yellow-400/10" : "border-slate-500 hover:border-blue-400 hover:bg-slate-700"}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isProcessing ? (
              <p className="text-sm font-bold text-yellow-400 animate-pulse">
                Running SVM Model...
              </p>
            ) : (
              <>
                <svg
                  className="w-6 h-6 mb-2 text-slate-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Upload Signal (.txt)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      {/* Buttons remain exactly the same */}
      <div className="grid grid-cols-3 gap-2 lg:gap-3 w-full">
        <div />
        <button
          onClick={() => onSimulateMove("Up")}
          className={btnStyle}
          disabled={isProcessing}
        >
          UP
        </button>
        <div />
        <button
          onClick={() => onSimulateMove("Left")}
          className={btnStyle}
          disabled={isProcessing}
        >
          LEFT
        </button>
        <button
          onClick={() => onSimulateMove("Blink")}
          disabled={isProcessing}
          className="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 disabled:opacity-50 text-slate-900 rounded-full w-full h-full flex items-center justify-center font-black shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-95 transition-all aspect-square border-4 border-yellow-200 text-[10px] lg:text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          BLINK
        </button>
        <button
          onClick={() => onSimulateMove("Right")}
          className={btnStyle}
          disabled={isProcessing}
        >
          RIGHT
        </button>
        <div />
        <button
          onClick={() => onSimulateMove("Down")}
          className={btnStyle}
          disabled={isProcessing}
        >
          DOWN
        </button>
        <div />
      </div>
    </div>
  );
}
