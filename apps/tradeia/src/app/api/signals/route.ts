import { NextRequest } from 'next/server';
import { SignalsService } from '@/lib/services/SignalsService';

/**
 * @swagger
 * /api/signals:
 *   get:
 *     summary: Get trading signals
 *     description: Retrieve trading signals with optional filtering by strategy, symbol, timeframe, and date range
 *     tags:
 *       - Signals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SymbolParam'
 *       - $ref: '#/components/parameters/TimeframeParam'
 *       - $ref: '#/components/parameters/StrategyIdParam'
 *       - $ref: '#/components/parameters/StrategyIdsParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/OffsetParam'
 *       - $ref: '#/components/parameters/InitialBalanceParam'
 *       - $ref: '#/components/parameters/RiskPerTradeParam'
 *       - $ref: '#/components/parameters/IncludeLiveSignalsParam'
 *       - $ref: '#/components/parameters/ForceFreshParam'
 *       - $ref: '#/components/parameters/FieldsParam'
 *       - $ref: '#/components/parameters/ApiVersionHeader'
 *     responses:
 *       200:
 *         description: Successful response with trading signals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Signal'
 *                 strategies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Strategy'
 *                 portfolio_metrics:
 *                   $ref: '#/components/schemas/PortfolioMetrics'
 *                 risk_parameters:
 *                   $ref: '#/components/schemas/RiskParameters'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */


export async function GET(request: NextRequest) {
  return SignalsService.getSignals(request);
}

// POST requests are handled by the /api/signals/generate route
