"use client";

import React from "react";
import { RangePoolCard } from "./range-pool-card";
import { HedgeShortCard } from "./hedge-short-card";

interface RangeDetectionSignalProps {
  signal: {
    range_min?: number;
    range_max?: number;
    confidence?: "high" | "medium" | "low";
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
  };
}

export function RangeDetectionSignal({ signal }: RangeDetectionSignalProps) {
  console.log('[RangeDetectionSignal] signal:', JSON.stringify(signal, null, 2));
  console.log('[RangeDetectionSignal] hedge_short:', JSON.stringify(signal.hedge_short, null, 2));
  
  return (
    <div className="space-y-4">
      {/* Pool Card - Always show when RangeDetection */}
      <RangePoolCard
        range_min={signal.range_min}
        range_max={signal.range_max}
        confidence={signal.confidence}
        entry={signal.entry}
        tp1={signal.tp1}
        stopLoss={signal.stopLoss}
        hedge_short={signal.hedge_short}
      />

      {/* Hedge Short Card - Shows protection details */}
      {signal.hedge_short && signal.hedge_short.entry_price !== undefined && (
        <HedgeShortCard hedge_short={signal.hedge_short} />
      )}

      {/* Business Logic Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <div>
            <div className="text-sm font-semibold text-blue-800">
              Lógica de Negocio: ¿Por qué el Short?
            </div>
            <ul className="mt-2 text-xs text-blue-700 space-y-1">
              <li>
                • Si el precio <span className="font-semibold">baja</span>: el
                pool sufre impermanent loss, pero el{" "}
                <span className="font-semibold">short gana dinero</span>,
                compensando la pérdida.
              </li>
              <li>
                • Si el precio{" "}
                <span className="font-semibold">sube</span>: el short se cierra
                en el stop_price (techo del rango), asumiendo una{" "}
                <span className="font-semibold">pequeña pérdida controlada</span>
                , mientras el pool se mantiene en ganancias.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
