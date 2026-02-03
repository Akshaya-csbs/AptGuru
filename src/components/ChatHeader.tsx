import { Bot, Sparkles } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground flex items-center gap-1.5">
            AI Assistant
            <Sparkles className="w-4 h-4 text-primary" />
          </h1>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
