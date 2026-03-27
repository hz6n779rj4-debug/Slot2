import { NextResponse } from 'next/server';
import { getServiceSupabaseClient } from '@/lib/supabase';

function isMissingColumnError(message: string, column: string) {
  const text = message.toLowerCase();
  return text.includes(`column`) && text.includes(column.toLowerCase()) && text.includes('does not exist');
}

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
    const common = {
      name: String(body.name).trim(),
      contract_address: String(body.contract_address).trim(),
      description: String(body.description).trim(),
      website_url: String(body.website_url || '').trim() || null,
      status: 'pending',
      is_promoted: false,
      is_trending: false,
      chain: 'ton'
    };

    const primaryPayload = {
      ...common,
      ticker: String(body.ticker).trim().toUpperCase(),
      telegram_url: String(body.telegram_url || '').trim() || null,
      x_url: String(body.x_url || '').trim() || null,
      image_url: String(body.image_url || '').trim() || null
    };

    let { error } = await supabase.from('tokens').insert(primaryPayload);

    if (error) {
      const message = error.message || '';
      const needsLegacyRetry = [
        isMissingColumnError(message, 'ticker'),
        isMissingColumnError(message, 'x_url'),
        isMissingColumnError(message, 'image_url')
      ].some(Boolean);

      if (needsLegacyRetry) {
        const legacyPayload = {
          ...common,
          symbol: String(body.ticker).trim().toUpperCase(),
          telegram_url: String(body.telegram_url || '').trim() || null,
          twitter_url: String(body.x_url || '').trim() || null,
          logo_url: String(body.image_url || '').trim() || null,
          submitter_name: String(body.submitter_name || '').trim() || null,
          submitter_email: String(body.submitter_email || '').trim() || null,
          sort_order: 0
        };

        const retry = await supabase.from('tokens').insert(legacyPayload);
        error = retry.error;
      }
    }

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to submit token.' },
      { status: 500 }
    );
  }
}
