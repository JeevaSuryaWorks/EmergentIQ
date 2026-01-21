import { cn } from "@/lib/utils";
import { GraduationCap, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
}

export const ChatMessage = ({ content, role, isTyping }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <GraduationCap className="w-4 h-4" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-bot text-chat-bot-foreground border border-chat-bot-border rounded-bl-md shadow-soft"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing" />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing [animation-delay:0.4s]" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
};
