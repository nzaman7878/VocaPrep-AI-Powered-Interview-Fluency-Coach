import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import UserEditModal from '../../components/admin/UserEditModal';
import { Search, Filter, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminUsers = () => {
  useDocumentTitle('Admin | User Management');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(p => ({ ...p, page: 1 })); // reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.subscriptionStatus = statusFilter;

      const res = await adminApi.getUsers(params);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((p) => ({ ...p, page: newPage }));
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

  const handleUserUpdate = () => {
    setSelectedUser(null);
    fetchUsers(); // Refresh table
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
          User Management
        </h1>
        <p className="text-text-muted font-medium">
          View, search, and manage all users on the platform.
        </p>
      </div>

      <div className="bg-surface border border-surface-elevated rounded-xl shadow-sm flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-elevated flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-surface-elevated border border-surface-elevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
                className="w-full pl-3 pr-8 py-2.5 bg-surface-elevated border border-surface-elevated rounded-lg text-text-primary focus:outline-none appearance-none"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-text-muted">
                <Filter className="h-4 w-4" />
              </div>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
                className="w-full pl-3 pr-8 py-2.5 bg-surface-elevated border border-surface-elevated rounded-lg text-text-primary focus:outline-none appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="free">Free</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-text-muted">
                <Filter className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto relative">
          {isLoading && users.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm z-10">
              <Spinner size="md" />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage message="Failed to fetch users" error={error} onRetry={fetchUsers} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-elevated/30 text-text-muted text-xs uppercase tracking-wider border-b border-surface-elevated">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">AI Usage</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-elevated text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-surface-elevated/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden">
                            {user.picture ? (
                              <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-primary font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">{user.name}</div>
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
                          {user.subscriptionStatus || 'free'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-medium text-text-primary">
                        {user.usageCount || 0}
                      </td>
                      <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          leftIcon={<Settings className="w-4 h-4" />}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-surface-elevated flex items-center justify-between bg-surface-elevated/10">
          <div className="text-sm text-text-muted">
            Showing <span className="font-medium text-text-primary">
              {users.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
            </span> to <span className="font-medium text-text-primary">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="font-medium text-text-primary">{pagination.total}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-surface-elevated text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-elevated transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-text-primary px-2">
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg border border-surface-elevated text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-elevated transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={handleModalClose}
          onUpdate={handleUserUpdate}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
