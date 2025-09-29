import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  console.log('[NotificationsHistory] Getting user notification history...');

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
    const status = searchParams.get('status'); // 'sent', 'failed', 'pending'
    const type = searchParams.get('type'); // 'email', 'push'

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

    // Get authenticated user (secure method)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build query
    let query = supabase
      .from('notifications_history')
      .select(`
        id,
        signal_id,
        notification_type,
        status,
        sent_at,
        created_at,
        signals (
          symbol,
          strategy_id,
          entry,
          tp1,
          stop_loss
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('notification_type', type);
    }

    let notifications, error, count;

    try {
      const result = await query;
      notifications = result.data;
      error = result.error;
      count = result.count;
    } catch (queryError) {
      console.error('[NotificationsHistory] Query execution failed:', queryError);
      return NextResponse.json(
        { error: 'Database query failed', details: queryError instanceof Error ? queryError.message : 'Unknown query error' },
        { status: 500 }
      );
    }

    if (error) {
      console.error('[NotificationsHistory] Supabase error:', error);
      // If it's a permissions or table not found error, return empty results
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.log('[NotificationsHistory] Table or permissions issue, returning empty results');
        return NextResponse.json({
          notifications: [],
          pagination: {
            total: 0,
            limit,
            offset,
            current_page: 1,
            total_pages: 0,
            has_next: false,
            has_prev: false
          }
        });
      }
      return NextResponse.json(
        { error: 'Failed to fetch notification history', details: error.message },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let totalCount = 0;
    try {
      const { count } = await supabase
        .from('notifications_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      totalCount = count || 0;
    } catch (countError) {
      console.warn('[NotificationsHistory] Failed to get total count, using 0:', countError);
      totalCount = 0;
    }

    // Calculate pagination info
    const totalPages = Math.ceil((totalCount || 0) / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < (totalCount || 0);
    const hasPrevPage = offset > 0;

    return NextResponse.json({
      notifications: notifications || [],
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        current_page: currentPage,
        total_pages: totalPages,
        has_next: hasNextPage,
        has_prev: hasPrevPage
      }
    });

  } catch (error) {
    console.error('[NotificationsHistory] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}