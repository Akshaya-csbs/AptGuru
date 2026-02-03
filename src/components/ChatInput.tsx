import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Send, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((message.trim() || image) && !disabled) {
      onSend(message.trim(), image || undefined);
      setMessage("");
      setImage(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  return (
    <div className="relative">
      {/* Image Preview */}
      {image && (
        <div className="mb-2 relative inline-block">
          <img 
            src={image} 
            alt="Upload preview" 
            className="max-h-24 rounded-lg border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
            onClick={() => setImage(null)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2 p-2 bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg">
        {/* Image Upload Button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Image className="w-5 h-5 text-muted-foreground" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Ask a question or paste an image..."
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

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && !image) || disabled}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl",
            "flex items-center justify-center",
            "bg-primary text-primary-foreground",
            "transition-all duration-200",
            "hover:scale-105 hover:shadow-lg",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
            (message.trim() || image) && !disabled && "animate-pulse-glow"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
