import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-end gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-elevated transition-all duration-300",
          message.trim() && "chat-input-glow"
        )}
      >
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any college, course, or admission..."
            className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground p-2"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          size="icon"
          className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? (
            <Sparkles className="w-5 h-5 animate-pulse-soft" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        AI-powered answers about colleges worldwide. Press Enter to send.
      </p>
    </div>
  );
};
