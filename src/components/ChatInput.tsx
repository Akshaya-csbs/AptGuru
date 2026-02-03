import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-2 bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 bg-transparent border-0 resize-none px-3 py-2",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-0",
            "min-h-[44px] max-h-[200px] text-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{
            height: "auto",
            overflow: message.split("\n").length > 1 ? "auto" : "hidden",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl",
            "flex items-center justify-center",
            "bg-primary text-primary-foreground",
            "transition-all duration-200",
            "hover:scale-105 hover:shadow-lg",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
            message.trim() && !disabled && "animate-pulse-glow"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
