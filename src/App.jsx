import { useAuth } from './context/AuthContext.jsx';
import Gate from './components/Gate.jsx';
import GuestView from './components/GuestView.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
  const { role, logout } = useAuth();

  if (!role) return <Gate />;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Secure Gallery</h1>
            <p className="text-xs text-slate-400 capitalize">Signed in as {role}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {role === 'admin' ? <AdminPanel /> : <GuestView />}
      </main>
    </div>
  );
}
