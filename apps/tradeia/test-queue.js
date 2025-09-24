#!/usr/bin/env node

// Simple test script for the queue system
// Run with: node test-queue.js

const { queueManager, JobType, JobPriority, initializeBackgroundJobs } = require('./dist/lib/jobs/background-jobs.js');

async function testQueueSystem() {
  console.log('🚀 Testing Message Queue System...\n');

  try {
    // Initialize the background job system
    console.log('📋 Initializing background jobs...');
    initializeBackgroundJobs();

    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 1: Check queue status
    console.log('📊 Test 1: Getting queue status...');
    const allStats = await queueManager.getAllStats();
    console.log('Queue stats:', JSON.stringify(allStats, null, 2));

    // Test 2: Enqueue some jobs
    console.log('\n📝 Test 2: Enqueueing test jobs...');

    const jobIds = [];

    // Enqueue signal processing jobs
    for (let i = 1; i <= 3; i++) {
      const jobId = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [{
          id: `test-signal-${i}`,
          symbol: 'BTC/USDT',
          timeframe: '4h',
          direction: 'BUY',
          entry: 50000 + Math.random() * 1000,
          tp1: 51000 + Math.random() * 1000,
          stopLoss: 49000 + Math.random() * 1000
        }],
        userId: `test-user-${i}`,
        strategyIds: ['moderate']
      }, {
        priority: JobPriority.HIGH,
        correlationId: `test-${i}`
      });

      jobIds.push(jobId);
      console.log(`✅ Enqueued signal processing job: ${jobId}`);
    }

    // Enqueue notification jobs
    for (let i = 1; i <= 2; i++) {
      const jobId = await queueManager.enqueue('notifications', 'custom_notification', {
        userId: `test-user-${i}`,
        type: 'info',
        title: `Test Notification ${i}`,
        message: `This is test notification number ${i}`
      }, {
        priority: JobPriority.NORMAL
      });

      jobIds.push(jobId);
      console.log(`✅ Enqueued notification job: ${jobId}`);
    }

    // Enqueue cleanup job
    const cleanupJobId = await queueManager.enqueue('maintenance', JobType.CLEANUP_OLD_DATA, {
      olderThanDays: 30,
      dataTypes: ['signals', 'cache']
    }, {
      priority: JobPriority.LOW
    });

    jobIds.push(cleanupJobId);
    console.log(`✅ Enqueued cleanup job: ${cleanupJobId}`);

    console.log(`\n📋 Total jobs enqueued: ${jobIds.length}`);

    // Test 3: Monitor processing
    console.log('\n⏳ Test 3: Monitoring job processing...');

    let checkCount = 0;
    const maxChecks = 10;

    const monitorInterval = setInterval(async () => {
      checkCount++;

      try {
        const currentStats = await queueManager.getAllStats();
        console.log(`\n🔍 Check ${checkCount}/${maxChecks} - Queue Status:`);

        Object.entries(currentStats).forEach(([queueName, stats]) => {
          console.log(`  ${queueName}: ${stats.pending} pending, ${stats.processing} processing, ${stats.completed} completed, ${stats.failed} failed`);
        });

        // Check if all jobs are processed
        const totalPending = Object.values(currentStats).reduce((sum, stats) => sum + stats.pending + stats.processing, 0);

        if (totalPending === 0 || checkCount >= maxChecks) {
          clearInterval(monitorInterval);

          console.log('\n🎉 Test completed!');
          console.log('Final queue statistics:');
          console.log(JSON.stringify(currentStats, null, 2));

          // Graceful shutdown
          console.log('\n🛑 Shutting down...');
          process.exit(0);
        }

      } catch (error) {
        console.error('Error checking queue status:', error.message);
      }
    }, 2000); // Check every 2 seconds

    // Safety timeout
    setTimeout(() => {
      clearInterval(monitorInterval);
      console.log('\n⏰ Test timeout reached');
      process.exit(0);
    }, 30000); // 30 second timeout

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run the test
testQueueSystem().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});