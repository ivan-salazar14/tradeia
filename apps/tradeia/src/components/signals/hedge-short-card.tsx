"use client";

import React, { useState } from "react";

interface HedgeShortCardProps {
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

export function HedgeShortCard({ hedge_short }: HedgeShortCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!hedge_short) {
    return null;
  }

  const {
    entry_price,
    stop_price,
    target_price,
    size_suggestion,
    size_suggestion_pct,
    risk_pct,
    reward_pct,
    rationale,
  } = hedge_short;

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-semibold text-gray-800">
            🛡️ Protección contra Caídas (Hedge)
          </span>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
          SHORT
        </span>
      </div>

      <div className="bg-white/80 rounded-lg p-3 mb-3 shadow-sm">
        <p className="text-xs text-gray-600 italic mb-2">
          Este short se activa en el{" "}
          <span className="font-semibold">mismo instante</span> que el pool
        </p>
        <p className="text-sm text-gray-700 font-medium">{rationale}</p>
      </div>

      {/* Orden Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Entry Price */}
        <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-3 shadow-sm border border-red-100">
          <div className="text-xs text-gray-500 mb-1 font-medium">Precio de Entrada</div>
          <div className="font-mono font-bold text-red-600 text-lg">
            {entry_price
              ? entry_price.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })
              : "-"}
          </div>
          <div className="text-xs text-gray-400 mt-1">📈 Market Order</div>
        </div>

        {/* Stop Loss */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-3 shadow-sm border border-orange-100">
          <div className="text-xs text-gray-500 mb-1 font-medium">Stop Loss (Trigger)</div>
          <div className="font-mono font-bold text-orange-600 text-lg">
            {stop_price
              ? stop_price.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })
              : "-"}
          </div>
          <div className="text-xs text-gray-400 mt-1">🔒 Stop Market (Techo)</div>
        </div>
      </div>

      {/* Target Price */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-3 mb-3 shadow-sm border border-green-100">
        <div className="text-xs text-gray-500 mb-1 font-medium">Precio Objetivo</div>
        <div className="font-mono font-bold text-green-600 text-lg">
          {target_price
            ? target_price.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })
            : "-"}
        </div>
        <div className="text-xs text-gray-400 mt-1">🎯 Objetivo en el Piso del Rango</div>
      </div>

      {/* Risk/Reward */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/70 rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1 font-medium">Riesgo</div>
          <div className="font-mono font-bold text-red-600">
            {risk_pct ? `${risk_pct.toFixed(2)}%` : (stop_price && entry_price ? `${(((stop_price - entry_price) / entry_price) * 100).toFixed(2)}%` : "-")}
          </div>
        </div>
        <div className="bg-white/70 rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1 font-medium">Recompensa</div>
          <div className="font-mono font-bold text-green-600">
            {reward_pct ? `${reward_pct.toFixed(2)}%` : (entry_price && target_price ? `${(((entry_price - target_price) / entry_price) * 100).toFixed(2)}%` : "-")}
          </div>
        </div>
      </div>

      {/* Size Suggestion */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <div className="text-xs text-yellow-800 font-semibold">
              📊 Sugerencia de Tamaño
            </div>
            <div className="text-sm text-yellow-900 font-bold">
              {size_suggestion_pct ? `${size_suggestion_pct.toFixed(1)}% del capital` : size_suggestion || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Rationale */}
      <div className="mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {isExpanded ? 'Ocultar rationale' : 'Ver rationale completo'}
        </button>
        {isExpanded && (
          <div className="mt-2 text-xs text-gray-600 bg-white p-3 rounded border border-gray-200 shadow-sm">
            {rationale}
          </div>
        )}
      </div>

      {/* Botón de acción */}
      <button
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        onClick={() => {
          // Activar el short de protección
          console.log("Activar Short Hedge:", {
            entry_price,
            stop_price,
            target_price,
          });
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        Activar Short de Protección
      </button>
    </div>
  );
}
