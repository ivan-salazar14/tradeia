"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Strategy = { id: string; name: string };

export default function BotsPage() {
  const [options, setOptions] = useState<Strategy[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [active, setActive] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useMemo(() => async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await supabase!.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesión inválida");
      const res = await fetch('/api/strategies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const strategies: Strategy[] = Array.isArray(json?.strategies) ? json.strategies : [];
      const currentId: string = typeof json?.current === 'string' ? json.current : '';
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
      const { data } = await supabase!.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sesión inválida");
      // 1) Guardar estrategias activas en metadatos del usuario (sin admin)
      const { error: updErr } = await supabase!.auth.updateUser({ data: { active_strategies: active } });
      if (updErr) throw updErr;
      // 2) Establecer estrategia actual (si hay alguna elegida)
      const toSet = active[0] || current; // fallback al current si no hay activo
      if (toSet) {
        const res = await fetch('/api/strategies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map((s) => (
              <label key={s.id} className="flex items-center gap-3 p-3 border rounded-md">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={active.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                <span className="capitalize">{s.name || s.id}</span>
                {current === s.id && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Actual</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}