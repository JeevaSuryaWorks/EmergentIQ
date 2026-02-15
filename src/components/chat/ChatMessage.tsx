import { cn } from "@/lib/utils";
import { GraduationCap, User, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "@/lib/markdown";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";


const MentionedCollege = ({ name, id }: { name: string; id: string }) => {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmarks(id);
  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      className="h-8 gap-2 text-xs"
      onClick={toggleBookmark}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="w-3 h-3" />
      ) : (
        <Bookmark className="w-3 h-3" />
      )}
      {isBookmarked ? "Saved" : `Save ${name}`}
    </Button>
  );
};

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
}

export const ChatMessage = ({ content, role, isTyping }: ChatMessageProps) => {
  const isUser = role === "user";
  const { theme } = useTheme();
  const isNaruto = theme === "light";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up transition-all duration-500",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500",
          isUser
            ? isNaruto ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-primary text-primary-foreground"
            : isNaruto ? "bg-red-950/40 text-white border border-red-500/20" : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <span className="text-[10px] font-black tracking-tighter text-white">JS</span>
        )}
      </div>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 transition-all duration-500",
          isUser
            ? isNaruto
              ? "bg-red-600 text-white rounded-br-none shadow-lg shadow-red-600/10"
              : "bg-chat-user text-chat-user-foreground rounded-br-md"
            : isNaruto
              ? "bg-red-950/20 text-red-100 border border-red-900/30 rounded-bl-none backdrop-blur-md"
              : "bg-chat-bot text-chat-bot-foreground border border-chat-bot-border rounded-bl-md shadow-soft"
        )}
      >

        {isTyping ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing" />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-typing [animation-delay:0.4s]" />
          </div>
        ) : isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-4">
            <MarkdownRenderer content={content.replace(/\[College:\s*([\s\S]*?)\s*\|\s*ID:\s*([\s\S]*?)\]/gi, "**$1**")} />
            {(() => {
              const collegeRegex = /\[College:\s*([\s\S]*?)\s*\|\s*ID:\s*([\s\S]*?)\]/gi;
              const matches = Array.from(content.matchAll(collegeRegex));
              if (matches.length > 0) {
                // Deduplicate by ID
                const uniqueTable = new Map();
                matches.forEach(m => {
                  const id = m[2].trim();
                  if (!uniqueTable.has(id)) {
                    uniqueTable.set(id, { name: m[1].trim(), id });
                  }
                });

                const uniqueColleges = Array.from(uniqueTable.values());

                return (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5 mt-4">
                    {uniqueColleges.map((college, i) => (
                      <MentionedCollege key={college.id + i} name={college.name} id={college.id} />
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
