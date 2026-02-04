import { Brain, Sparkles, History } from "lucide-react";
import ModeSelector from "./ModeSelector";
import TopicSelector from "./TopicSelector";
import ProgressBadge from "./ProgressBadge";
import { LearningMode } from "@/types/aptitude";
import { Button } from "./ui/button";

interface ChatHeaderProps {
  mode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  topic: string | undefined;
  onTopicChange: (topic: string | undefined) => void;
  showHistory?: boolean;
  onToggleHistory?: () => void;
}

const ChatHeader = ({
  mode,
  onModeChange,
  topic,
  onTopicChange,
  showHistory,
  onToggleHistory
}: ChatHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Top Row: Logo + Progress */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleHistory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleHistory}
              className={`flex-shrink-0 h-9 w-9 ${showHistory ? "bg-primary/10 text-primary" : ""}`}
              aria-label="Toggle chat history"
            >
              <History className="w-5 h-5" />
            </Button>
          )}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-card animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-foreground flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base">
              <span className="truncate">AptGuru</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your AI Aptitude Tutor</p>
          </div>
        </div>
        
        <ProgressBadge />
      </div>

      {/* Mode and Topic Row - Side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="sm:flex-1">
          <ModeSelector mode={mode} onModeChange={onModeChange} />
        </div>
        <div className="sm:flex-1">
          <TopicSelector topic={topic} onTopicChange={onTopicChange} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
