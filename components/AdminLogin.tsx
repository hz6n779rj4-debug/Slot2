'use client';

import { FormEvent, useState } from 'react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login failed');
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="auth-card">
      <span className="eyebrow">Admin</span>
      <h2>TonGemz Dashboard Login</h2>
      <p>Enter your admin password to manage listings and banners.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        placeholder="Admin password"
      />
      <button disabled={loading} className="primary-button">{loading ? 'Checking...' : 'Open Dashboard'}</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
