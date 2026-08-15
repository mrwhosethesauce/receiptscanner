import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-indigo-600 mr-4">Receipt Scanner</span>
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/scan" className={linkClass}>Scan Receipt</NavLink>
          <NavLink to="/expenses" className={linkClass}>Expenses</NavLink>
          <NavLink to="/tips" className={linkClass}>Tips</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
