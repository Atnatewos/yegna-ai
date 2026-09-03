/**
 * File: apps/web/src/pages/auth/forgot-password.jsx
 * Yegna AI - Forgot Password Page
 */

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, Send, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

/**
 * Forgot password page component
 */
export default function ForgotPasswordPage() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  /**
   * Handle form submission
   */
  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailSent(true);
      showSuccessToast('Password reset link sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
      showErrorToast(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }, [showSuccessToast, showErrorToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="ethiopian-flag-bar" style={{ position: 'fixed', top: 0 }} />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-black text-slate-900 text-center mb-1">
          Forgot Password
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Enter your email to reset your password
        </p>

        {error && (
          <Alert
            type="error"
            message={error}
            dismissible
            onDismiss={() => setError('')}
            className="mb-4"
          />
        )}

        {emailSent ? (
          <div className="space-y-4">
            <Alert
              type="success"
              message="Password reset link sent to your email"
            />
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              required
              {...register('email', { required: 'Email is required' })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}