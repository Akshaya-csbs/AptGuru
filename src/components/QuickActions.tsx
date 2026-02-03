import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle, Zap } from "lucide-react";
import { TOPIC_CATEGORIES } from "@/types/aptitude";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

const QUICK_TOPICS = [
  { topic: 'Percentages', emoji: '📊' },
  { topic: 'Time & Work', emoji: '⏰' },
  { topic: 'Probability', emoji: '🎲' },
  { topic: 'Puzzles', emoji: '🧩' },
];

const QuickActions = ({ onAction, disabled }: QuickActionsProps) => {
  const { isDailyChallengeAvailable } = useProgress();
  const dailyAvailable = isDailyChallengeAvailable();

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {/* Daily Challenge */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction("Give me today's daily challenge! I want to earn bonus XP.")}
        disabled={disabled || !dailyAvailable}
        className={cn(
          "text-xs gap-1.5 border-primary/50 hover:bg-primary/10",
          dailyAvailable && "animate-pulse"
        )}
      >
        <Zap className="w-3.5 h-3.5 text-yellow-400" />
        Daily Challenge
        {dailyAvailable && <span className="text-yellow-400 text-[10px]">+50 XP</span>}
      </Button>

      {/* Random Question */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction("Give me a random aptitude question to solve!")}
        disabled={disabled}
        className="text-xs gap-1.5"
      >
        <Shuffle className="w-3.5 h-3.5" />
        Random
      </Button>

      {/* Quick Topics */}
      {QUICK_TOPICS.map(({ topic, emoji }) => (
        <Button
          key={topic}
          variant="ghost"
          size="sm"
          onClick={() => onAction(`Teach me about ${topic} with an example`)}
          disabled={disabled}
          className="text-xs gap-1"
        >
          <span>{emoji}</span>
          {topic}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
