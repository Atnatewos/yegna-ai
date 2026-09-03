/**
 * File: apps/web/src/pages/profile/index.jsx
 * Yegna AI - Profile Page
 * 
 * Displays and allows editing of user profile.
 */

import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { User, Mail, Phone, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { updateProfile } from '../../services/authService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

/**
 * Profile page component
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('profile');
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || ''
  });

  /**
   * Update profile mutation
   */
  const updateMutation = useMutation(
    (profileData) => updateProfile(profileData),
    {
      onSuccess: (response) => {
        updateUser(response.data);
        showSuccessToast('Profile updated successfully');
        queryClient.invalidateQueries(['currentUser']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  }, [formData, updateMutation]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs />

      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center text-2xl font-black mx-auto shadow-lg shadow-emerald-600/20">
          {user.full_name?.[0] || user.username?.[0] || '?'}
        </div>
        <h2 className="text-xl font-black text-slate-900 mt-3">
          {user.full_name || user.username}
        </h2>
        <p className="text-xs text-slate-500">@{user.username}</p>
        <div className="mt-2">
          <Badge variant="success">{user.level_name || 'Intern'}</Badge>
        </div>
      </div>

      <Card className="space-y-4">
        <h3 className="font-extrabold text-slate-900">Edit Profile</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            icon={<User size={18} />}
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone size={18} />}
          />

          <Input
            label="Email Address"
            type="email"
            value={user.email}
            icon={<Mail size={18} />}
            disabled
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={updateMutation.isLoading}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}