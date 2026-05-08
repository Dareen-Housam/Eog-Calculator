import { useState } from "react";
import CalculatorScreen from "./components/CalculatorScreen";
import SimulatorPanel from "./components/SimulatorPanel";
import CalculatorGrid from "./components/CalculatorGrid";

const buttonMapping = {
  Up: { Up: "7", Right: "8", Left: "4", Down: "5" },
  Right: { Up: "9", Right: "/", Left: "6", Down: "x" },
  Left: { Up: "1", Right: "2", Left: "C", Down: "0" },
  Down: { Up: "3", Right: "-", Left: "E", Down: "+" },
};

export default function App() {
  const [equation, setEquation] = useState("");
  const [step, setStep] = useState("IDLE");
  const [activeQuadrant, setActiveQuadrant] = useState(null);
  const [highlightedButton, setHighlightedButton] = useState(null);

  const autoCalculate = (currentEq) => {
    try {
      const parseable = currentEq.replace("x", "*");
      const calcRegex = /^(\d+)([-+*/])(\d+)$/;

      if (calcRegex.test(parseable)) {
        const parts = parseable.match(calcRegex);
        const n1 = parseFloat(parts[1]);
        const op = parts[2];
        const n2 = parseFloat(parts[3]);

        if (op === "+") return String(n1 + n2);
        if (op === "-") return String(n1 - n2);
        if (op === "*") return String(n1 * n2);
        if (op === "/") return String(Math.round((n1 / n2) * 100) / 100);
      }
    } catch {
      // Intentionally empty for ESLint
    }
    return currentEq;
  };

  const handleMovement = (movement) => {
    if (movement === "Blink") {
      if (step === "BUTTON" && highlightedButton) {
        if (highlightedButton === "C") {
          setEquation("");
        } else if (highlightedButton === "E") {
          setEquation("EXIT");
        } else {
          const newEq =
            equation === "EXIT" || equation === "0"
              ? highlightedButton
              : equation + highlightedButton;
          setEquation(autoCalculate(newEq));
        }
      }
      setStep("IDLE");
      setActiveQuadrant(null);
      setHighlightedButton(null);
      return;
    }

    if (step === "IDLE") {
      setActiveQuadrant(movement);
      setStep("QUADRANT");
    } else if (step === "QUADRANT") {
      const selectedValue = buttonMapping[activeQuadrant][movement];
      setHighlightedButton(selectedValue);
      setStep("BUTTON");
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16">
      {/* Left Side: Logo & Simulation Controls */}
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* --- ADDED THE LOGO HERE --- */}
        <div className="flex flex-col items-center justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]"
          >
            {/* The Outer Eye Shape */}
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            {/* The Iris/Pupil */}
            <circle cx="12" cy="12" r="4" />
            {/* The Math Symbol (Plus) inside the pupil */}
            <path d="M12 10v4M10 12h4" />
          </svg>
          <h1 className="text-white text-2xl font-black mt-3 tracking-widest uppercase">
            EOG Calc
          </h1>
          <p className="text-blue-400 text-xs tracking-widest mt-1">
            HCI Interface
          </p>
        </div>

        <SimulatorPanel onSimulateMove={handleMovement} />
      </div>

      {/* Right Side: Main Calculator Interface */}
      <div className="bg-white p-4 lg:p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] w-full max-w-md">
        <CalculatorScreen equation={equation} />

        <CalculatorGrid
          activeQuadrant={activeQuadrant}
          highlightedButton={highlightedButton}
          mapping={buttonMapping}
          step={step}
        />

        <div className="mt-8 text-center">
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-full text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            {step === "IDLE" && "Step 1: Select Quadrant (Look)"}
            {step === "QUADRANT" && "Step 2: Select Button (Look)"}
            {step === "BUTTON" && "Step 3: Confirm (Blink)"}
          </div>
        </div>
      </div>
    </div>
  );
}
