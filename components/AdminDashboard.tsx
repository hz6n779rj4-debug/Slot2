'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { Banner, Token } from '@/lib/types';
import { getPublicSupabaseClient } from '@/lib/supabase';

export function AdminDashboard({ initialTokens, initialBanners }: { initialTokens: Token[]; initialBanners: Banner[] }) {
  const [tokens, setTokens] = useState(initialTokens);
  const [banners, setBanners] = useState(initialBanners);
  const [bannerMessage, setBannerMessage] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const counts = useMemo(() => ({
    all: tokens.length,
    pending: tokens.filter((item) => item.status === 'pending').length,
    approved: tokens.filter((item) => item.status === 'approved').length,
    promoted: tokens.filter((item) => item.is_promoted).length
  }), [tokens]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  }

  async function updateToken(id: string, action: 'approve' | 'promote' | 'reject' | 'feature') {
    const response = await fetch(`/api/admin/tokens/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || 'Action failed');
      return;
    }
    setTokens((current) => current.map((item) => (item.id === id ? { ...item, ...result.token } : item)));
  }

  async function uploadBannerImage(file: File) {
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BANNERS_BUCKET || 'banners';
    const supabase = getPublicSupabaseClient();
    const filePath = `banners/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file, { cacheControl: '3600' });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
  }

  async function createBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBannerMessage('');
    const form = new FormData(event.currentTarget);
    try {
      let image_url = String(form.get('image_url') || '');
      if (uploadMode === 'upload' && bannerFile) {
        image_url = await uploadBannerImage(bannerFile);
      }

      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: String(form.get('title') || ''),
          image_url,
          link_url: String(form.get('link_url') || ''),
          starts_at: String(form.get('starts_at') || ''),
          ends_at: String(form.get('ends_at') || ''),
          is_active: true
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to create banner');
      setBanners((current) => [result.banner, ...current]);
      setBannerMessage('Banner added successfully.');
      setBannerFile(null);
      event.currentTarget.reset();
    } catch (error) {
      setBannerMessage(error instanceof Error ? error.message : 'Unable to create banner');
    }
  }

  async function disableBanner(id: string) {
    const response = await fetch('/api/admin/banners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: false })
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || 'Unable to update banner');
      return;
    }
    setBanners((current) => current.map((banner) => (banner.id === id ? { ...banner, is_active: false } : banner)));
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h2>TonGemz Admin Panel</h2>
        </div>
        <button className="ghost-button" onClick={logout}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><strong>{counts.all}</strong><span>All Tokens</span></div>
        <div className="stat-card"><strong>{counts.pending}</strong><span>Pending</span></div>
        <div className="stat-card"><strong>{counts.approved}</strong><span>Approved</span></div>
        <div className="stat-card"><strong>{counts.promoted}</strong><span>Promoted</span></div>
      </div>

      <section className="panel">
        <div className="section-heading"><h3>Manage Tokens</h3></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id}>
                  <td>
                    <div className="table-token">
                      <img src={token.image_url || 'https://placehold.co/48x48/081423/52d3ff?text=TON'} alt={token.name} />
                      <div>
                        <strong>{token.name}</strong>
                        <div>${token.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td>{token.status}{token.is_promoted ? ' • promoted' : ''}{token.is_trending ? ' • trending' : ''}</td>
                  <td className="table-links">
                    {token.telegram_url && <a href={token.telegram_url} target="_blank">Telegram</a>}
                    {token.x_url && <a href={token.x_url} target="_blank">X</a>}
                    {token.website_url && <a href={token.website_url} target="_blank">Website</a>}
                  </td>
                  <td>
                    <div className="action-row">
                      <button onClick={() => updateToken(token.id, 'approve')}>Approve</button>
                      <button onClick={() => updateToken(token.id, 'promote')}>Promote</button>
                      <button onClick={() => updateToken(token.id, 'feature')}>Trend</button>
                      <button onClick={() => updateToken(token.id, 'reject')}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading"><h3>Banner Manager</h3></div>
        <form onSubmit={createBanner} className="form-card compact">
          <div className="form-grid">
            <label>
              Banner title
              <input name="title" className="input" required />
            </label>
            <label>
              Link URL
              <input name="link_url" className="input" required />
            </label>
            <label>
              Starts at
              <input name="starts_at" type="datetime-local" className="input" />
            </label>
            <label>
              Ends at
              <input name="ends_at" type="datetime-local" className="input" />
            </label>
            <div className="full-width">
              <div className="toggle-row">
                <button type="button" className={uploadMode === 'url' ? 'toggle active' : 'toggle'} onClick={() => setUploadMode('url')}>Banner URL</button>
                <button type="button" className={uploadMode === 'upload' ? 'toggle active' : 'toggle'} onClick={() => setUploadMode('upload')}>Upload Banner</button>
              </div>
              {uploadMode === 'url' ? (
                <label>
                  Image URL
                  <input name="image_url" className="input" placeholder="https://..." required />
                </label>
              ) : (
                <label>
                  Upload banner image
                  <input type="file" accept="image/*" className="input" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} required />
                </label>
              )}
            </div>
          </div>
          <button className="primary-button">Add Banner</button>
          {bannerMessage && <p className="form-message">{bannerMessage}</p>}
        </form>

        <div className="banner-admin-grid">
          {banners.map((banner) => (
            <div className="banner-admin-card" key={banner.id}>
              <img src={banner.image_url} alt={banner.title} className="banner-image small" />
              <strong>{banner.title}</strong>
              <a href={banner.link_url} target="_blank">Open Link</a>
              <span>{banner.is_active ? 'Active' : 'Inactive'}</span>
              {banner.is_active && <button onClick={() => disableBanner(banner.id)}>Disable</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
