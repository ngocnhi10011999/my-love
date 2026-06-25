import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { triggerTelegramAlert } from '../services/telegram.js';

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
        className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-2 text-slate-900">Secure Gallery</h1>
        <p className="text-sm text-slate-500 mb-6">Enter your access password.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium transition"
        >
          {busy ? 'Unlocking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
