/**
 * File: apps/web/src/pages/admin/settings.jsx
 * Yegna AI - Admin Settings Page
 * 
 * Manage platform settings including commission rates,
 * withdrawal limits, and payment methods.
 */

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getAllSettings, updateSettings } from '../../services/adminService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

/**
 * Admin settings page component
 */
export default function AdminSettingsPage() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [editableSettings, setEditableSettings] = useState({});

  /**
   * Fetch settings
   */
  const { data, isLoading } = useQuery(
    'platformSettings',
    getAllSettings,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Update settings mutation
   */
  const updateMutation = useMutation(
    (settingData) => updateSettings(settingData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || 'Settings updated');
        queryClient.invalidateQueries(['platformSettings']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Handle setting edit
   */
  const handleSettingEdit = useCallback((key, value) => {
    setEditableSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Handle save setting
   */
  const handleSaveSetting = useCallback((setting) => {
    const updatedValue = editableSettings[setting.setting_key];
    if (updatedValue === undefined) return;

    updateMutation.mutate({
      settingKey: setting.setting_key,
      settingValue: updatedValue,
      settingType: setting.setting_type,
      description: setting.description
    });
  }, [editableSettings, updateMutation]);

  const settings = data?.data || [];

  /**
   * Group settings by type
   */
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.setting_type]) {
      acc[setting.setting_type] = [];
    }
    acc[setting.setting_type].push(setting);
    return acc;
  }, {});

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
          <h2 className="text-2xl font-black text-slate-900">Platform Settings</h2>
          <p className="text-xs text-slate-500">Manage platform & MLM settings</p>
        </div>
        <Badge variant="info">Admin System Active</Badge>
      </div>

      {Object.entries(groupedSettings).map(([type, typeSettings]) => (
        <Card key={type} className="space-y-4">
          <h3 className="font-extrabold text-slate-900 capitalize">
            {type} Settings
          </h3>

          <div className="space-y-4">
            {typeSettings.map((setting) => (
              <div
                key={setting.id}
                className="p-4 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">
                    {setting.setting_key}
                  </h4>
                  <Badge variant={setting.is_active ? 'success' : 'error'}>
                    {setting.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {setting.description && (
                  <p className="text-xs text-slate-500">{setting.description}</p>
                )}

                <textarea
                  className="form-input min-h-32 font-mono text-xs"
                  value={
                    editableSettings[setting.setting_key] !== undefined
                      ? JSON.stringify(editableSettings[setting.setting_key], null, 2)
                      : JSON.stringify(setting.setting_value, null, 2)
                  }
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      handleSettingEdit(setting.setting_key, parsed);
                    } catch (err) {
                      handleSettingEdit(setting.setting_key, e.target.value);
                    }
                  }}
                  rows={6}
                />

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveSetting(setting)}
                    loading={updateMutation.isLoading}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}