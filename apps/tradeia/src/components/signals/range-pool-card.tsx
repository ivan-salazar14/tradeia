"use client";

import React from "react";

interface RangePoolCardProps {
  range_min?: number;
  range_max?: number;
  confidence?: "high" | "medium" | "low";
  entry?: number;
  tp1?: number;
  stopLoss?: number;
}

export function RangePoolCard({
  range_min,
  range_max,
  confidence = "medium",
  entry,
  tp1,
  stopLoss,
}: RangePoolCardProps) {
  // Determine border style based on confidence
  const getConfidenceStyles = () => {
    switch (confidence) {
      case "high":
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          badge: "bg-green-100 text-green-800",
          badgeText: "ALTA",
        };
      case "medium":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "MEDIA",
        };
      case "low":
        return {
          border: "border-gray-400",
          bg: "bg-gray-50",
          badge: "bg-gray-100 text-gray-800",
          badgeText: "BAJA",
        };
      default:
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "MEDIA",
        };
    }
  };

  const styles = getConfidenceStyles();
  const rangeSize = range_max && range_min ? range_max - range_min : 0;

  return (
    <div
      className={`
        border-2 ${styles.border} rounded-lg p-4 ${styles.bg}
        ${confidence === "high" ? "border-dashed" : confidence === "low" ? "border-dotted" : "border-dashed"}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="font-semibold text-gray-800">Pool de Liquidez</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${styles.badge}`}>
          {styles.badgeText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Piso (Range Min) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">PISO (Range Min)</div>
          <div className="font-mono font-bold text-red-600">
            {range_min
              ? range_min.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : "-"}
          </div>
        </div>

        {/* Techo (Range Max) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">TECHO (Range Max)</div>
          <div className="font-mono font-bold text-green-600">
            {range_max
              ? range_max.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : "-"}
          </div>
        </div>
      </div>

      {/* Range Size */}
      <div className="mt-3 text-xs text-gray-600">
        <span className="font-medium">Tamaño del Rango:</span>{" "}
        <span className="font-mono">
          {rangeSize > 0
            ? rangeSize.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : "-"}
        </span>
      </div>

      {/* Entry and TP for Pool */}
      {(entry || tp1) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Entry Pool:</span>
              <span className="ml-1 font-mono font-medium">
                {entry
                  ? entry.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">TP Pool:</span>
              <span className="ml-1 font-mono font-medium text-green-600">
                {tp1
                  ? tp1.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botón de acción */}
      <button
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        onClick={() => {
          // Configurar los límites del pool en la plataforma de liquidez
          console.log("Abrir Pool con límites:", { range_min, range_max });
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Abrir Pool
      </button>
    </div>
  );
}
