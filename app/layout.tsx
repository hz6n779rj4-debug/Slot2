import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TonGemz | Find TON Gems',
  description: 'Discover promoted and trending TON projects on TonGemz.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-bg" />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
