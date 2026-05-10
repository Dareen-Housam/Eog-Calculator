export default function CalculatorGrid({
  activeQuadrant,
  highlightedButton,
  mapping,
  step,
}) {
  const renderQuadrant = (quadrantKey, directionLabel) => {
    const isActive = activeQuadrant === quadrantKey;
    const isIdle = step === "IDLE";

    let quadClass = "bg-slate-50 border-slate-200 border-2";
    let labelClass = "text-slate-400";

    if (isActive) {
      quadClass =
        "bg-blue-50 border-blue-400 border-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105 z-10";
      labelClass = "text-blue-600 font-black scale-110";
    } else if (!isIdle) {
      quadClass = "bg-slate-100 opacity-40 border-slate-200 border-2 grayscale";
      labelClass = "opacity-20";
    }

    return (
      <div className="flex flex-col gap-2 transition-all duration-300">
        <div
          className={`text-center text-[10px] font-bold uppercase tracking-widest transition-all ${labelClass}`}
        >
          {directionLabel}
        </div>

        <div
          className={`grid grid-cols-2 gap-2 lg:gap-3 p-2 lg:p-4 rounded-2xl relative transition-all duration-300 ${quadClass}`}
        >
          {isActive && step === "QUADRANT" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] animate-ping" />
          )}

          {Object.values(mapping[quadrantKey]).map((value) => {
            const isButtonHighlighted = highlightedButton === value;

            return (
              <div
                key={value}
                className={`flex items-center justify-center h-12 lg:h-16 rounded-xl text-xl lg:text-3xl font-bold transition-all duration-300 ${
                  isButtonHighlighted
                    ? "bg-blue-500 text-white scale-110 shadow-[0_0_25px_rgba(59,130,246,0.9)] z-20 border-2 border-blue-300"
                    : "bg-white text-slate-700 shadow-sm border border-slate-200"
                }`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 relative">
      {step === "IDLE" && (
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full shadow-[0_0_25px_rgba(250,204,21,1)] animate-pulse z-50 border-4 border-white pointer-events-none" />
      )}

      {renderQuadrant("Up", "Look Up")}
      {renderQuadrant("Right", "Look Right")}
      {renderQuadrant("Left", "Look Left")}
      {renderQuadrant("Down", "Look Down")}
    </div>
  );
}
