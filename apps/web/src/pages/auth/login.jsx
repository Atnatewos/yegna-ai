/**
 * File: apps/web/src/pages/auth/login.jsx
 * Yegna AI - Login Page
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { login } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

/**
 * Login page component
 */
export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  /**
   * Handle login submission
   */
  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await login(data.email, data.password);

      if (response.success) {
        authLogin(response.data.user);
        showSuccessToast('Login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      showErrorToast(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }, [authLogin, router, showSuccessToast, showErrorToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="ethiopian-flag-bar" style={{ position: 'fixed', top: 0 }} />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-black text-slate-900 text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Login to continue your AI training journey
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

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            required
            {...register('password', { required: 'Password is required' })}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-emerald-700 font-bold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-emerald-700 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}