"use client";

import React from "react";

interface RangePoolCardProps {
  range_min?: number;
  range_max?: number;
  confidence?: "high" | "medium" | "low" | string;
  entry?: number;
  tp1?: number;
  stopLoss?: number;
  hedge_short?: {
    entry_price: number;
    stop_price: number;
    target_price: number;
    size_suggestion?: string;
    size_suggestion_pct?: number;
    risk_pct?: number;
    reward_pct?: number;
    rationale: string;
  };
}

export function RangePoolCard({
  range_min,
  range_max,
  confidence = "medium",
  entry,
  tp1,
  stopLoss,
  hedge_short,
}: RangePoolCardProps) {
  // Use stopLoss and tp1 as fallback if range values are not available
  const effectiveRangeMin = range_min ?? stopLoss;
  const effectiveRangeMax = range_max ?? tp1;
  
  // Normalize confidence to lowercase for comparison
  const normalizedConfidence = confidence?.toLowerCase() || "medium";

  // Determine border style based on confidence
  const getConfidenceStyles = () => {
    switch (normalizedConfidence) {
      case "high":
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          badge: "bg-green-100 text-green-800",
          badgeText: "ALTA",
          iconColor: "text-green-600",
        };
      case "medium":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "MEDIA",
          iconColor: "text-yellow-600",
        };
      case "low":
        return {
          border: "border-red-400",
          bg: "bg-red-50",
          badge: "bg-red-100 text-red-800",
          badgeText: "BAJA",
          iconColor: "text-red-600",
        };
      default:
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "MEDIA",
          iconColor: "text-yellow-600",
        };
    }
  };

  const styles = getConfidenceStyles();
  const rangeSize = effectiveRangeMax && effectiveRangeMin ? effectiveRangeMax - effectiveRangeMin : 0;
  
  // Calculate position percentage for the entry price within the range
  const calculatePositionPercent = (price: number) => {
    if (!effectiveRangeMin || !effectiveRangeMax || rangeSize === 0) return 50;
    const percent = ((price - effectiveRangeMin) / rangeSize) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const entryPercent = entry ? calculatePositionPercent(entry) : 50;

  return (
    <div
      className={`
        border-2 ${styles.border} rounded-lg p-4 ${styles.bg}
        ${normalizedConfidence === "high" ? "border-dashed" : normalizedConfidence === "low" ? "border-dotted" : "border-dashed"}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 ${styles.iconColor}`}
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

      {/* Visual Range Bar */}
      {effectiveRangeMin && effectiveRangeMax && (
        <div className="mb-4">
          <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
            {/* Range Zone */}
            <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 opacity-50"></div>
            
            {/* Range Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <span className="text-xs font-mono font-bold text-red-700 bg-white/80 px-1 rounded">
                {effectiveRangeMin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-mono font-bold text-green-700 bg-white/80 px-1 rounded">
                {effectiveRangeMax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Entry Position Marker */}
            {entry && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-10"
                style={{ left: `${entryPercent}%` }}
              >
                <div className="absolute -top-1 -left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-gray-600">Entrada: </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {entry?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Piso (Range Min) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">PISO (Range Min)</div>
          <div className="font-mono font-bold text-red-600">
            {effectiveRangeMin
              ? effectiveRangeMin.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : "-"}
          </div>
        </div>

        {/* Techo (Range Max) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">TECHO (Range Max)</div>
          <div className="font-mono font-bold text-green-600">
            {effectiveRangeMax
              ? effectiveRangeMax.toLocaleString(undefined, {
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
        {rangeSize > 0 && entry && (
          <span className="ml-2 text-gray-500">
            ({((rangeSize / entry) * 100).toFixed(2)}% del precio)
          </span>
        )}
      </div>

      {/* Entry and TP for Pool */}
      {(entry || effectiveRangeMax) && (
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
                {effectiveRangeMax
                  ? effectiveRangeMax.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hedge Short Info - Integrated View */}
      {hedge_short && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-semibold text-red-800">Short de Cobertura</span>
              <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                {hedge_short.size_suggestion_pct ? `${hedge_short.size_suggestion_pct.toFixed(1)}%` : hedge_short.size_suggestion || 'N/A'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Entry:</span>
                <div className="font-mono font-medium text-red-600">
                  {hedge_short.entry_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Stop:</span>
                <div className="font-mono font-medium text-orange-600">
                  {hedge_short.stop_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>
                <div className="font-mono font-medium text-green-600">
                  {hedge_short.target_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
            </div>
            {hedge_short.rationale && (
              <div className="mt-2 text-xs text-gray-600 italic">
                {hedge_short.rationale}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón de acción */}
      <button
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        onClick={() => {
          // Configurar los límites del pool en la plataforma de liquidez
          console.log("Abrir Pool con límites:", { range_min: effectiveRangeMin, range_max: effectiveRangeMax });
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
