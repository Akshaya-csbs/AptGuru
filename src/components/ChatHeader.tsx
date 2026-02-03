import { Brain, Sparkles } from "lucide-react";
import ModeSelector from "./ModeSelector";
import TopicSelector from "./TopicSelector";
import ProgressBadge from "./ProgressBadge";
import { LearningMode } from "@/types/aptitude";

interface ChatHeaderProps {
  mode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  topic: string | undefined;
  onTopicChange: (topic: string | undefined) => void;
}

const ChatHeader = ({ mode, onModeChange, topic, onTopicChange }: ChatHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Top Row: Logo + Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-foreground flex items-center gap-1.5">
              AptitudeGuru
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">Your AI Aptitude Tutor</p>
          </div>
        </div>
        
        <ProgressBadge />
      </div>

      {/* Mode Selector */}
      <ModeSelector mode={mode} onModeChange={onModeChange} />

      {/* Topic Selector */}
      <TopicSelector topic={topic} onTopicChange={onTopicChange} />
    </div>
  );
};

export default ChatHeader;
