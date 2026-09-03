/**
 * File: apps/web/src/pages/dashboard/index.jsx
 * Yegna AI - Dashboard Page
 * 
 * Main dashboard with hero banner, stats cards,
 * available tasks, and recent activity.
 */

import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  Brain, Wallet, Users, Award, CheckCircle2, ArrowUpRight,
  ChevronRight, TrendingUp, Sparkles, Layers, FileText,
  Image as ImageIcon, Mic, Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import { getBalance } from '../../services/walletService';
import { getTasks, getTodayProgress } from '../../services/taskService';
import { getTeamStatistics } from '../../services/teamService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';

/**
 * Dashboard page component
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showErrorToast } = useToast();
  const { t } = useTranslation('dashboard');
  const { levels } = useConfig();

  /**
   * Fetch wallet balance
   */
  const { data: walletData, isLoading: walletLoading } = useQuery(
    'walletBalance',
    getBalance,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch today's progress
   */
  const { data: progressData, isLoading: progressLoading } = useQuery(
    'todayProgress',
    getTodayProgress,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch team statistics
   */
  const { data: teamData, isLoading: teamLoading } = useQuery(
    'teamStatistics',
    getTeamStatistics,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch available tasks
   */
  const { data: tasksData, isLoading: tasksLoading } = useQuery(
    'availableTasks',
    () => getTasks(1, 3),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Get current tier from user
   */
  const currentTier = useMemo(() => {
    if (!user?.tierId) return levels.levels[0];
    return levels.levels.find((lvl) => lvl.id === user.tierId) || levels.levels[0];
  }, [user?.tierId, levels.levels]);

  /**
   * Handle navigate to tasks
   */
  const handleNavigateToTasks = useCallback(() => {
    router.push('/tasks');
  }, [router]);

  /**
   * Handle navigate to levels
   */
  const handleNavigateToLevels = useCallback(() => {
    router.push('/levels');
  }, [router]);

  const balance = walletData?.data?.balance || 0;
  const progress = progressData?.data || {};
  const teamStats = teamData?.data || {};
  const tasks = tasksData?.data?.tasks || [];

  /**
   * Task icon mapping
   */
  const taskIcons = {
    text: FileText,
    image: ImageIcon,
    voice: Mic
  };

  /**
   * Calculate progress percentage
   */
  const progressPercentage = currentTier?.tasksPerDay > 0
    ? Math.min(100, ((progress.tasks_completed || 0) / currentTier.tasksPerDay) * 100)
    : 0;

  if (walletLoading || progressLoading || teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-300 mb-3">
            <Sparkles className="w-3-5 h-3-5" />
            <span>{t('dashboard.officialBadge')}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            {t('dashboard.heroTitle')}
          </h1>

          <p className="text-slate-200 text-sm mt-2 leading-relaxed">
            {t('dashboard.heroSubtitle')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleNavigateToTasks}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-5 py-2-5 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
            >
              <Brain className="w-4 h-4" />
              <span>{t('dashboard.startTasks')}</span>
            </button>

            <button
              onClick={handleNavigateToLevels}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold px-4 py-2-5 rounded-xl transition text-sm"
            >
              {t('dashboard.upgradeTier')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('dashboard.balance')}
            </span>
            <div className="icon-container-sm bg-emerald-50 text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-semibold text-slate-500">ETB</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('dashboard.readyWithdrawal')}</span>
          </div>
        </div>

        {/* Current Tier Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('dashboard.currentTier')}
            </span>
            <div className="icon-container-sm bg-amber-50 text-amber-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {t(currentTier?.nameKey || 'levels.intern.name')}
            </div>
            <p className="text-xs text-slate-500 mt-0-5">
              {currentTier?.tasksPerDay || 0} {t('dashboard.tasksPerDay')} •{' '}
              {currentTier?.incomePerTask || 0} {t('dashboard.etbPerTask')}
            </p>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {t('dashboard.dailyCapacity')}:{' '}
            <span className="font-bold text-slate-700">
              {currentTier?.dailyIncome || 0} ETB
            </span>
          </div>
        </div>

        {/* Tasks Completed Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('dashboard.tasksCompleted')}
            </span>
            <div className="icon-container-sm bg-blue-50 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {progress.tasks_completed || 0}{' '}
            <span className="text-slate-400 text-lg font-normal">
              / {currentTier?.tasksPerDay || 0}
            </span>
          </div>
          <div className="progress-track mt-3">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Team Commission Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('dashboard.teamCommission')}
            </span>
            <div className="icon-container-sm bg-purple-50 text-purple-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {(teamStats.total_commission_earned || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}{' '}
            <span className="text-xs font-semibold text-slate-500">ETB</span>
          </div>
          <div className="mt-3 text-xs text-purple-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3-5 h-3-5" />
            <span>{t('dashboard.passiveIncome')}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Tasks */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {t('dashboard.availableTasks')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('dashboard.trainAiEarn')}
              </p>
            </div>
            <button
              onClick={handleNavigateToTasks}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>{t('dashboard.viewAll')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {tasksLoading ? (
            <Spinner />
          ) : tasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              {t('dashboard.noTasks')}
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const TaskIcon = taskIcons[task.task_type] || FileText;
                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <TaskIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {task.title}
                        </h4>
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {task.description}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-700">
                        +{task.reward_amount} ETB
                      </div>
                      <button
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="mt-1 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition"
                      >
                        {t('dashboard.execute')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-3">
            {[
              {
                id: 'activity-1',
                title: t('dashboard.taskCompletedActivity'),
                amount: '+18.00 ETB',
                date: t('dashboard.justNow'),
                positive: true
              },
              {
                id: 'activity-2',
                title: t('dashboard.referralBonusActivity'),
                amount: '+160.00 ETB',
                date: t('dashboard.hourAgo'),
                positive: true
              },
              {
                id: 'activity-3',
                title: t('dashboard.depositApprovedActivity'),
                amount: '+1,600.00 ETB',
                date: t('dashboard.today'),
                positive: true
              }
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2-5 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <span className="text-10 text-slate-400">{item.date}</span>
                </div>
                <span className={`text-xs font-extrabold ${item.positive ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}