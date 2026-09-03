/**
 * File: apps/web/src/pages/auth/register.jsx
 * Yegna AI - Registration Page
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Gift, UserPlus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useDebounce } from '../../hooks/useDebounce';
import { register as registerUser, validateReferralCode } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

/**
 * Registration page component
 */
export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralStatus, setReferralStatus] = useState(null);
  const [referralInfo, setReferralInfo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const referralCode = watch('referralCode');
  const debouncedReferralCode = useDebounce(referralCode, 500);

  /**
   * Validate referral code when debounced value changes
   */
  useEffect(() => {
    if (debouncedReferralCode && debouncedReferralCode.length >= 6) {
      checkReferralCode(debouncedReferralCode);
    } else {
      setReferralStatus(null);
      setReferralInfo(null);
    }
  }, [debouncedReferralCode]);

  /**
   * Check referral code validity
   */
  const checkReferralCode = useCallback(async (code) => {
    try {
      const response = await validateReferralCode(code);
      if (response.success) {
        setReferralStatus('valid');
        setReferralInfo(response.data);
      }
    } catch (err) {
      setReferralStatus('invalid');
      setReferralInfo(null);
    }
  }, []);

  /**
   * Handle registration submission
   */
  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(data);

      if (response.success) {
        login(response.data.user);
        showSuccessToast('Registration successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      showErrorToast(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [login, router, showSuccessToast, showErrorToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="ethiopian-flag-bar" style={{ position: 'fixed', top: 0 }} />

      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-black text-slate-900 text-center mb-1">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Join Yegna AI and start earning
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={<User size={18} />}
              error={errors.fullName?.message}
              required
              {...register('fullName', { required: 'Full name is required' })}
            />

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
              label="Phone Number"
              type="tel"
              placeholder="09XXXXXXXX"
              icon={<Phone size={18} />}
              {...register('phone')}
            />

            <Input
              label="Username"
              type="text"
              placeholder="Choose a username"
              icon={<User size={18} />}
              error={errors.username?.message}
              required
              {...register('username', { required: 'Username is required' })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              required
              {...register('password', { required: 'Password is required', minLength: 8 })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
            />
          </div>

          <div>
            <Input
              label="Referral Code (Optional)"
              type="text"
              placeholder="Enter referral code"
              icon={<Gift size={18} />}
              {...register('referralCode')}
            />

            {referralStatus === 'valid' && referralInfo && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Valid referral code! Referred by: {referralInfo.referrerUsername}
              </div>
            )}

            {referralStatus === 'invalid' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-600 font-semibold">
                <XCircle className="w-4 h-4" />
                Invalid referral code
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
            <input type="checkbox" required className="w-4 h-4" />
            I agree to the Terms & Conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-emerald-700 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}