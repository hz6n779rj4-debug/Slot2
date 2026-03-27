import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getServiceSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabaseClient();
    const payload = {
      title: String(body.title || '').trim(),
      image_url: String(body.image_url || '').trim(),
      link_url: String(body.link_url || '').trim(),
      starts_at: String(body.starts_at || '').trim() || null,
      ends_at: String(body.ends_at || '').trim() || null,
      is_active: Boolean(body.is_active)
    };

    const { data, error } = await supabase.from('banners').insert(payload).select('*').single();
    if (error) throw error;
    return NextResponse.json({ success: true, banner: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create banner.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabaseClient();
    const { data, error } = await supabase
      .from('banners')
      .update({ is_active: Boolean(body.is_active) })
      .eq('id', String(body.id))
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, banner: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update banner.' },
      { status: 500 }
    );
  }
}
