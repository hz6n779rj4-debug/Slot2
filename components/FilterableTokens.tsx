'use client';

import { useMemo, useState } from 'react';
import type { Token } from '@/lib/types';
import { TokenCard } from '@/components/TokenCard';

export function FilterableTokens({ tokens }: { tokens: Token[] }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'all' | 'promoted' | 'trending'>('all');

  const filtered = useMemo(() => {
    return tokens.filter((token) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || [token.name, token.ticker, token.description, token.contract_address]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));

      const matchesMode =
        mode === 'all' ||
        (mode === 'promoted' && token.is_promoted) ||
        (mode === 'trending' && token.is_trending);

      return matchesQuery && matchesMode;
    });
  }, [mode, query, tokens]);

  return (
    <section className="site-shell" id="discover">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Discover</span>
          <h2>Trending TON Gems</h2>
        </div>
        <div className="filters">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TON tokens..."
            className="input"
          />
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="input select">
            <option value="all">All</option>
            <option value="promoted">Promoted</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      <div className="token-grid">
        {filtered.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      {!filtered.length && <div className="empty-state">No TON tokens match your search yet.</div>}
    </section>
  );
}
