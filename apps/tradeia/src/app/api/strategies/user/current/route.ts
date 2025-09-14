import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

  console.log('[STRATEGIES USER CURRENT API] ===== GETTING CURRENT USER STRATEGY =====');
  console.log('[STRATEGIES USER CURRENT API] User authenticated:', session.user?.email);

  // Mock current strategy - in a real app this would come from user preferences/database
  const currentStrategy = 'moderate';

  // Mock strategy info based on the API documentation
  const strategyInfo: Record<string, any> = {
    conservative: {
      name: 'Conservative Strategy',
      description: 'Low-risk strategy with strict entry conditions',
      risk_level: 'conservative',
      criteria: 'RSI < 30, ADX > 25, SQZMOM > 1780, strict trend confirmation'
    },
    moderate: {
      name: 'Moderate Strategy',
      description: 'Balanced risk-reward strategy',
      risk_level: 'moderate',
      criteria: 'RSI < 35, ADX > 22, SQZMOM > 1750, moderate trend confirmation'
    },
    aggressive: {
      name: 'Aggressive Strategy',
      description: 'High-risk strategy for maximum returns',
      risk_level: 'aggressive',
      criteria: 'RSI < 40, ADX > 20, SQZMOM > 1700, flexible trend confirmation'
    }
  };

  const strategy = strategyInfo[currentStrategy];

  return NextResponse.json({
    current_strategy: currentStrategy,
    strategy_info: strategy
  }, {
    headers: {
      'Cache-Control': 'private, max-age=300',
      'Accept-Encoding': 'identity' // Disable gzip compression
    }
  });
}