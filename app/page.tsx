import TokenList from '@/components/TokenList';
import { createClient } from '@supabase/supabase-js';

async function getTokens() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('tokens')
    .select('id,name,symbol,description,logo_url,website_url,telegram_url')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  return data || [];
}

export default async function HomePage() {
  const tokens = await getTokens();

  return (
    <main>
      <section className="hero">
        <h1>Find the next big gem on TON</h1>
        <p>Discover fresh TON tokens and submit your project in a simple clean version that works with Supabase directly.</p>
      </section>
      <TokenList tokens={tokens} />
    </main>
  );
}
