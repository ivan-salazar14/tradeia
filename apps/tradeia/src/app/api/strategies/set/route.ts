import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // Check for Bearer token authentication
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header. Use Bearer token.' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Extract token from Bearer header
  const token = auth.substring(7); // Remove 'Bearer ' prefix
  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Invalid Bearer token' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Setup Supabase client for session validation
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (name === `sb-${projectRef}-auth-token`) {
            return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
          }
          if (name === `sb-${projectRef}-refresh-token`) {
            return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore in server context
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
            // Ignore in server context
          }
        },
      },
    }
  );

  // Validate user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Usuario no autenticado' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  console.log('[STRATEGIES SET API] ===== SETTING USER STRATEGY =====');
  console.log('[STRATEGIES SET API] User authenticated:', session.user?.email);

  try {
    const body = await request.json();
    const { strategy_name } = body;

    if (!strategy_name) {
      return NextResponse.json({
        error: 'strategy_name is required'
      }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    // Validate strategy exists
    const validStrategies = ['conservative', 'moderate', 'aggressive', 'sqzmom_adx', 'scenario_based', 'onda_3_5_alcista', 'onda_c_bajista', 'ruptura_rango', 'reversion_patron', 'gestion_riesgo', 'advanced_ta'];
    if (!validStrategies.includes(strategy_name)) {
      return NextResponse.json({
        error: `Invalid strategy name. Must be one of: ${validStrategies.join(', ')}`
      }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    // Define basic strategies that don't require database permissions
    const basicStrategies = ['conservative', 'moderate', 'aggressive','sqzmom_adx', 'advanced_ta'];
    const isBasicStrategy = basicStrategies.includes(strategy_name);

    // Mock strategy info based on the API documentation
    const strategyInfo: Record<string, any> = {
      conservative: {
        name: 'Conservative Strategy',
        description: 'Low-risk strategy with strict entry conditions',
        risk_level: 'conservative'
      },
      moderate: {
        name: 'Moderate Strategy',
        description: 'Balanced risk-reward strategy',
        risk_level: 'moderate'
      },
      aggressive: {
        name: 'Aggressive Strategy',
        description: 'High-risk strategy for maximum returns',
        risk_level: 'aggressive'
      },
      sqzmom_adx: {
        name: 'Squeeze Momentum ADX',
        description: 'Advanced strategy using squeeze momentum and ADX indicators',
        risk_level: 'moderate'
      },
      scenario_based: {
        name: 'Scenario Based Strategy',
        description: 'Dynamic strategy that adapts to market conditions',
        risk_level: 'moderate'
      },
      onda_3_5_alcista: {
        name: 'Onda 3/5 Alcista',
        description: 'Detecta oportunidades de compra en tendencias alcistas fuertes',
        risk_level: 'moderate'
      },
      onda_c_bajista: {
        name: 'Onda C Bajista',
        description: 'Detecta oportunidades de venta en tendencias bajistas fuertes',
        risk_level: 'moderate'
      },
      ruptura_rango: {
        name: 'Ruptura de Rango',
        description: 'Detecta rupturas de consolidación con momentum confirmado',
        risk_level: 'moderate'
      },
      reversion_patron: {
        name: 'Reversión por Patrón',
        description: 'Detecta patrones de reversión con confirmación técnica',
        risk_level: 'moderate'
      },
      gestion_riesgo: {
        name: 'Gestión de Riesgo',
        description: 'Gestión avanzada de riesgo con trailing stops dinámicos',
        risk_level: 'conservative'
      },
      advanced_ta: {
        name: 'Advanced Technical Analysis',
        description: 'Advanced technical analysis strategy with multiple indicators',
        risk_level: 'high'
      }
    };

    const strategy = strategyInfo[strategy_name];

    if (isBasicStrategy) {
      // Basic strategies are always available, no database operation needed
      return NextResponse.json({
        success: true,
        message: `Basic strategy '${strategy_name}' is always available`,
        strategy_info: strategy
      }, {
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    } else {
      // Premium strategies require database permission assignment
      try {
        // Get the strategy UUID from the strategies table
        const { data: strategyRecord, error: strategyLookupError } = await supabase
          .from('strategies')
          .select('id')
          .eq('name', strategy_name)
          .single();

        if (strategyLookupError || !strategyRecord) {
          return NextResponse.json({
            error: `Strategy '${strategy_name}' not found in database`
          }, {
            status: 404,
            headers: {
              'Accept-Encoding': 'identity' // Disable gzip compression
            }
          });
        }

        // Insert or update user strategy permission
        const { error: upsertError } = await supabase
          .from('user_strategies')
          .upsert({
            user_id: session.user.id,
            strategy_id: strategyRecord.id,
            is_active: true
          }, {
            onConflict: 'user_id,strategy_id'
          });

        if (upsertError) {
          console.error('[STRATEGIES SET API] Database error:', upsertError);
          return NextResponse.json({
            error: 'Failed to assign strategy permission'
          }, {
            status: 500,
            headers: {
              'Accept-Encoding': 'identity' // Disable gzip compression
            }
          });
        }

        return NextResponse.json({
          success: true,
          message: `Premium strategy '${strategy_name}' activated successfully`,
          strategy_info: strategy
        }, {
          headers: {
            'Accept-Encoding': 'identity' // Disable gzip compression
          }
        });

      } catch (dbError) {
        console.error('[STRATEGIES SET API] Unexpected error:', dbError);
        return NextResponse.json({
          error: 'Internal server error'
        }, {
          status: 500,
          headers: {
            'Accept-Encoding': 'identity' // Disable gzip compression
          }
        });
      }
    }

  } catch (error) {
    console.error('[STRATEGIES SET API] Error:', error);
    return NextResponse.json({
      error: 'Invalid JSON in request body'
    }, {
      status: 400,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }
}