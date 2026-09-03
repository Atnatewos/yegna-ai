/**
 * File: apps/web/src/pages/tasks/index.jsx
 * Yegna AI - Tasks Page
 * 
 * Task execution page with task list, active task frame,
 * option selection, and submission flow.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Brain, Activity, FileText, Image as ImageIcon, Mic,
  CheckCircle2, RefreshCw, ChevronRight, AlertCircle, SkipForward
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import { getTasks, submitTask, getTodayProgress } from '../../services/taskService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/feedback/EmptyState';

/**
 * Tasks page component
 */
export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('tasks');
  const { tasks: tasksConfig } = useConfig();
  const queryClient = useQueryClient();

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selectedTaskOption, setSelectedTaskOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetch available tasks
   */
  const { data: tasksData, isLoading: tasksLoading } = useQuery(
    'availableTasks',
    () => getTasks(1, 20),
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
   * Submit task mutation
   */
  const submitMutation = useMutation(
    (submissionData) => submitTask(submissionData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('tasks.submitSuccess'));
        queryClient.invalidateQueries(['availableTasks']);
        queryClient.invalidateQueries(['todayProgress']);
        queryClient.invalidateQueries(['walletBalance']);
        setSelectedTaskOption('');
        setIsSubmitting(false);
      },
      onError: (error) => {
        showErrorToast(error.message || t('tasks.submitError'));
        setIsSubmitting(false);
      }
    }
  );

  /**
   * Task icon mapping from config
   */
  const taskIcons = {
    text: FileText,
    image: ImageIcon,
    file: FileText,
    voice: Mic
  };

  /**
   * Handle task option selection
   */
  const handleOptionSelect = useCallback((option) => {
    setSelectedTaskOption(option);
  }, []);

  /**
   * Handle task submission
   */
  const handleSubmitTask = useCallback(() => {
    const activeTask = tasks[activeTaskIndex];
    
    if (!activeTask) return;
    
    if (!selectedTaskOption) {
      showErrorToast(t('tasks.selectOption'));
      return;
    }
    
    setIsSubmitting(true);
    
    submitMutation.mutate({
      taskId: activeTask.id,
      content: selectedTaskOption,
      taskType: activeTask.task_type
    });
  }, [tasks, activeTaskIndex, selectedTaskOption, submitMutation, showErrorToast, t]);

  /**
   * Handle skip task
   */
  const handleSkipTask = useCallback(() => {
    setSelectedTaskOption('');
    setActiveTaskIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : 0));
  }, [tasks.length]);

  /**
   * Handle previous task
   */
  const handlePreviousTask = useCallback(() => {
    setSelectedTaskOption('');
    setActiveTaskIndex((prev) => (prev > 0 ? prev - 1 : tasks.length - 1));
  }, [tasks.length]);

  const tasks = tasksData?.data?.tasks || [];
  const progress = progressData?.data || {};
  const activeTask = tasks[activeTaskIndex];

  /**
   * Task type labels from config
   */
  const taskTypeLabels = useMemo(() => {
    const labels = {};
    tasksConfig.taskTypes?.forEach((type) => {
      labels[type.id] = type.labelKey;
    });
    return labels;
  }, [tasksConfig]);

  if (tasksLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs />

      {/* Task Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t('tasks.title')}</h2>
          <p className="text-xs text-slate-500">{t('tasks.subtitle')}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1-5 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>
            {t('tasks.todayLimit')}: {progress.tasks_completed || 0} / {user?.dailyTaskLimit || 5} {t('tasks.completed')}
          </span>
        </div>
      </div>

      {/* Active Task Frame */}
      {activeTask ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
          {/* Task Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl icon-gradient shadow-md">
                {React.createElement(taskIcons[activeTask.task_type] || FileText, {
                  className: 'w-6 h-6'
                })}
              </div>
              <div>
                <span className="text-10 uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0-5 rounded">
                  {t(taskTypeLabels[activeTask.task_type] || 'tasks.types.text.label')}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeTask.title}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">{t('tasks.reward')}</span>
              <span className="text-xl font-black text-emerald-600">
                +{activeTask.reward_amount} ETB
              </span>
            </div>
          </div>

          {/* Task Content Body */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {activeTask.description}
            </p>

            {/* Image Task Preview */}
            {activeTask.task_type === 'image' && activeTask.attachments?.[0] && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64">
                <img
                  src={activeTask.attachments[0]}
                  alt="AI Task Asset"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Voice Task Preview */}
            {activeTask.task_type === 'voice' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 shadow">
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <span className="text-xs text-slate-400 block">{t('tasks.audioPreview')}</span>
                  <span className="text-sm font-bold text-slate-800 font-serif">
                    "{activeTask.audio_text || ''}"
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Options Selection */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('tasks.selectAnnotation')}
            </p>
            <div className="grid grid-cols-1 gap-2-5">
              {activeTask.options?.map((option, index) => (
                <label
                  key={index}
                  className={`option-card ${
                    selectedTaskOption === option ? 'option-card-selected' : ''
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-800">{option}</span>
                  <input
                    type="radio"
                    name="taskOption"
                    value={option}
                    checked={selectedTaskOption === option}
                    onChange={() => handleOptionSelect(option)}
                    className="radio-input"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePreviousTask}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1"
            >
              <SkipForward className="w-4 h-4 rotate-180" />
              {t('tasks.skipTask')}
            </button>

            <button
              onClick={handleSubmitTask}
              disabled={isSubmitting || !selectedTaskOption}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('tasks.validating')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {t('tasks.submitTask')} (+{activeTask.reward_amount} ETB)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Brain size={48} />}
          title={t('tasks.noTasksTitle')}
          description={t('tasks.noTasksDescription')}
        />
      )}

      {/* Task Pagination Dots */}
      {tasks.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {tasks.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedTaskOption('');
                setActiveTaskIndex(index);
              }}
              className={`w-2-5 h-2-5 rounded-full transition ${
                index === activeTaskIndex
                  ? 'bg-emerald-700 w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Task ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}