import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOPIC_CATEGORIES } from "@/types/aptitude";

interface TopicSelectorProps {
  topic: string | undefined;
  onTopicChange: (topic: string | undefined) => void;
}

const TopicSelector = ({ topic, onTopicChange }: TopicSelectorProps) => {
  return (
    <Select value={topic || "all"} onValueChange={(v) => onTopicChange(v === "all" ? undefined : v)}>
      <SelectTrigger className="w-full bg-secondary/50 border-border/50 text-sm h-9">
        <SelectValue placeholder="All Topics" />
      </SelectTrigger>
      <SelectContent className="max-h-[50vh] sm:max-h-[400px]">
        <SelectItem value="all">All Topics</SelectItem>
        {TOPIC_CATEGORIES.map((category) => (
          <SelectGroup key={category.id}>
            <SelectLabel className="flex items-center gap-2 text-muted-foreground sticky top-0 bg-popover py-2">
              <span>{category.icon}</span>
              {category.name}
            </SelectLabel>
            {category.topics.map((t) => (
              <SelectItem key={t} value={t} className="pl-6 text-sm">
                {t}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TopicSelector;
