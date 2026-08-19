"use client";

import React, { useId } from "react";

export interface DonutChartSegment {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutChartSegment[];
  centerValue?: string | number;
  centerLabel?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLegend?: boolean;
}

export default function DonutChart({
  data,
  centerValue,
  centerLabel,
  size = 140,
  strokeWidth = 22,
  className = "",
  showLegend = true,
}: DonutChartProps) {
  const chartId = useId();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className={`flex items-center justify-between gap-4 w-full ${className}`}>
      {/* Donut Chart SVG */}
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle if total is 0 */}
          {total === 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#e5d9c3"
              strokeWidth={strokeWidth}
            />
          )}

          {/* Slices */}
          {total > 0 &&
            data.map((item, index) => {
              if (item.value === 0) return null;
              const slicePercentage = item.value / total;
              const strokeDasharray = `${slicePercentage * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeAngle * circumference;
              cumulativeAngle += slicePercentage;

              return (
                <circle
                  key={`${chartId}-${item.name}-${index}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>

        {/* Center Text (e.g. 12 Pending) */}
        {(centerValue !== undefined || centerLabel !== undefined) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {centerValue !== undefined && (
              <span className="text-xl sm:text-2xl font-bold text-[#174824] leading-none">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-[11px] font-medium text-[#5a4836] mt-0.5">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend on Right */}
      {showLegend && (
        <div className="flex-1 space-y-2.5 min-w-0 pr-1">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 text-xs sm:text-[13px]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3.5 h-2 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-[#2c221e] truncate">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-[#2c221e] flex-shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
