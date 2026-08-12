import React, { useState } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { X } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const UserEditModal = ({ user, onClose, onUpdate }) => {
  const [role, setRole] = useState(user?.role || 'user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === user.role) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await adminApi.updateUserRole(user._id, role);
      onUpdate(); // trigger refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-surface-elevated rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-surface-elevated">
          <h2 className="text-xl font-bold text-text-primary">Manage User</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-text-primary text-lg">{user.name}</div>
                <div className="text-text-muted text-sm">{user.email}</div>
              </div>
            </div>

            {/* Read-only stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-elevated/50 p-3 rounded-lg border border-surface-elevated">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">AI Usage</div>
                <div className="font-mono text-lg text-text-primary font-bold">{user.usageCount || 0}</div>
              </div>
              <div className="bg-surface-elevated/50 p-3 rounded-lg border border-surface-elevated">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Status</div>
                <Badge
                  variant={
                    user.subscriptionStatus === 'active'
                      ? 'success'
                      : user.subscriptionStatus === 'past_due'
                      ? 'warning'
                      : 'default'
                  }
                  className="mt-1"
                >
                  {user.subscriptionStatus || 'free'}
                </Badge>
              </div>
            </div>

            {user.stripeCustomerId && (
              <div className="text-xs font-mono text-text-muted break-all">
                Stripe ID: {user.stripeCustomerId}
              </div>
            )}

            {/* Editable Role */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-elevated border border-surface-elevated rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-xs text-text-muted">
                Administrators have full access to the dashboard and user management.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-surface-elevated bg-surface-elevated/30 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || role === user.role} isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
