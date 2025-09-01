import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.SIGNALS_API_BASE;

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: NextRequest) {
  if (!API_BASE) return bad(500, 'SIGNALS_API_BASE is not configured');
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return bad(401, 'Missing Authorization');
  try {
    const res = await fetch(`${API_BASE}/strategies/`, {
      headers: { Authorization: auth },
      cache: 'no-store',
    });
    if (!res.ok) return bad(res.status, await res.text());
    const json = await res.json();
    // Normalize to identifiers and display names
    // Return shape: { strategies: Array<{ id: string, name: string }>, current: string | null }
    let strategies: Array<{ id: string, name: string }> = [];
    let current: string | null = null;

    const rawStrategies = json?.available_strategies ?? json?.strategies ?? null;
    if (Array.isArray(rawStrategies)) {
      strategies = rawStrategies
        .filter((s: any) => typeof s === 'string')
        .map((s: string) => ({ id: s, name: s }));
    } else if (rawStrategies && typeof rawStrategies === 'object') {
      // object map -> id is key, name from value.name or key
      const entries = Object.entries(rawStrategies as Record<string, any>);
      strategies = entries.map(([key, val]) => ({ id: key, name: typeof val?.name === 'string' ? val.name : key }));
    }

    const rawCurrent = json?.current_strategy ?? json?.current ?? json?.strategy_name ?? null;
    if (typeof rawCurrent === 'string') {
      // If upstream returns a name instead of id, try to resolve to id
      const byId = strategies.find((s) => s.id === rawCurrent);
      const byName = strategies.find((s) => s.name === rawCurrent);
      current = byId?.id ?? byName?.id ?? rawCurrent;
    } else if (rawCurrent && typeof rawCurrent === 'object' && typeof rawCurrent.name === 'string') {
      const byName = strategies.find((s) => s.name === rawCurrent.name);
      current = byName?.id ?? null;
    }

    return NextResponse.json({ strategies, current });
  } catch (e: any) {
    return bad(502, e?.message ?? 'Upstream error');
  }
}

export async function POST(req: NextRequest) {
  if (!API_BASE) return bad(500, 'SIGNALS_API_BASE is not configured');
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return bad(401, 'Missing Authorization');
  const body = await req.json().catch(() => null);
  if (!body || typeof body.strategy_name !== 'string' || !body.strategy_name.trim()) {
    return bad(400, 'Body must be { strategy_name: string }');
  }
  try {
    const res = await fetch(`${API_BASE}/strategies/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify({ strategy_name: body.strategy_name.trim() }),
    });
    if (!res.ok) return bad(res.status, await res.text());
    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    return bad(502, e?.message ?? 'Upstream error');
  }
}
