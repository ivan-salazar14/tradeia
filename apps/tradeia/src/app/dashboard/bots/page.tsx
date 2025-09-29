"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Strategy = { id: string; name: string };

export default function BotsPage() {
  const [options, setOptions] = useState<Strategy[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [active, setActive] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Descripciones detalladas por estrategia (fuente: docs/integrations/STRATEGIES_DEV_REFERENCE.md)
  const descriptions: Record<string, string> = {
    conservative:
      "Estrategia Conservadora: muy estricta; exige cumplir 5/5 condiciones. Umbrales altos: RSI < 25 o > 75, ADX > 30, |SQZMOM| > 15, |DMI+ - DMI-| > 12, ATR > 100. Dirección exige extremo de RSI y confirmación por DMI. TP1=ATR×1.5, TP2=ATR×2.5, SL=ATR×1.0.",
    moderate:
      "Estrategia Moderada: balancea calidad y frecuencia; requiere 3/5 condiciones. Umbrales: RSI < 30 o > 70, ADX > 20, |SQZMOM| > 7, |DMI+ - DMI-| > 6, ATR > 35. Dirección prioriza extremos de RSI o dominancia DMI. TP1=ATR×2.0, TP2=ATR×4.0, SL=ATR×1.5.",
    aggressive:
      "Estrategia Agresiva: mayor frecuencia y riesgo. Condiciones menos estrictas y objetivos más amplios. Úsala para capturar más oportunidades con mayor volatilidad. (Descripción detallada próximamente).",
    sqzmom_adx:
      "Estrategia SQZMOM+ADX: Combina el indicador Squeeze Momentum (SQZMOM) con el Average Directional Index (ADX) para identificar tendencias fuertes y momentos de compra/venta. Requiere confirmación de ambos indicadores. TP1=ATR×2.0, TP2=ATR×3.5, SL=ATR×1.2",
  };

  const load = useMemo(() => async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        throw new Error("Error al inicializar cliente de Supabase");
      }

      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesión inválida");

      const res = await fetch('/api/strategies', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      // Handle new API format (object with strategy keys)
      let strategies: Strategy[] = [];
      if (json?.strategies && typeof json.strategies === 'object') {
        strategies = Object.entries(json.strategies).map(([key, strategy]: [string, any]) => ({
          id: key,
          name: strategy.name
        }));
      } else if (Array.isArray(json?.strategies)) {
        strategies = json.strategies;
      }

      const currentId: string = typeof json?.current_strategy === 'string' ? json.current_strategy : '';
      setOptions(strategies);
      setCurrent(currentId);
      // cargar estrategias activas desde metadatos de usuario
      const userActive: string[] = (data.session?.user?.user_metadata as any)?.active_strategies || [];
      setActive(Array.isArray(userActive) ? userActive : []);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar estrategias');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = (id: string) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const save = async () => {
    try {
      setSaving(true);

      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        throw new Error("Error al inicializar cliente de Supabase");
      }

      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesión inválida");

      // 1) Guardar estrategias activas en metadatos del usuario (sin admin)
      const { error: updErr } = await supabaseClient.auth.updateUser({ data: { active_strategies: active } });
      if (updErr) throw updErr;

      // 2) Establecer estrategia actual (si hay alguna elegida)
      const toSet = active[0] || current; // fallback al current si no hay activo
      if (toSet) {
        const res = await fetch('/api/strategies/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ strategy_name: toSet })
        });
        if (!res.ok) throw new Error(await res.text());
        setCurrent(toSet);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar estrategias');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Administre su estrategia activa. La estrategia activa se utilizará para generar y filtrar señales.</p>

      {loading && <div className="text-gray-500">Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Estrategias</h3>
            <button onClick={save} disabled={saving}
              className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <StrategyList
            options={options}
            selected={active}
            onToggle={toggle}
            current={current}
            descriptions={descriptions}
          />
        </div>
      )}
    </div>
  );
}

// Lista de estrategias con tarjetas y switch on/off
function StrategyList({
  options,
  selected,
  onToggle,
  current,
  descriptions,
}: {
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  current?: string;
  descriptions: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Active o desactive las estrategias que desee usar. Puede guardar los cambios con el botón superior.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((s) => {
          const isSelected = selected.includes(s.id);
          const desc = descriptions[s.id] || "Estrategia disponible.";
          return (
            <div key={s.id} className={`rounded-lg border ${isSelected ? 'border-indigo-300' : 'border-gray-200'} bg-white p-4 shadow-sm`}> 
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium capitalize">{s.name || s.id}</h4>
                    {current === s.id && (
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Actual</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
                <Switch checked={isSelected} onChange={() => onToggle(s.id)} />
              </div>
            </div>
          );
        })}
        {options.length === 0 && (
          <div className="text-gray-500">No hay estrategias disponibles</div>
        )}
      </div>
    </div>
  );
}

// Toggle accesible con estilo tipo switch
function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
}