import type { Token } from '@/lib/types';
import { shortAddress } from '@/lib/utils';

export function TokenCard({ token }: { token: Token }) {
  return (
    <article className="token-card">
      <div className="token-top">
        <img
          src={token.image_url || 'https://placehold.co/120x120/081423/52d3ff?text=TON'}
          alt={token.name}
          className="token-image"
        />
        <div className="token-meta">
          <div className="token-headline">
            <h3>{token.name}</h3>
            <span className="ticker">${token.ticker}</span>
          </div>
          <div className="badges">
            {token.is_promoted && <span className="pill pill-bright">Promoted</span>}
            {token.is_trending && <span className="pill">Trending</span>}
            {!token.is_promoted && !token.is_trending && <span className="pill">New</span>}
          </div>
          <p>{token.description || 'No description added yet.'}</p>
        </div>
      </div>

      <div className="token-address">CA: {shortAddress(token.contract_address)}</div>

      <div className="token-links">
        {token.telegram_url && <a href={token.telegram_url} target="_blank" rel="noreferrer">Telegram</a>}
        {token.x_url && <a href={token.x_url} target="_blank" rel="noreferrer">X</a>}
        {token.website_url && <a href={token.website_url} target="_blank" rel="noreferrer">Website</a>}
      </div>
    </article>
  );
}
