import { useState, useEffect, useCallback } from 'react';
import { getTotalQueryCount, sqlCurriculum } from '@/data/sqlCurriculum';

const STORAGE_KEY = 'afterselect_progress';

export interface ProgressData {
  completedQueries: string[];
  lastQueryId: string | null;
  lastModuleId: string | null;
  startedAt: string;
}

const defaultProgress: ProgressData = {
  completedQueries: [],
  lastQueryId: null,
  lastModuleId: null,
  startedAt: new Date().toISOString(),
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const totalQueries = getTotalQueryCount();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  }, []);

  // Save to localStorage
  const saveProgress = useCallback((newProgress: ProgressData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, []);

  const markCompleted = useCallback((queryId: string) => {
    if (!progress.completedQueries.includes(queryId)) {
      const newProgress = {
        ...progress,
        completedQueries: [...progress.completedQueries, queryId],
        lastQueryId: queryId,
      };
      saveProgress(newProgress);
    }
  }, [progress, saveProgress]);

  const markUncompleted = useCallback((queryId: string) => {
    const newProgress = {
      ...progress,
      completedQueries: progress.completedQueries.filter(id => id !== queryId),
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  const setLastModule = useCallback((moduleId: string) => {
    const newProgress = { ...progress, lastModuleId: moduleId };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  const isCompleted = useCallback((queryId: string) => {
    return progress.completedQueries.includes(queryId);
  }, [progress.completedQueries]);

  const getFirstIncomplete = useCallback(() => {
    for (const module of sqlCurriculum) {
      for (const lesson of module.lessons) {
        for (const query of lesson.queries) {
          if (!progress.completedQueries.includes(query.id)) {
            return query.id;
          }
        }
      }
    }
    return null;
  }, [progress.completedQueries]);

  const resetProgress = useCallback(() => {
    saveProgress({ ...defaultProgress, startedAt: new Date().toISOString() });
  }, [saveProgress]);

  const completedCount = progress.completedQueries.length;
  const progressPercent = Math.round((completedCount / totalQueries) * 100);

  return {
    progress,
    completedCount,
    totalQueries,
    progressPercent,
    markCompleted,
    markUncompleted,
    isCompleted,
    setLastModule,
    resetProgress,
    getFirstIncomplete,
  };
}
