export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { BannerStrip } from '@/components/BannerStrip';
import { FilterableTokens } from '@/components/FilterableTokens';
import { getPublicHomeData } from '@/lib/data';

export default async function HomePage() {
  const { tokens, banners } = await getPublicHomeData();
  const promoted = tokens.filter((token) => token.is_promoted);

  return (
    <>
      <section className="site-shell hero-section">
        <div className="hero-copy">
          <span className="eyebrow">TonGemz</span>
          <h1>Find the next big gem on TON</h1>
          <p>
            Discover new TON tokens, promoted projects, and trending communities in one place.
          </p>
          <div className="hero-actions">
            <Link href="/submit" className="primary-button">Submit Coin</Link>
            <a href="#discover" className="ghost-button">Browse Gems</a>
          </div>
          <div className="hero-metrics">
            <div><strong>{tokens.length}</strong><span>Listed Tokens</span></div>
            <div><strong>{promoted.length}</strong><span>Promoted Projects</span></div>
            <div><strong>{banners.length}</strong><span>Live Banners</span></div>
          </div>
        </div>

        <div className="hero-card">
          <span className="pill pill-bright">Trending TON Gems</span>
          <h3>Fresh on TON</h3>
          <ul>
            <li>Discover promoted launches</li>
            <li>Search token cards quickly</li>
            <li>Submit projects for review</li>
            <li>Run sponsored banners on top</li>
          </ul>
        </div>
      </section>

      <BannerStrip banners={banners} />

      <section className="site-shell" id="promoted">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Promoted</span>
            <h2>Promoted Projects</h2>
          </div>
        </div>
        <div className="token-grid">
          {promoted.length ? promoted.map((token) => (
            <article className="promo-highlight" key={token.id}>
              <img src={token.image_url || 'https://placehold.co/120x120/081423/52d3ff?text=TON'} alt={token.name} className="token-image" />
              <div>
                <div className="pill pill-bright">Sponsored</div>
                <h3>{token.name} <span className="ticker">${token.ticker}</span></h3>
                <p>{token.description}</p>
              </div>
            </article>
          )) : <div className="empty-state">No promoted projects yet.</div>}
        </div>
      </section>

      <FilterableTokens tokens={tokens} />
    </>
  );
}
