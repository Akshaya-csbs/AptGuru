import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message, LearningMode } from '@/types/aptitude';

const STORAGE_KEY = 'aptitude_guru_chat_history';
const MAX_SESSIONS = 50;

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createSession = useCallback((mode: LearningMode, topic?: string): string => {
    const id = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: 'New Chat',
      messages: [],
      mode,
      topic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions(prev => {
      const updated = [newSession, ...prev];
      // Keep only MAX_SESSIONS
      return updated.slice(0, MAX_SESSIONS);
    });

    setCurrentSessionId(id);
    return id;
  }, []);

  const updateSession = useCallback((sessionId: string, messages: Message[], mode?: LearningMode, topic?: string) => {
    setSessions(prev => {
      return prev.map(session => {
        if (session.id === sessionId) {
          // Generate title from first user message if not set
          let title = session.title;
          if (title === 'New Chat' && messages.length > 0) {
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '');
            }
          }

          return {
            ...session,
            title,
            messages: messages.slice(-50), // Keep last 50 messages
            mode: mode ?? session.mode,
            topic: topic ?? session.topic,
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      });
    });
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const getSession = useCallback((sessionId: string): ChatSession | undefined => {
    return sessions.find(s => s.id === sessionId);
  }, [sessions]);

  const groupSessionsByDate = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups: {
      today: ChatSession[];
      yesterday: ChatSession[];
      lastWeek: ChatSession[];
      older: ChatSession[];
    } = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.updatedAt);
      
      if (sessionDate >= today) {
        groups.today.push(session);
      } else if (sessionDate >= yesterday) {
        groups.yesterday.push(session);
      } else if (sessionDate >= lastWeek) {
        groups.lastWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  }, [sessions]);

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    groupSessionsByDate,
  };
}
