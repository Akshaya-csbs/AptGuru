import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  image?: string;
}

const ChatMessage = ({ role, content, isTyping, image }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-secondary border border-border"
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        ) : (
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-md border border-border/50"
        )}
      >
        {/* Image if present */}
        {image && (
          <img 
            src={image} 
            alt="Uploaded question" 
            className="max-w-full rounded-lg mb-2 max-h-[150px] sm:max-h-[200px] object-contain"
          />
        )}

        {isTyping ? (
          <div className="flex gap-1 py-1">
            <span
              className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot"
              style={{ animationDelay: "200ms" }}
            />
            <span
              className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Style headings
                h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold mt-2 mb-1 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold mt-2 mb-1 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1 text-foreground">{children}</h3>,
                // Style lists
                ul: ({ children }) => <ul className="list-disc list-inside my-1 space-y-0.5 pl-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside my-1 space-y-0.5 pl-0">{children}</ol>,
                li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                // Style code
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-secondary/50 px-1.5 py-0.5 rounded text-xs font-mono text-primary break-words">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-secondary/50 p-2 sm:p-3 rounded-md text-xs font-mono my-2 overflow-x-auto whitespace-pre-wrap break-words">
                      {children}
                    </code>
                  );
                },
                // Style blockquotes (shortcuts)
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-2 sm:pl-3 my-2 bg-primary/5 py-2 pr-2 rounded-r-md text-sm">
                    {children}
                  </blockquote>
                ),
                // Style bold
                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                // Style paragraphs
                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                // Style pre blocks
                pre: ({ children }) => <pre className="overflow-x-auto my-2">{children}</pre>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
