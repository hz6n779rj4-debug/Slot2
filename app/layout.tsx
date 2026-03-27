import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'TonGemz | Find TON Gems',
  description: 'Discover and submit TON gems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">
              <div className="logo" />
              <div>
                <div className="title">TONGEMZ</div>
                <div className="subtitle">Find TON Gems</div>
              </div>
            </div>
            <nav className="nav">
              <Link href="/">Discover</Link>
              <Link href="/submit">Submit Coin</Link>
            </nav>
          </header>
          {children}
          <div className="footer">TonGemz</div>
        </div>
      </body>
    </html>
  );
}
