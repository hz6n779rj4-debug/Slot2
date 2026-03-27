import Image from 'next/image';

export type Token = {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  telegram_url?: string;
};

export default function TokenList({ tokens }: { tokens: Token[] }) {
  if (!tokens.length) {
    return <div className="card muted">No approved tokens yet.</div>;
  }

  return (
    <div className="grid grid-3">
      {tokens.map((token) => (
        <div className="card" key={token.id}>
          <div className="token">
            {token.logo_url ? (
              <Image src={token.logo_url} alt={token.name} width={56} height={56} />
            ) : (
              <div className="placeholder" />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>
                {token.name}
                {token.symbol ? <span className="badge">${token.symbol}</span> : null}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>{token.description || 'No description yet.'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {token.website_url ? <a className="muted" href={token.website_url} target="_blank">Website</a> : null}
            {token.telegram_url ? <a className="muted" href={token.telegram_url} target="_blank">Telegram</a> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
