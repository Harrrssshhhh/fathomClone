import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, Home, Video, Search, CheckSquare, Share2, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';

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
  const { theme, toggleTheme } = useTheme();
  const { meetings } = useApp();

  const openTaskCount = meetings.flatMap(m => m.actionItems).filter(a => !a.completed).length;

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <aside className="w-60 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-sm">
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Meeting</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          const badge = path === '/action-items' && openTaskCount > 0 ? openTaskCount : null;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`sidebar-link w-full relative ${active ? 'active' : ''}`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-600 dark:bg-brand-400 rounded-r-full" />}
              <Icon size={16} />
              <span>{label}</span>
              {badge !== null && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1.5 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="sidebar-link w-full"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <span className="mx-3 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
          ✦ Demo Mode
        </span>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            YO
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 dark:text-white truncate">Your Workspace</div>
            <div className="text-xs text-gray-400 truncate">you@acme.co</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
