import { Calculator, BookOpen, Timer, Baby } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningMode } from "@/types/aptitude";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  mode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
}

const modes: { value: LearningMode; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'solve', label: 'Solve', icon: <Calculator className="w-4 h-4" />, description: 'Step-by-step solutions' },
  { value: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" />, description: 'Concept explanations' },
  { value: 'quiz', label: 'Quiz', icon: <Timer className="w-4 h-4" />, description: 'Test yourself' },
  { value: 'eli10', label: 'ELI10', icon: <Baby className="w-4 h-4" />, description: 'Super simple' },
];

const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as LearningMode)} className="w-full">
      <TabsList className="grid grid-cols-4 w-full bg-secondary/50 p-1 h-auto">
        {modes.map((m) => (
          <TabsTrigger
            key={m.value}
            value={m.value}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-1 text-xs",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "transition-all duration-200"
            )}
          >
            {m.icon}
            <span className="font-medium">{m.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ModeSelector;
