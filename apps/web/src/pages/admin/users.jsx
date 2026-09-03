/**
 * File: apps/web/src/pages/admin/users.jsx
 * Yegna AI - Admin Users Page
 * 
 * View and manage platform users.
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Users, Search } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getAllUsers } from '../../services/adminService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/navigation/Pagination';
import EmptyState from '../../components/feedback/EmptyState';
import Input from '../../components/ui/Input';

/**
 * Admin users page component
 */
export default function AdminUsersPage() {
  const { showErrorToast } = useToast();
  const { t } = useTranslation('admin');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch users
   */
  const { data, isLoading } = useQuery(
    ['allUsers', page],
    () => getAllUsers(page, 20),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

  /**
   * Filter users by search term
   */
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.full_name?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Users</h2>
          <p className="text-xs text-slate-500">Manage platform users</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search users..."
          icon={<Search size={18} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="p-0 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title="No Users Found"
            description="There are no users in the platform yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {user.full_name?.[0] || user.username?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {user.full_name || user.username}
                          </p>
                          <p className="text-10 text-slate-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs">{user.email}</td>
                    <td>
                      <Badge variant="success">{user.level_name || 'Intern'}</Badge>
                    </td>
                    <td className="font-bold">{user.balance || 0} ETB</td>
                    <td>
                      <Badge variant={user.is_active ? 'success' : 'error'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}