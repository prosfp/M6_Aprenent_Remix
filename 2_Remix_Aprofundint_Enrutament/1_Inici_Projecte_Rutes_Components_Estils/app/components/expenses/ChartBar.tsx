import React from "react";

interface ChartBarProps {
  maxValue: number;
  value: number;
  label: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ maxValue, value, label }) => {
  let barFillHeight = "0%";

  if (maxValue > 0) {
    barFillHeight = Math.round((value / maxValue) * 100) + "%";
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-40 w-full flex flex-col justify-end border border-primary-100">
        <div
          className="bg-primary-200 rounded"
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className="mt-2">{label}</div>
    </div>
  );
};

export default ChartBar;
