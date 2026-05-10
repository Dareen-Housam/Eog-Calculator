import { useState, useRef, useEffect } from "react";

export default function SimulatorPanel({ onSimulateMove }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState({ text: "", type: "" });

  const latestMoveRef = useRef(onSimulateMove);
  useEffect(() => {
    latestMoveRef.current = onSimulateMove;
  }, [onSimulateMove]);

  const btnStyle =
    "bg-slate-700 hover:bg-blue-500 active:bg-blue-600 active:scale-95 text-white font-bold p-3 lg:p-4 rounded-xl shadow-[0_4px_0_rgb(51,65,85)] hover:shadow-[0_4px_0_rgb(37,99,235)] transition-all flex items-center justify-center text-xs lg:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const formatMove = (move) => {
    if (!move) return "";
    const clean = String(move)
      .replace(/[^a-zA-Z]/g, "")
      .toLowerCase();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setStatus({ text: "Uploading and analyzing...", type: "" });

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

      if (response.ok && data.success && data.predictions) {
        setStatus({
          text: `Found ${data.predictions.length} movements! Executing...`,
          type: "success",
        });

        for (let i = 0; i < data.predictions.length; i++) {
          const exactMove = formatMove(data.predictions[i]);

          if (["Up", "Down", "Left", "Right", "Blink"].includes(exactMove)) {
            latestMoveRef.current(exactMove);

            setStatus({
              text: `Executed [${i + 1}/${data.predictions.length}]: ${exactMove.toUpperCase()}`,
              type: "success",
            });
          } else {
            setStatus({
              text: `Skipped unrecognized move: ${exactMove}`,
              type: "error",
            });
          }

          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        setStatus({ text: "Sequence Complete!", type: "success" });
        setTimeout(() => setStatus({ text: "", type: "" }), 3000);
      } else {
        setStatus({
          text: data.detail || "Could not process signal.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus({ text: "Server offline. Check Hugging Face.", type: "error" });
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const handleManualMove = (e, move) => {
    e.preventDefault();
    setStatus({ text: `Simulated: ${move.toUpperCase()}`, type: "success" });
    onSimulateMove(move);
    setTimeout(() => setStatus({ text: "", type: "" }), 1500);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 lg:p-8 rounded-3xl shadow-2xl w-full flex flex-col items-center">
      <h2 className="text-sm lg:text-lg font-black mb-4 text-center text-blue-400 uppercase tracking-[0.3em]">
        EOG Input
      </h2>

      {status.text && (
        <div
          className={`w-full mb-4 p-3 rounded-lg text-xs lg:text-sm font-bold text-center animate-fade-in border ${
            status.type === "error"
              ? "bg-red-500/10 text-red-400 border-red-500/30"
              : "bg-green-500/10 text-green-400 border-green-500/30"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="w-full mb-8">
        <label
          className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl transition-all ${
            isProcessing
              ? "border-yellow-400 bg-yellow-400/10 cursor-wait"
              : "border-slate-500 hover:border-blue-400 hover:bg-slate-700 cursor-pointer"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-2 text-center">
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-yellow-400 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-xs font-bold text-yellow-400 tracking-wider truncate w-48">
                  Processing: {fileName}
                </p>
              </>
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
                  Upload Signal (.txt, .xlsx)
                </p>
                {fileName && !status.text.includes("Server") && (
                  <p className="text-[10px] text-slate-500 mt-1 truncate w-48">
                    Last: {fileName}
                  </p>
                )}
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".txt, .xlsx"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:gap-3 w-full">
        <div />
        <button
          type="button"
          onClick={(e) => handleManualMove(e, "Up")}
          className={btnStyle}
          disabled={isProcessing}
        >
          UP
        </button>
        <div />
        <button
          type="button"
          onClick={(e) => handleManualMove(e, "Left")}
          className={btnStyle}
          disabled={isProcessing}
        >
          LEFT
        </button>
        <button
          type="button"
          onClick={(e) => handleManualMove(e, "Blink")}
          disabled={isProcessing}
          className="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 disabled:opacity-50 text-slate-900 rounded-full w-full h-full flex items-center justify-center font-black shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-95 transition-all aspect-square border-4 border-yellow-200 text-[10px] lg:text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          BLINK
        </button>
        <button
          type="button"
          onClick={(e) => handleManualMove(e, "Right")}
          className={btnStyle}
          disabled={isProcessing}
        >
          RIGHT
        </button>
        <div />
        <button
          type="button"
          onClick={(e) => handleManualMove(e, "Down")}
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
