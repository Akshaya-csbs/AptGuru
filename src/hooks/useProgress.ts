import { useState, useEffect, useCallback } from 'react';
import { AptitudeProgress, LevelInfo, LEVELS, BADGES, Badge, XP_REWARDS } from '@/types/aptitude';

const STORAGE_KEY = 'aptitude_guru_progress';

const getDefaultProgress = (): AptitudeProgress => ({
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  questionsAnswered: 0,
  earnedBadges: [],
  topicProgress: {},
  dailyChallengeCompleted: null,
});

export function useProgress() {
  const [progress, setProgress] = useState<AptitudeProgress>(getDefaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // Get current level info
  const getLevelInfo = useCallback((): LevelInfo => {
    const { xp } = progress;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXp) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }, [progress]);

  // Get progress to next level (0-100)
  const getLevelProgress = useCallback((): number => {
    const { xp } = progress;
    const currentLevel = getLevelInfo();
    const nextLevelIndex = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    
    if (nextLevelIndex >= LEVELS.length) return 100;
    
    const nextLevel = LEVELS[nextLevelIndex];
    const xpInCurrentLevel = xp - currentLevel.minXp;
    const xpNeededForNextLevel = nextLevel.minXp - currentLevel.minXp;
    
    return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));
  }, [progress, getLevelInfo]);

  // Update streak based on activity
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActive = progress.lastActiveDate;
    
    if (lastActive === today) return; // Already active today
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    setProgress(prev => {
      const newStreak = lastActive === yesterdayStr ? prev.streak + 1 : 1;
      const newProgress = {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
      };
      
      // Check for streak badges
      if (newStreak >= 3 && !prev.earnedBadges.includes('streak_starter')) {
        newProgress.earnedBadges = [...prev.earnedBadges, 'streak_starter'];
      }
      if (newStreak >= 7 && !prev.earnedBadges.includes('streak_master')) {
        newProgress.earnedBadges = [...prev.earnedBadges, 'streak_master'];
      }
      
      return newProgress;
    });
  }, [progress.lastActiveDate]);

  // Add XP and check for badges
  const addXP = useCallback((amount: number, topic?: string) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newQuestionsAnswered = prev.questionsAnswered + 1;
      const newTopicProgress = { ...prev.topicProgress };
      const newBadges = [...prev.earnedBadges];
      
      if (topic) {
        newTopicProgress[topic] = (newTopicProgress[topic] || 0) + 1;
        
        // Check for topic expert badge
        if (newTopicProgress[topic] >= 50 && !newBadges.includes('topic_expert')) {
          newBadges.push('topic_expert');
        }
      }
      
      // Check for first steps badge
      if (newQuestionsAnswered === 1 && !newBadges.includes('first_steps')) {
        newBadges.push('first_steps');
      }
      
      // Check for quick learner badge
      if (newQuestionsAnswered >= 10 && !newBadges.includes('quick_learner')) {
        newBadges.push('quick_learner');
      }
      
      return {
        ...prev,
        xp: newXp,
        questionsAnswered: newQuestionsAnswered,
        topicProgress: newTopicProgress,
        earnedBadges: newBadges,
      };
    });
    
    updateStreak();
  }, [updateStreak]);

  // Mark daily challenge as completed
  const completeDailyChallenge = useCallback(() => {
    const today = new Date().toDateString();
    if (progress.dailyChallengeCompleted === today) return false;
    
    setProgress(prev => ({
      ...prev,
      dailyChallengeCompleted: today,
      xp: prev.xp + XP_REWARDS.dailyChallenge,
    }));
    
    updateStreak();
    return true;
  }, [progress.dailyChallengeCompleted, updateStreak]);

  // Check if daily challenge is available
  const isDailyChallengeAvailable = useCallback(() => {
    const today = new Date().toDateString();
    return progress.dailyChallengeCompleted !== today;
  }, [progress.dailyChallengeCompleted]);

  // Get earned badges with full info
  const getEarnedBadges = useCallback((): Badge[] => {
    return BADGES.filter(badge => progress.earnedBadges.includes(badge.id));
  }, [progress.earnedBadges]);

  // Award speed demon badge
  const awardSpeedDemon = useCallback(() => {
    setProgress(prev => {
      if (prev.earnedBadges.includes('speed_demon')) return prev;
      return {
        ...prev,
        earnedBadges: [...prev.earnedBadges, 'speed_demon'],
      };
    });
  }, []);

  return {
    progress,
    isLoaded,
    getLevelInfo,
    getLevelProgress,
    addXP,
    completeDailyChallenge,
    isDailyChallengeAvailable,
    getEarnedBadges,
    awardSpeedDemon,
    xpRewards: XP_REWARDS,
  };
}
