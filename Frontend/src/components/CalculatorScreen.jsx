export default function CalculatorScreen({ equation }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6 shadow-inner h-20 flex items-end justify-end overflow-hidden border-2 border-gray-200">
      <span className="text-4xl font-mono text-gray-800 tracking-wider">
        {equation || "0"}
      </span>
    </div>
  );
}
