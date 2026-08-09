import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic, BarChart2, Settings } from 'lucide-react';

export const MobileBottomNav = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/role-selection', icon: Mic },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16 px-2 pb-safe">
      {links.map((link) => {
        const Icon = link.icon;
        // Basic active check
        const isActive =
          location.pathname.startsWith(link.path) ||
          (link.path === '/role-selection' && location.pathname.startsWith('/interview'));

        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
