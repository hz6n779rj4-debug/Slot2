'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { supabase, TOKENS_BUCKET } from '@/lib/supabase';

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    contract_address: '',
    description: '',
    website_url: '',
    telegram_url: '',
    twitter_url: '',
    submitter_name: '',
    submitter_email: '',
    logo_url: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const preview = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return form.logo_url || '';
  }, [file, form.logo_url]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadLogo = async () => {
    if (!file) return form.logo_url || '';
    const ext = file.name.split('.').pop() || 'png';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(TOKENS_BUCKET).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(TOKENS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const logoUrl = await uploadLogo();
      const payload = {
        name: form.name,
        symbol: form.symbol,
        contract_address: form.contract_address,
        description: form.description,
        website_url: form.website_url || null,
        telegram_url: form.telegram_url || null,
        twitter_url: form.twitter_url || null,
        submitter_name: form.submitter_name || null,
        submitter_email: form.submitter_email || null,
        logo_url: logoUrl || null,
        chain: 'ton',
        status: 'pending',
      };

      const { error } = await supabase.from('tokens').insert(payload);
      if (error) throw error;

      setMessage('Token submitted successfully.');
      setForm({
        name: '', symbol: '', contract_address: '', description: '', website_url: '', telegram_url: '',
        twitter_url: '', submitter_name: '', submitter_email: '', logo_url: '',
      });
      setFile(null);
    } catch (error: any) {
      setIsError(true);
      setMessage(error?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Submit Coin</h1>
      <p className="muted">This clean version submits directly to Supabase. Use the open insert policy for now.</p>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" placeholder="Token Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
        <input className="input" placeholder="Contract Address" value={form.contract_address} onChange={(e) => setForm({ ...form, contract_address: e.target.value })} required />
        <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" placeholder="Website URL" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
        <input className="input" placeholder="Telegram URL" value={form.telegram_url} onChange={(e) => setForm({ ...form, telegram_url: e.target.value })} />
        <input className="input" placeholder="X URL" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
        <input className="input" placeholder="Image URL (optional)" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
        <input className="input" type="file" accept="image/*" onChange={onFileChange} />
        {preview ? <img className="preview" src={preview} alt="preview" /> : null}
        <input className="input" placeholder="Your Name" value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })} />
        <input className="input" placeholder="Your Email" value={form.submitter_email} onChange={(e) => setForm({ ...form, submitter_email: e.target.value })} />
        <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Coin'}</button>
        {message ? <div className={isError ? 'status-err' : 'status-ok'}>{message}</div> : null}
      </form>
    </main>
  );
}
