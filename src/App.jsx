import { useAuth } from './context/AuthContext.jsx';
import Gate from './components/Gate.jsx';
import GuestView from './components/GuestView.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Heart from './components/Heart.jsx';

export default function App() {
  const { role, logout } = useAuth();

  if (!role) return <Gate />;

  return (
    <div className="min-h-screen">
      <header className="border-b border-rose-200/60 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-rose-300/50">
              <Heart className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-serif italic text-rose-900">Our Little Gallery</h1>
              <p className="text-xs text-rose-500 capitalize">Signed in as {role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm rounded-full bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 transition"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="py-12 sm:py-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-semibold mb-4">
            A little corner of us
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-rose-900 leading-tight">
            Every picture, a heartbeat.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-rose-700/70">
            A quiet place to keep the moments worth remembering — soft mornings,
            stolen smiles, the everyday tiny forevers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-rose-300">
            <span className="h-px w-12 bg-rose-200" />
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="h-px w-12 bg-rose-200" />
          </div>
        </section>
        {role === 'admin' ? <AdminPanel /> : <GuestView />}
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-rose-400 flex items-center justify-center gap-1">
        made with <Heart className="w-3 h-3 text-rose-500" />
      </footer>
    </div>
  );
}
