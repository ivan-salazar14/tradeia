import { NextRequest, NextResponse } from 'next/server';

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

  console.log('[STRATEGIES USER CURRENT API] ===== GETTING CURRENT USER STRATEGY =====');
  console.log('[STRATEGIES USER CURRENT API] Token received and validated');

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