import React from 'react';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

const RecentUsersTable = ({ users = [] }) => {
  return (
    <div className="bg-surface border border-surface-elevated rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-surface-elevated">
        <h3 className="text-lg font-bold text-text-primary">Recent Signups</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-elevated/50 text-text-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-elevated text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                  No recent users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-surface-elevated/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{user.name}</div>
                        <div className="text-text-muted text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        user.subscriptionStatus === 'active'
                          ? 'success'
                          : user.subscriptionStatus === 'past_due'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {user.subscriptionStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentUsersTable;
