import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic, BarChart2, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interviews', path: '/interviews', icon: Mic },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 pt-16 bg-surface border-r border-surface-elevated hidden md:flex flex-col z-30">
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mini Streak/Status indicator */}
      <div className="p-4 border-t border-surface-elevated">
        <div className="bg-surface-elevated rounded-md p-3 flex items-center justify-between group cursor-default">
          <div className="text-xs font-mono text-text-muted">Current Streak</div>
          <div className="text-sm font-display font-bold text-accent flex items-center gap-1 group-hover:scale-110 transition-transform">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            3 Days
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
