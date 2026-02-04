import { useRef, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickActions from "./QuickActions";
import ChatHistory from "./ChatHistory";
import { useAptitudeChat } from "@/hooks/useAptitudeChat";
import { useProgress } from "@/hooks/useProgress";
import { useChatHistory } from "@/hooks/useChatHistory";
import { LearningMode } from "@/types/aptitude";

const Chatbot = () => {
  const [mode, setMode] = useState<LearningMode>('solve');
  const [topic, setTopic] = useState<string | undefined>(undefined);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addXP, xpRewards } = useProgress();

  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    groupSessionsByDate,
  } = useChatHistory();

  const { messages, isStreaming, sendMessage, resetChat, setMessages } = useAptitudeChat({
    mode,
    topic,
    onMessageComplete: () => {
      addXP(xpRewards.questionSolved, topic);
    },
  });

  // Save messages to current session whenever they change
  useEffect(() => {
    if (currentSessionId && messages.length > 1) {
      updateSession(currentSessionId, messages, mode, topic);
    }
  }, [messages, currentSessionId, mode, topic, updateSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Reset chat when mode changes
  useEffect(() => {
    resetChat();
  }, [mode]);

  const handleSend = (content: string, image?: string) => {
    // Create new session if none exists
    if (!currentSessionId) {
      createSession(mode, topic);
    }
    sendMessage(content, image);
  };

  const handleQuickAction = (action: string) => {
    if (!currentSessionId) {
      createSession(mode, topic);
    }
    sendMessage(action);
  };

  const handleModeChange = (newMode: LearningMode) => {
    setMode(newMode);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = getSession(sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMode(session.mode);
      setTopic(session.topic);
      setMessages(session.messages);
      setShowHistory(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    resetChat();
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    if (sessionId === currentSessionId) {
      setCurrentSessionId(null);
      resetChat();
    }
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* History Sidebar */}
      {showHistory && (
        <div className="w-72 flex-shrink-0 animate-slide-in-left">
          <ChatHistory
            groupedSessions={groupSessionsByDate()}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onNewChat={handleNewChat}
            onClose={() => setShowHistory(false)}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Chat Container */}
        <div className="relative flex flex-col flex-1 max-w-3xl mx-auto w-full">
          <ChatHeader 
            mode={mode} 
            onModeChange={handleModeChange}
            topic={topic}
            onTopicChange={setTopic}
            showHistory={showHistory}
            onToggleHistory={handleToggleHistory}
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                image={message.image}
              />
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <ChatMessage role="assistant" content="" isTyping />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Show when chat is mostly empty */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <QuickActions onAction={handleQuickAction} disabled={isStreaming} />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border/30 bg-background/80 backdrop-blur-xl">
            <ChatInput onSend={handleSend} disabled={isStreaming} />
            <p className="text-center text-xs text-muted-foreground mt-3">
              Press Enter to send • Paste or upload images • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
