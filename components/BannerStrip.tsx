import type { Banner } from '@/lib/types';

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;

  return (
    <section className="site-shell banner-strip">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link_url}
          target={banner.link_url.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className="banner-card"
        >
          <img src={banner.image_url} alt={banner.title} className="banner-image" />
          <div className="banner-overlay">
            <span className="pill">Sponsored Banner</span>
            <h3>{banner.title}</h3>
          </div>
        </a>
      ))}
    </section>
  );
}
