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
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "flex items-center gap-2 p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-500",
          "focus-within:border-primary/50 focus-within:bg-zinc-900/95",
          message.trim() && "shadow-primary/10 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]"
        )}
      >
        <div className="flex-1 flex items-center min-h-[44px] md:min-h-[52px] pl-3 md:pl-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search universities, careers..."
            className="w-full resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/20 p-0 py-2 md:py-2.5 font-medium text-sm md:text-[15px] max-h-[150px] md:max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          size="icon"
          className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-20 shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </Button>
      </div>

      <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2 md:mt-3 px-4">
        AI-powered answers about colleges worldwide.
      </p>
    </div>
  );
};
