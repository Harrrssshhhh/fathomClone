import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, Home, Video, Search, CheckSquare, Share2, Settings } from 'lucide-react';

const NAV = [
  { path: '/',             icon: Home,        label: 'Home' },
  { path: '/meetings',     icon: Video,       label: 'Meetings' },
  { path: '/search',       icon: Search,      label: 'Search' },
  { path: '/action-items', icon: CheckSquare, label: 'Action Items' },
  { path: '/shared',       icon: Share2,      label: 'Shared Clips' },
  { path: '/settings',     icon: Settings,    label: 'Settings' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 leading-tight">Meeting</div>
          <div className="text-xs text-gray-500 leading-tight">Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`sidebar-link w-full ${isActive(path) ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        <span className="mx-3 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          ✦ Demo Mode
        </span>
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
            YO
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">Your Workspace</div>
            <div className="text-xs text-gray-400 truncate">you@acme.co</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
