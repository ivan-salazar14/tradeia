import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
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

    // Obtener la estrategia actual del usuario
    const { data: userStrategy, error: userStrategyError } = await supabase
      .from('user_strategies')
      .select(`
        *,
        strategies (*)
      `)
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (userStrategyError) {
      if (userStrategyError.code === 'PGRST116') {
        return NextResponse.json({ 
          message: 'No hay estrategia activa',
          current_strategy: null 
        });
      }
      console.error('Error fetching user strategy:', userStrategyError);
      return NextResponse.json({ error: 'Error al obtener estrategia del usuario' }, { status: 500 });
    }

    return NextResponse.json({
      current_strategy: {
        ...userStrategy,
        strategy: {
          ...userStrategy.strategies,
          indicators: typeof userStrategy.strategies.indicators === 'string' 
            ? JSON.parse(userStrategy.strategies.indicators) 
            : userStrategy.strategies.indicators
        }
      }
    });

  } catch (error) {
    console.error('Error in current strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}