import { useState, useCallback } from 'react';
import { Message, LearningMode } from '@/types/aptitude';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface UseAptitudeChatOptions {
  mode: LearningMode;
  topic?: string;
  onMessageComplete?: () => void;
}

export function useAptitudeChat({ mode, topic, onMessageComplete }: UseAptitudeChatOptions) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(mode),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      image,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    let assistantContent = '';

    try {
      // Build messages array for API
      const apiMessages = [...messages, userMessage].map(msg => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: 'text', text: msg.content },
              { type: 'image_url', image_url: { url: msg.image } },
            ],
          };
        }
        return { role: msg.role, content: msg.content };
      }).filter(msg => msg.role !== 'assistant' || messages.indexOf(messages.find(m => m.id === 'welcome')!) !== 0 || messages.length > 1);

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages.slice(-10), // Keep last 10 messages for context
          mode,
          topic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Add empty assistant message that we'll update
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
          } catch {
            // Incomplete JSON, put it back
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw || !raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
          } catch { /* ignore */ }
        }
      }

      onMessageComplete?.();

    } catch (e) {
      console.error('Chat error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to get response';
      setError(errorMessage);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again! 🙏`,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, mode, topic, onMessageComplete]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(mode),
      },
    ]);
    setError(null);
  }, [mode]);

  return {
    messages,
    setMessages,
    isStreaming,
    error,
    sendMessage,
    resetChat,
  };
}

function getWelcomeMessage(mode: LearningMode): string {
  switch (mode) {
    case 'solve':
      return "Hello! 👋 I'm **AptitudeGuru**, your aptitude expert! Send me any question (text or image) and I'll solve it step-by-step with shortcuts. Let's crack it! 🎯";
    case 'learn':
      return "Hello! 👋 I'm **AptitudeGuru**! Tell me what topic you want to learn - I'll explain it with real examples, practice problems, and memory tricks! 📚";
    case 'quiz':
      return "Hello! 👋 Welcome to **Quiz Mode**! Tell me a topic and I'll test you with questions. Ask for hints if you need them. Ready to challenge yourself? 🧠";
    case 'eli10':
      return "Hey there! 👋 I'm **AptitudeGuru**! I'll explain things super simply - like you're 10 years old! No boring stuff, just fun examples. What do you want to learn? 🎈";
    default:
      return "Hello! 👋 I'm **AptitudeGuru**, your friendly aptitude tutor! How can I help you today? 🎯";
  }
}
