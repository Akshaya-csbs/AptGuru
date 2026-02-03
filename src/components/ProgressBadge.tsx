import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressBadge = () => {
  const { progress, getLevelInfo, getLevelProgress } = useProgress();
  const levelInfo = getLevelInfo();
  const levelProgress = getLevelProgress();

  return (
    <div className="flex items-center gap-3">
      {/* Streak */}
      {progress.streak > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-bold">{progress.streak}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{progress.streak} day streak! 🔥</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Level Badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "px-2 py-0.5 text-xs font-bold border-0",
                  levelInfo.id === 'beginner' && "bg-green-500/20 text-green-400",
                  levelInfo.id === 'intermediate' && "bg-blue-500/20 text-blue-400",
                  levelInfo.id === 'pro' && "bg-purple-500/20 text-purple-400",
                  levelInfo.id === 'master' && "bg-yellow-500/20 text-yellow-400"
                )}
              >
                <Trophy className="w-3 h-3 mr-1" />
                {levelInfo.title}
              </Badge>
              <div className="hidden sm:flex flex-col gap-0.5 min-w-[60px]">
                <Progress value={levelProgress} className="h-1.5" />
                <span className="text-[10px] text-muted-foreground text-center">
                  {progress.xp} XP
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-bold">{levelInfo.title} Level</p>
              <p className="text-muted-foreground">
                {progress.xp} / {levelInfo.maxXp === Infinity ? '∞' : levelInfo.maxXp + 1} XP
              </p>
              <p className="text-muted-foreground">
                {progress.questionsAnswered} questions solved
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProgressBadge;
