import { NextRequest } from 'next/server';
import { SignalsService } from '@/lib/services/SignalsService';


export async function GET(request: NextRequest) {
  return SignalsService.getSignals(request);
}

// POST requests are handled by the /api/signals/generate route
