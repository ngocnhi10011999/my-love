import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { triggerTelegramAlert } from '../services/telegram.js';
import Heart from './Heart.jsx';

export default function Gate() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const role = login(password);
    if (!role) {
      setError('Incorrect password');
      setBusy(false);
      return;
    }
    if (role === 'guest') {
      triggerTelegramAlert('Guest viewer entered the gallery').catch(() => {});
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white/80 backdrop-blur border border-rose-200 p-8 shadow-2xl shadow-rose-200/50"
      >
        <div className="flex items-center gap-2 text-rose-500 mb-3">
          <Heart className="w-7 h-7 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-semibold">For you</span>
        </div>
        <h1 className="text-3xl font-serif italic text-rose-900 mb-2">Our Little Gallery</h1>
        <p className="text-sm text-rose-700/70 mb-6">Whisper the secret word.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200 text-rose-950 placeholder-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-200 disabled:to-pink-200 disabled:cursor-not-allowed text-white font-medium shadow-lg shadow-rose-300/50 transition flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          {busy ? 'Unlocking…' : 'Open the gallery'}
        </button>
      </form>
    </div>
  );
}
