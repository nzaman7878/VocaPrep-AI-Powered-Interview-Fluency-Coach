import React from 'react';
import { Menu, LogOut, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Button from '../ui/Button';

const AdminTopbar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-surface border-b border-surface-elevated flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-elevated"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-text-primary">Admin Console</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="hidden sm:flex" leftIcon={<ExternalLink className="w-4 h-4" />}>
            Return to App
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 border-l border-surface-elevated pl-4">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-text-primary">{user?.name}</div>
            <div className="text-xs text-primary uppercase font-bold tracking-wider">{user?.role}</div>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 text-text-muted hover:text-error rounded-md hover:bg-error/10 transition-colors ml-2"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
