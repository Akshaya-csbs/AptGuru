import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  image?: string;
}

const markdownComponents = {
  h1: ({ children }: any) => <h1 className="text-base sm:text-lg font-bold mt-2 mb-1 text-foreground">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-sm sm:text-base font-bold mt-2 mb-1 text-foreground">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-bold mt-2 mb-1 text-foreground">{children}</h3>,
  ul: ({ children }: any) => <ul className="list-disc list-inside my-1 space-y-0.5 pl-0">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside my-1 space-y-0.5 pl-0">{children}</ol>,
  li: ({ children }: any) => <li className="text-sm leading-relaxed">{children}</li>,
  code: ({ children, className }: any) => {
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
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-primary pl-2 sm:pl-3 my-2 bg-primary/5 py-2 pr-2 rounded-r-md text-sm">
      {children}
    </blockquote>
  ),
  strong: ({ children }: any) => <strong className="font-bold text-foreground">{children}</strong>,
  p: ({ children }: any) => <p className="my-1 leading-relaxed">{children}</p>,
  pre: ({ children }: any) => <pre className="overflow-x-auto my-2">{children}</pre>,
};

const ChatMessage = React.memo(({ role, content, isTyping, image }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
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

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-md border border-border/50"
        )}
      >
        {image && (
          <img 
            src={image} 
            alt="Uploaded question" 
            className="max-w-full rounded-lg mb-2 max-h-[150px] sm:max-h-[200px] object-contain"
          />
        )}

        {isTyping ? (
          <div className="flex gap-1 py-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot" style={{ animationDelay: "200ms" }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot" style={{ animationDelay: "400ms" }} />
          </div>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
