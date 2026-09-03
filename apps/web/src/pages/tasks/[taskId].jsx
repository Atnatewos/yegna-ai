/**
 * File: apps/web/src/pages/tasks/[taskId].jsx
 * Yegna AI - Single Task Page
 * 
 * Displays a single task with full details and submission form.
 * Updated to reflect that submissions are queued for admin review.
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  FileText, Image as ImageIcon, Mic, CheckCircle2, RefreshCw,
  ArrowLeft, Award, Clock
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getTaskById, submitTask } from '../../services/taskService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/feedback/EmptyState';

/**
 * Task detail page component
 */
export default function TaskDetailPage() {
  const router = useRouter();
  const { taskId } = router.query;
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('tasks');
  const queryClient = useQueryClient();

  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery(
    ['taskDetail', taskId],
    () => getTaskById(taskId),
    {
      enabled: !!taskId,
      onError: (error) => showErrorToast(error.message)
    }
  );

  const submitMutation = useMutation(
    (submissionData) => submitTask(submissionData),
    {
      onSuccess: (response) => {
        // Updated messaging to match backend reality: submission is pending review
        showSuccessToast(response.message || t('tasks.submitSuccess'));
        queryClient.invalidateQueries(['availableTasks']);
        queryClient.invalidateQueries(['todayProgress']);
        router.push('/tasks');
      },
      onError: (error) => {
        showErrorToast(error.message || t('tasks.submitError'));
        setIsSubmitting(false);
      }
    }
  );

  const handleSubmit = useCallback(() => {
    if (!selectedOption) {
      showErrorToast(t('tasks.selectOption'));
      return;
    }

    setIsSubmitting(true);

    submitMutation.mutate({
      taskId,
      content: selectedOption,
      taskType: data?.data?.task_type || 'text'
    });
  }, [taskId, selectedOption, data, submitMutation, showErrorToast, t]);

  const task = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          title={t('tasks.taskNotFound')}
          description={t('tasks.taskNotFoundDescription')}
        />
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => router.push('/tasks')}>
            <ArrowLeft className="w-4 h-4" />
            {t('tasks.backToTasks')}
          </Button>
        </div>
      </div>
    );
  }

  const taskIcons = {
    text: FileText,
    image: ImageIcon,
    voice: Mic
  };
  const TaskIcon = taskIcons[task.task_type] || FileText;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumbs />

      <button
        onClick={() => router.push('/tasks')}
        className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('tasks.backToTasks')}
      </button>

      <Card className="space-y-6 p-6 md:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl icon-gradient shadow-md">
              <TaskIcon className="w-6 h-6" />
            </div>
            <div>
              <Badge variant="info">
                {t(`tasks.types.${task.task_type}.label`)}
              </Badge>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                {task.title}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">{t('tasks.reward')}</span>
            <span className="text-2xl font-black text-emerald-600">
              +{task.reward_amount} ETB
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{task.required_level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>5 min</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {task.description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t('tasks.selectAnnotation')}
          </p>
          <div className="grid grid-cols-1 gap-2-5">
            {task.options?.map((option, index) => (
              <label
                key={index}
                className={`option-card ${
                  selectedOption === option ? 'option-card-selected' : ''
                }`}
              >
                <span className="text-sm font-semibold text-slate-800">{option}</span>
                <input
                  type="radio"
                  name="taskOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="radio-input"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedOption}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {t('tasks.submitTask')} (+{task.reward_amount} ETB)
                </span>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}