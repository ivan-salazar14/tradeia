import { NextRequest, NextResponse } from 'next/server';
import { queueManager, JobType, JobPriority } from '@/lib/jobs/background-jobs';
import { Logger } from '@/lib/utils/error-handler';

// Initialize background jobs system
import '@/lib/jobs/background-jobs';
import { initializeBackgroundJobs } from '@/lib/jobs/background-jobs';

// Initialize on module load
initializeBackgroundJobs();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        return await getQueueStatus();

      case 'enqueue':
        return await enqueueTestJob(searchParams);

      case 'stats':
        return await getDetailedStats();

      default:
        return NextResponse.json({
          error: 'Invalid action',
          available_actions: ['status', 'enqueue', 'stats']
        }, { status: 400 });
    }
  } catch (error) {
    Logger.error('Queue test error:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function getQueueStatus() {
  const allStats = await queueManager.getAllStats();

  return NextResponse.json({
    status: 'success',
    message: 'Queue system is operational',
    queues: allStats,
    system_info: {
      queue_type: process.env.REDIS_URL ? 'Redis' : 'In-memory',
      initialized: true,
      timestamp: new Date().toISOString()
    }
  });
}

async function enqueueTestJob(searchParams: URLSearchParams) {
  const jobType = searchParams.get('type') as JobType;
  const priority = parseInt(searchParams.get('priority') || '1') as JobPriority;
  const count = parseInt(searchParams.get('count') || '1');

  if (!jobType || !Object.values(JobType).includes(jobType)) {
    return NextResponse.json({
      error: 'Invalid job type',
      available_types: Object.values(JobType)
    }, { status: 400 });
  }

  const jobIds: string[] = [];

  for (let i = 0; i < count; i++) {
    let payload: any = {};

    // Create appropriate payload based on job type
    switch (jobType) {
      case JobType.PROCESS_SIGNALS:
        payload = {
          signals: [
            {
              id: `test-signal-${i + 1}`,
              symbol: 'BTC/USDT',
              timeframe: '4h',
              direction: 'BUY',
              entry: 50000 + Math.random() * 1000,
              tp1: 51000 + Math.random() * 1000,
              stopLoss: 49000 + Math.random() * 1000
            }
          ],
          userId: `test-user-${i + 1}`,
          strategyIds: ['moderate']
        };
        break;

      case JobType.CLEANUP_OLD_DATA:
        payload = {
          olderThanDays: 30,
          dataTypes: ['signals', 'cache']
        };
        break;

      case JobType.UPDATE_USER_STATS:
        payload = {
          userId: `test-user-${i + 1}`
        };
        break;

      case JobType.BACKTEST_STRATEGY:
        payload = {
          strategyId: 'moderate',
          symbol: 'BTC/USDT',
          userId: `test-user-${i + 1}`
        };
        break;
    }

    const jobId = await queueManager.enqueue(
      getQueueNameForJobType(jobType),
      jobType,
      payload,
      {
        priority,
        correlationId: `test-${Date.now()}-${i}`
      }
    );

    jobIds.push(jobId);
    Logger.info(`Enqueued test job: ${jobId} (${jobType})`);
  }

  return NextResponse.json({
    status: 'success',
    message: `Enqueued ${count} ${jobType} job(s)`,
    jobIds,
    jobType,
    priority,
    queue: getQueueNameForJobType(jobType)
  });
}

async function getDetailedStats() {
  const allStats = await queueManager.getAllStats();
  const eventStats = {
    messagesEnqueued: 0,
    messagesProcessing: 0,
    messagesCompleted: 0,
    messagesFailed: 0
  };

  // Set up event listeners for real-time stats
  const eventHandler = (event: string, data: any) => {
    switch (event) {
      case 'messageEnqueued':
        eventStats.messagesEnqueued++;
        break;
      case 'messageProcessing':
        eventStats.messagesProcessing++;
        break;
      case 'messageCompleted':
        eventStats.messagesCompleted++;
        break;
      case 'messageFailed':
        eventStats.messagesFailed++;
        break;
    }
  };

  // Listen for events for a short time to collect stats
  queueManager.on('messageEnqueued', (data: any) => eventHandler('messageEnqueued', data));
  queueManager.on('messageProcessing', (data: any) => eventHandler('messageProcessing', data));
  queueManager.on('messageCompleted', (data: any) => eventHandler('messageCompleted', data));
  queueManager.on('messageFailed', (data: any) => eventHandler('messageFailed', data));

  // Wait a bit to collect some events
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    queue_system: {
      type: process.env.REDIS_URL ? 'Redis' : 'In-memory',
      redis_url: process.env.REDIS_URL ? '[CONFIGURED]' : null
    },
    queue_stats: allStats,
    recent_events: eventStats,
    system_health: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  });
}

function getQueueNameForJobType(jobType: JobType): string {
  switch (jobType) {
    case JobType.PROCESS_SIGNALS:
      return 'signals';
    case JobType.CLEANUP_OLD_DATA:
      return 'maintenance';
    case JobType.UPDATE_USER_STATS:
      return 'user_stats';
    case JobType.BACKTEST_STRATEGY:
      return 'backtest';
    default:
      return 'default';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'enqueue', jobs = [] } = body;

    if (action !== 'enqueue') {
      return NextResponse.json({
        error: 'POST only supports enqueue action'
      }, { status: 400 });
    }

    const results = [];

    for (const job of jobs) {
      const { type, payload, priority = 1, delay } = job;

      if (!Object.values(JobType).includes(type)) {
        results.push({
          error: `Invalid job type: ${type}`,
          job
        });
        continue;
      }

      try {
        const jobId = await queueManager.enqueue(
          getQueueNameForJobType(type),
          type,
          payload,
          {
            priority,
            delay,
            correlationId: `bulk-${Date.now()}`
          }
        );

        results.push({
          success: true,
          jobId,
          type,
          queue: getQueueNameForJobType(type)
        });

        Logger.info(`Bulk enqueued job: ${jobId} (${type})`);
      } catch (error) {
        results.push({
          error: error instanceof Error ? error.message : String(error),
          job
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      message: `Processed ${jobs.length} jobs`,
      results,
      summary: {
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => r.error).length
      }
    });

  } catch (error) {
    Logger.error('Bulk queue test error:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}