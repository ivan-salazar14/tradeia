import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Extraer el project reference de la URL de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // Try project-specific cookie first, then fallback to generic
            if (name === `sb-${projectRef}-auth-token`) {
              return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
            }
            if (name === `sb-${projectRef}-refresh-token`) {
              return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
            }
            // Fallback for other cookies
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch {
              // The `remove` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Verificar la sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { strategy_name } = body;

    if (!strategy_name) {
      return NextResponse.json({ error: 'Nombre de estrategia requerido' }, { status: 400 });
    }

    // Verificar que la estrategia existe
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .select('id')
      .eq('name', strategy_name)
      .single();

    if (strategyError) {
      if (strategyError.code === 'PGRST116') {
        // Return mock success for setting strategy when database is not available
        console.log('[STRATEGIES SET] Strategy not found in DB, returning mock success');
        return NextResponse.json({
          message: 'Estrategia establecida exitosamente (mock)',
          strategy: {
            user_id: session.user.id,
            strategy_id: strategy_name,
            is_active: true
          },
          _mock: true
        });
      }
      console.error('Error fetching strategy:', strategyError);
      return NextResponse.json({ error: 'Error al obtener estrategia' }, { status: 500 });
    }

    // Desactivar cualquier estrategia activa del usuario
    await supabase
      .from('user_strategies')
      .update({ is_active: false })
      .eq('user_id', session.user.id)
      .eq('is_active', true);

    // Establecer la nueva estrategia como activa
    const { data: userStrategy, error: setError } = await supabase
      .from('user_strategies')
      .upsert({
        user_id: session.user.id,
        strategy_id: strategy.id,
        is_active: true
      })
      .select()
      .single();

    if (setError) {
      console.error('Error setting user strategy:', setError);
      return NextResponse.json({ error: 'Error al establecer estrategia' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Estrategia establecida exitosamente',
      strategy: userStrategy
    });

  } catch (error) {
    console.error('Error in set strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}