import Link from 'next/link';

export function Header() {
  return (
    <header className="site-shell topbar">
      <Link href="/" className="brandmark">
        <div className="brand-orb" />
        <div>
          <div className="brand-title">TONGEMZ</div>
          <div className="brand-subtitle">Find TON Gems</div>
        </div>
      </Link>

      <nav className="nav-links">
        <Link href="/#discover">Discover</Link>
        <Link href="/#promoted">Promoted</Link>
        <Link href="/submit" className="nav-button">Submit Coin</Link>
        <Link href="/admin" className="nav-muted">Admin</Link>
      </nav>
    </header>
  );
}
