"use client";

import React, { useState } from "react";

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
  // Protection field for partial close at range floor
  protection?: {
    trigger_price: number;
    close_pct: number;
    remaining_pct: number;
    rationale: string;
  };
  // Side Protection fields
  suggested_protection?: 'STOP_MARKET_SIDE' | 'STOP_MARKET_SINGLE' | 'PARTIAL_PROTECTION' | 'NONE';
  side_protection?: {
    bottom_trigger: number;
    top_trigger: number;
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
  protection,
  suggested_protection,
  side_protection,
}: RangePoolCardProps) {
  const [isHoveringHedge, setIsHoveringHedge] = useState(false);
  
  // Use stopLoss and tp1 as fallback if range values are not available
  const effectiveRangeMin = range_min ?? stopLoss;
  const effectiveRangeMax = range_max ?? tp1;
  
  // Normalize confidence to lowercase for comparison
  const normalizedConfidence = confidence?.toLowerCase() || "medium";

  // Enhanced confidence styles with richer aesthetics
  const getConfidenceStyles = () => {
    switch (normalizedConfidence) {
      case "high":
        return {
          border: "border-emerald-500",
          bg: "bg-gradient-to-br from-emerald-50 to-green-50",
          badge: "bg-emerald-100 text-emerald-800",
          badgeText: "ALTA",
          iconColor: "text-emerald-600",
          gradient: "from-emerald-100 via-green-50 to-emerald-100",
          glow: "shadow-emerald-200/50",
        };
      case "medium":
        return {
          border: "border-amber-500",
          bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
          badge: "bg-amber-100 text-amber-800",
          badgeText: "MEDIA",
          iconColor: "text-amber-600",
          gradient: "from-amber-100 via-yellow-50 to-amber-100",
          glow: "shadow-amber-200/50",
        };
      case "low":
        return {
          border: "border-slate-400",
          bg: "bg-gradient-to-br from-slate-50 to-gray-50",
          badge: "bg-slate-100 text-slate-700",
          badgeText: "BAJA",
          iconColor: "text-slate-500",
          gradient: "from-slate-100 via-gray-50 to-slate-100",
          glow: "shadow-slate-200/50",
        };
      default:
        return {
          border: "border-amber-500",
          bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
          badge: "bg-amber-100 text-amber-800",
          badgeText: "MEDIA",
          iconColor: "text-amber-600",
          gradient: "from-amber-100 via-yellow-50 to-amber-100",
          glow: "shadow-amber-200/50",
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

  // Calculate protection trigger position
  const protectionTriggerPercent = protection?.trigger_price 
    ? calculatePositionPercent(protection.trigger_price) 
    : null;

  return (
    <div
      className={`
        border-2 ${styles.border} rounded-xl p-4 ${styles.bg}
        ${normalizedConfidence === "high" ? "border-dashed" : normalizedConfidence === "low" ? "border-dotted" : "border-dashed"}
        transition-all duration-300 hover:shadow-lg ${styles.glow}
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
          CONFIANZA {styles.badgeText}
        </span>
      </div>

      {/* Visual Range Bar - Enhanced with gradient */}
      {effectiveRangeMin && effectiveRangeMax && (
        <div className="mb-4">
          <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
            {/* Range Zone with gradient */}
            <div className={`absolute inset-y-0 left-0 right-0 bg-gradient-to-r ${styles.gradient} opacity-60`}></div>
            
            {/* Range Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <span className="text-xs font-mono font-bold text-red-700 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                {effectiveRangeMin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-mono font-bold text-green-700 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                {effectiveRangeMax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Entry Position Marker */}
            {entry && (
              <div 
                className="absolute top-0 bottom-0 w-1 bg-blue-600 z-10 transition-all duration-300"
                style={{ left: `${entryPercent}%` }}
              >
                <div className="absolute -top-1 -left-1.5 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Protection Trigger Line - Dotted Orange */}
            {protection?.trigger_price && protectionTriggerPercent !== null && (
              <div 
                className="absolute top-0 bottom-0 z-10 border-l-2 border-dashed border-orange-500"
                style={{ left: `${protectionTriggerPercent}%` }}
              >
                <div className="absolute -top-1 -left-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-1 flex justify-center items-center gap-2">
            <span className="text-xs text-gray-600">Entrada: </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {entry?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
            </span>
            {protection?.trigger_price && (
              <span className="text-xs text-orange-600 ml-2">
                | Protecc: {protection.trigger_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            )}
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

      {/* Hedge Short Info - Integrated View with hover effect */}
      {hedge_short && hedge_short.entry_price !== undefined && (
        <div 
          className="mt-3 pt-3 border-t border-red-200"
          onMouseEnter={() => setIsHoveringHedge(true)}
          onMouseLeave={() => setIsHoveringHedge(false)}
        >
          <div className={`bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 border transition-all duration-300 ${isHoveringHedge ? 'border-red-300 shadow-md' : 'border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-semibold text-red-800">🛡️ Protección de Liquidez (Hedge)</span>
              <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium transition-colors ${isHoveringHedge ? 'bg-red-200 text-red-900' : 'bg-red-100 text-red-800'}`}>
                {hedge_short.size_suggestion_pct ? `${hedge_short.size_suggestion_pct.toFixed(1)}%` : hedge_short.size_suggestion || 'N/A'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white/70 rounded p-2 transition-all duration-300">
                <span className="text-gray-500">Entrada Short</span>
                <div className="font-mono font-medium text-red-600">
                  {hedge_short.entry_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
              <div className="bg-white/70 rounded p-2 transition-all duration-300">
                <span className="text-gray-500">Stop (Techo)</span>
                <div className="font-mono font-medium text-orange-600">
                  {hedge_short.stop_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
              <div className="bg-white/70 rounded p-2 transition-all duration-300">
                <span className="text-gray-500">Objetivo (Piso)</span>
                <div className="font-mono font-medium text-green-600">
                  {hedge_short.target_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
              </div>
            </div>
            {hedge_short.rationale && (
              <div className="mt-2 text-xs text-gray-600 italic bg-white/50 p-2 rounded">
                💡 {hedge_short.rationale}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Protection Info - Partial Close at Range Floor - Enhanced */}
      {protection && protection.trigger_price !== undefined && (
        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-semibold text-orange-800">🛡️ Seguro de Salida (Protección Parcial)</span>
              <span className="ml-auto px-2 py-0.5 bg-orange-200 text-orange-900 rounded text-xs font-bold">
                {(protection.close_pct * 100).toFixed(0)}% cierre
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="bg-white/70 rounded-lg p-3 shadow-sm">
                <span className="text-gray-500 block mb-1">Trigger de Cierre</span>
                <div className="font-mono font-bold text-orange-600 text-lg">
                  {protection.trigger_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "-"}
                </div>
                <span className="text-xs text-gray-400">📍 (piso del rango)</span>
              </div>
              <div className="bg-white/70 rounded-lg p-3 shadow-sm">
                <span className="text-gray-500 block mb-1">Posición Restante</span>
                <div className="font-mono font-bold text-blue-600 text-lg">
                  {(protection.remaining_pct * 100).toFixed(0)}%
                </div>
                <span className="text-xs text-gray-400">🚀 (para rebote)</span>
              </div>
            </div>
            {/* Enhanced Visual Progress Bar */}
            <div className="mt-2 mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Cerrar: {(protection.close_pct * 100).toFixed(0)}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Mantener: {(protection.remaining_pct * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(protection.close_pct * 100)}%` }}
                />
              </div>
            </div>
            {protection.rationale && (
              <div className="text-xs text-gray-600 italic bg-white/60 p-2 rounded border border-orange-100">
                📖 {protection.rationale}
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
