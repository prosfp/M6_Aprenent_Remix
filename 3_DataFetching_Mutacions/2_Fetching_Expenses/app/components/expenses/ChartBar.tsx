import React from "react";

interface ChartBarProps {
  maxValue: number;
  value: number;
  label: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ maxValue, value, label }) => {
  const barFillHeight =
    maxValue > 0 ? `${Math.round((value / maxValue) * 100)}%` : "0%";

  return (
    <div className="flex flex-col items-center">
      <div className="h-40 w-8 flex flex-col justify-end border border-gray-300 rounded bg-gray-100 overflow-hidden">
        <div
          className="bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-700">{label}</div>
    </div>
  );
};

export default ChartBar;
