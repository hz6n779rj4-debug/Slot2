'use client';

import { FormEvent, useMemo, useState } from 'react';
import { getPublicSupabaseClient } from '@/lib/supabase';

export function SubmitForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const storageBucket = useMemo(
    () => process.env.NEXT_PUBLIC_STORAGE_TOKENS_BUCKET || 'token-images',
    []
  );

  async function uploadImage(): Promise<string> {
    if (imageMode === 'url') return imageUrl.trim();
    if (!file) return '';

    const supabase = getPublicSupabaseClient();
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const path = `submissions/${filename}`;
    const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;
    const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData(event.currentTarget);

    try {
      const uploadedImage = await uploadImage();
      const payload = {
        name: String(form.get('name') || ''),
        ticker: String(form.get('ticker') || ''),
        contract_address: String(form.get('contract_address') || ''),
        description: String(form.get('description') || ''),
        telegram_url: String(form.get('telegram_url') || ''),
        x_url: String(form.get('x_url') || ''),
        website_url: String(form.get('website_url') || ''),
        image_url: uploadedImage
      };

      const response = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit token.');

      (event.currentTarget as HTMLFormElement).reset();
      setFile(null);
      setPreview('');
      setImageUrl('');
      setMessage('Token submitted successfully. It is now pending admin review.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-grid">
        <label>
          Token Name
          <input name="name" className="input" required />
        </label>
        <label>
          Ticker
          <input name="ticker" className="input" required maxLength={12} />
        </label>
        <label className="full-width">
          Contract Address
          <input name="contract_address" className="input" required />
        </label>
        <label className="full-width">
          Description
          <textarea name="description" className="input textarea" rows={4} required />
        </label>
        <label>
          Telegram URL
          <input name="telegram_url" type="url" className="input" />
        </label>
        <label>
          X URL
          <input name="x_url" type="url" className="input" />
        </label>
        <label className="full-width">
          Website URL
          <input name="website_url" type="url" className="input" />
        </label>
      </div>

      <div className="upload-box">
        <div className="toggle-row">
          <button type="button" className={imageMode === 'url' ? 'toggle active' : 'toggle'} onClick={() => setImageMode('url')}>Image URL</button>
          <button type="button" className={imageMode === 'upload' ? 'toggle active' : 'toggle'} onClick={() => setImageMode('upload')}>Upload Image</button>
        </div>

        {imageMode === 'url' ? (
          <label>
            Token Image URL
            <input
              className="input"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreview(e.target.value);
              }}
              placeholder="https://..."
            />
          </label>
        ) : (
          <label>
            Upload Token Image
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                setPreview(selected ? URL.createObjectURL(selected) : '');
              }}
            />
          </label>
        )}

        {preview && <img src={preview} alt="Preview" className="preview-image" />}
      </div>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Coin'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
