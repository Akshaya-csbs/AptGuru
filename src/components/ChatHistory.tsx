import { X, Plus } from "lucide-react";
import { ChatSession } from "@/types/aptitude";
import ChatHistoryItem from "./ChatHistoryItem";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface GroupedSessions {
  today: ChatSession[];
  yesterday: ChatSession[];
  lastWeek: ChatSession[];
  older: ChatSession[];
}

interface ChatHistoryProps {
  groupedSessions: GroupedSessions;
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

const DateGroup = ({
  label,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}: {
  label: string;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}) => {
  if (sessions.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
        {label}
      </h3>
      <div className="space-y-1">
        {sessions.map((session) => (
          <ChatHistoryItem
            key={session.id}
            session={session}
            isActive={session.id === currentSessionId}
            onClick={() => onSelectSession(session.id)}
            onDelete={() => onDeleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
};

const ChatHistory = ({
  groupedSessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  onClose,
}: ChatHistoryProps) => {
  const hasAnySessions =
    groupedSessions.today.length > 0 ||
    groupedSessions.yesterday.length > 0 ||
    groupedSessions.lastWeek.length > 0 ||
    groupedSessions.older.length > 0;

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Chat History</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close history"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button onClick={onNewChat} className="w-full gap-2" variant="outline">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-2">
        {hasAnySessions ? (
          <>
            <DateGroup
              label="Today"
              sessions={groupedSessions.today}
              currentSessionId={currentSessionId}
              onSelectSession={onSelectSession}
              onDeleteSession={onDeleteSession}
            />
            <DateGroup
              label="Yesterday"
              sessions={groupedSessions.yesterday}
              currentSessionId={currentSessionId}
              onSelectSession={onSelectSession}
              onDeleteSession={onDeleteSession}
            />
            <DateGroup
              label="Last 7 Days"
              sessions={groupedSessions.lastWeek}
              currentSessionId={currentSessionId}
              onSelectSession={onSelectSession}
              onDeleteSession={onDeleteSession}
            />
            <DateGroup
              label="Older"
              sessions={groupedSessions.older}
              currentSessionId={currentSessionId}
              onSelectSession={onSelectSession}
              onDeleteSession={onDeleteSession}
            />
          </>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-8 px-4">
            No chat history yet. Start a conversation!
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
