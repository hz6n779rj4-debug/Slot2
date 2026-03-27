import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getServiceSupabaseClient } from '@/lib/supabase';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const action = String(body.action || '');
    const supabase = getServiceSupabaseClient();

    const updates: Record<string, unknown> = {};
    if (action === 'approve') updates.status = 'approved';
    if (action === 'promote') {
      updates.status = 'promoted';
      updates.is_promoted = true;
    }
    if (action === 'reject') {
      updates.status = 'rejected';
      updates.is_promoted = false;
      updates.is_trending = false;
    }
    if (action === 'feature') updates.is_trending = true;

    const { data, error } = await supabase.from('tokens').update(updates).eq('id', id).select('*').single();
    if (error) throw error;

    return NextResponse.json({ success: true, token: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update token.' },
      { status: 500 }
    );
  }
}
