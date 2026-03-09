"use client";

import React from "react";

interface SideProtectionCardProps {
  side_protection?: {
    bottom_trigger: number;
    top_trigger: number;
    rationale: string;
  };
  suggested_protection?: 'STOP_MARKET_SIDE' | 'STOP_MARKET_SINGLE' | 'PARTIAL_PROTECTION' | 'NONE';
  poolEntry?: number;
  poolRangeMin?: number;
  poolRangeMax?: number;
}

export function SideProtectionCard({
  side_protection,
  suggested_protection,
  poolEntry,
  poolRangeMin,
  poolRangeMax,
}: SideProtectionCardProps) {
  if (!side_protection || !side_protection.bottom_trigger || !side_protection.top_trigger) {
    return null;
  }

  const { bottom_trigger, top_trigger, rationale } = side_protection;
  
  // Calculate range size
  const rangeSize = top_trigger - bottom_trigger;
  const rangeSizePercent = poolEntry ? (rangeSize / poolEntry) * 100 : 0;

  // Calculate position percentages for visual bar
  const calculatePositionPercent = (price: number) => {
    if (!poolRangeMin || !poolRangeMax || rangeSize === 0) return 50;
    const percent = ((price - poolRangeMin) / rangeSize) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const bottomTriggerPercent = calculatePositionPercent(bottom_trigger);
  const topTriggerPercent = calculatePositionPercent(top_trigger);
  const entryPercent = poolEntry ? calculatePositionPercent(poolEntry) : 50;

  // Check if this is the suggested protection
  const isSuggested = suggested_protection === 'STOP_MARKET_SIDE';

  return (
    <div className={`mt-3 pt-3 border-t ${isSuggested ? 'border-purple-300' : 'border-gray-200'}`}>
      <div className={`rounded-lg p-4 border ${isSuggested ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${isSuggested ? 'text-purple-600' : 'text-gray-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className={`font-semibold ${isSuggested ? 'text-purple-800' : 'text-gray-800'}`}>
              🛡️ Protección Lateral (Side Protection)
            </span>
            {isSuggested && (
              <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs font-bold">
                RECOMENDADO
              </span>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-600 italic">
            <span className="font-semibold">¿Cómo funciona?</span> Al activar el pool, se crean simultáneamente dos órdenes Stop Market:
            una <span className="text-red-600 font-medium">Short</span> si el precio baja al trigger inferior, y una{" "}
            <span className="text-green-600 font-medium">Long</span> si sube al trigger superior.
          </p>
        </div>

        {/* Visual Range Bar with Triggers */}
        {poolRangeMin && poolRangeMax && (
          <div className="mb-4">
            <div className="relative h-10 bg-gray-200 rounded-lg overflow-hidden">
              {/* Range Zone */}
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 opacity-50"></div>
              
              {/* Bottom Trigger Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                style={{ left: `${bottomTriggerPercent}%` }}
              >
                <div className="absolute -top-1 -left-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Top Trigger Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-green-600 z-10"
                style={{ left: `${topTriggerPercent}%` }}
              >
                <div className="absolute -top-1 -left-3 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Entry Marker (if available) */}
              {poolEntry && (
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-blue-600 z-20"
                  style={{ left: `${entryPercent}%` }}
                >
                  <div className="absolute -top-1 -left-0.5 w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-red-600 font-mono font-bold">
                ↓ {bottom_trigger.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-gray-500">
                Entry: {poolEntry?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-'}
              </span>
              <span className="text-green-600 font-mono font-bold">
                ↑ {top_trigger.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Trigger Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Bottom Trigger - Short */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="text-xs text-gray-500">Bottom Trigger (Short)</span>
            </div>
            <div className="font-mono font-bold text-red-600">
              {bottom_trigger.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400">Stop Market @ precio</div>
          </div>

          {/* Top Trigger - Long */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs text-gray-500">Top Trigger (Long)</span>
            </div>
            <div className="font-mono font-bold text-green-600">
              {top_trigger.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400">Stop Market @ precio</div>
          </div>
        </div>

        {/* Range Info */}
        <div className="bg-gray-100 rounded-lg p-2 mb-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Distancia entre triggers:</span>
            <span className="font-mono font-medium">
              {rangeSize.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({rangeSizePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Rationale */}
        {rationale && (
          <div className="mt-2 text-xs text-gray-600 italic bg-white p-2 rounded border border-gray-200">
            📖 {rationale}
          </div>
        )}

        {/* Action Button */}
        <button
          className={`mt-3 w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isSuggested 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
          onClick={() => {
            console.log("Activar Side Protection:", {
              bottom_trigger,
              top_trigger,
              rationale,
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Activar Side Protection
        </button>
      </div>
    </div>
  );
}
