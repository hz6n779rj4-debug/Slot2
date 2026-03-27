import { NextResponse } from 'next/server';
import { getServiceSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ['name', 'ticker', 'contract_address', 'description'];

    for (const key of required) {
      if (!String(body[key] || '').trim()) {
        return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
      }
    }

    const supabase = getServiceSupabaseClient();
    const payload = {
      name: String(body.name).trim(),
      ticker: String(body.ticker).trim().toUpperCase(),
      contract_address: String(body.contract_address).trim(),
      description: String(body.description).trim(),
      telegram_url: String(body.telegram_url || '').trim() || null,
      x_url: String(body.x_url || '').trim() || null,
      website_url: String(body.website_url || '').trim() || null,
      image_url: String(body.image_url || '').trim() || null,
      status: 'pending',
      is_promoted: false,
      is_trending: false
    };

    const { error } = await supabase.from('tokens').insert(payload);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to submit token.' },
      { status: 500 }
    );
  }
}
