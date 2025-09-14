import { NextRequest, NextResponse } from 'next/server';

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

  console.log('[STRATEGIES SET API] ===== SETTING USER STRATEGY =====');
  console.log('[STRATEGIES SET API] Token received and validated');

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
    const validStrategies = ['conservative', 'moderate', 'aggressive'];
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
      }
    };

    const strategy = strategyInfo[strategy_name];

    return NextResponse.json({
      success: true,
      message: `Strategy '${strategy_name}' activated successfully`,
      strategy_info: strategy
    }, {
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });

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