import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/services/NotificationService';

export async function GET(request: NextRequest) {
  console.log('[NotificationTest] Testing NotificationAPI integration...');

  try {
    const result = await notificationService.testNotificationAPI();

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });

  } catch (error) {
    console.error('[NotificationTest] Error testing NotificationAPI:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error during NotificationAPI test',
      details: error instanceof Error ? error.message : String(error)
    }, {
      status: 500
    });
  }
}

export async function POST(request: NextRequest) {
  console.log('[NotificationTest] Manual notification test...');

  try {
    const body = await request.json();
    const { userId, testType = 'email' } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'userId is required'
      }, {
        status: 400
      });
    }

    // Create a test signal notification
    const testSignalData = {
      signal_id: 'test-signal-' + Date.now(),
      symbol: 'BTC/USDT',
      signal_direction: 'BUY',
      strategy_id: 'moderate',
      timestamp: new Date().toISOString()
    };

    // Get user preferences (accessing private method via type assertion)
    const usersToNotify = await (notificationService as any).getUsersForSignal(testSignalData);
    const userPrefs = usersToNotify.find((u: any) => u.userId === userId);

    if (!userPrefs) {
      return NextResponse.json({
        success: false,
        message: 'User not found or has no notification preferences'
      }, {
        status: 404
      });
    }

    // Send test notification (accessing private method via type assertion)
    await (notificationService as any).sendNotificationToUser(userId, userPrefs.preferences, testSignalData);

    return NextResponse.json({
      success: true,
      message: `Test ${testType} notification sent to user ${userId}`,
      details: {
        userId,
        testType,
        signalData: testSignalData
      }
    });

  } catch (error) {
    console.error('[NotificationTest] Error sending manual test notification:', error);
    return NextResponse.json({
      success: false,
      message: 'Error sending test notification',
      details: error instanceof Error ? error.message : String(error)
    }, {
      status: 500
    });
  }
}