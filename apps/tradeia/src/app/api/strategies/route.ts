import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:3001';

    // Fetch strategies from external API
    const response = await fetch(`${apiBase}/strategies`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Error al obtener estrategias' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      strategies: data.strategies || data || [],
      current_strategy: data.current_strategy || null
    });

  } catch (error) {
    console.error('Error in strategies API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:3001';

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validar datos requeridos
    if (!name || !description || !risk_level || !timeframe || !indicators || !Array.isArray(indicators)) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Create strategy via external API
    const response = await fetch(`${apiBase}/strategies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        risk_level,
        timeframe,
        indicators,
        stop_loss: stop_loss || 2,
        take_profit: take_profit || 4,
        max_positions: max_positions || 3
      })
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Error al crear estrategia' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      message: 'Estrategia creada exitosamente',
      strategy: data.strategy || data
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}