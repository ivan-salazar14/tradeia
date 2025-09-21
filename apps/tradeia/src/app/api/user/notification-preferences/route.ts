import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  console.log('[NotificationPreferences] Getting user preferences...');

  try {
    // Setup Supabase client
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

    // Get authenticated user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user preferences
    const { data: preferences, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[NotificationPreferences] Error fetching preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }

    // If no preferences exist, return defaults
    const defaultPreferences = {
      email_notifications: true,
      push_notifications: true,
      strategies: ['moderate', 'conservative'],
      symbols: ['BTC/USDT', 'ETH/USDT'],
      timeframes: ['1H', '4H', '1D']
    };

    return NextResponse.json({
      preferences: preferences || defaultPreferences,
      has_custom_preferences: !!preferences
    });

  } catch (error) {
    console.error('[NotificationPreferences] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[NotificationPreferences] Updating user preferences...');

  try {
    const body = await request.json();
    const {
      email_notifications,
      push_notifications,
      strategies,
      symbols,
      timeframes
    } = body;

    // Setup Supabase client
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

    // Get authenticated user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate input
    if (typeof email_notifications !== 'boolean' && email_notifications !== undefined) {
      return NextResponse.json(
        { error: 'email_notifications must be a boolean' },
        { status: 400 }
      );
    }

    if (typeof push_notifications !== 'boolean' && push_notifications !== undefined) {
      return NextResponse.json(
        { error: 'push_notifications must be a boolean' },
        { status: 400 }
      );
    }

    if (strategies !== undefined && !Array.isArray(strategies)) {
      return NextResponse.json(
        { error: 'strategies must be an array' },
        { status: 400 }
      );
    }

    if (symbols !== undefined && !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'symbols must be an array' },
        { status: 400 }
      );
    }

    if (timeframes !== undefined && !Array.isArray(timeframes)) {
      return NextResponse.json(
        { error: 'timeframes must be an array' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (email_notifications !== undefined) updateData.email_notifications = email_notifications;
    if (push_notifications !== undefined) updateData.push_notifications = push_notifications;
    if (strategies !== undefined) updateData.strategies = strategies;
    if (symbols !== undefined) updateData.symbols = symbols;
    if (timeframes !== undefined) updateData.timeframes = timeframes;

    // Upsert preferences (insert or update)
    const { data: preferences, error } = await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: session.user.id,
        ...updateData
      })
      .select()
      .single();

    if (error) {
      console.error('[NotificationPreferences] Error updating preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    console.log('[NotificationPreferences] Preferences updated for user:', session.user.id);

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('[NotificationPreferences] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}