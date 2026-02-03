import { useRef, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickActions from "./QuickActions";
import { useAptitudeChat } from "@/hooks/useAptitudeChat";
import { useProgress } from "@/hooks/useProgress";
import { LearningMode } from "@/types/aptitude";

const Chatbot = () => {
  const [mode, setMode] = useState<LearningMode>('solve');
  const [topic, setTopic] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addXP, xpRewards } = useProgress();

  const { messages, isStreaming, sendMessage, resetChat } = useAptitudeChat({
    mode,
    topic,
    onMessageComplete: () => {
      // Award XP when AI responds (question answered)
      addXP(xpRewards.questionSolved, topic);
    },
  });

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
    sendMessage(content, image);
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const handleModeChange = (newMode: LearningMode) => {
    setMode(newMode);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
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
  );
};

export default Chatbot;
