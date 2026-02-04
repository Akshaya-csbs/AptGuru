import { MessageSquare, Trash2 } from "lucide-react";
import { ChatSession } from "@/types/aptitude";
import { cn } from "@/lib/utils";

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const ChatHistoryItem = ({ session, isActive, onClick, onDelete }: ChatHistoryItemProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/50 text-foreground"
      )}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{session.title}</p>
        <p className="text-xs text-muted-foreground capitalize">{session.mode} Mode</p>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
        aria-label="Delete chat"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ChatHistoryItem;
