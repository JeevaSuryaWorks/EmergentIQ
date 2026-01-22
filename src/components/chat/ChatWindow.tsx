import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";


import { useSearchParams } from "react-router-dom";

export const ChatWindow = () => {
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get("session");
  const { messages, isLoading, sendMessage, loadSession, clearMessages } = useChat(sessionIdParam || undefined);
  const { theme } = useTheme();
  const isNaruto = theme === "light";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionIdParam) {
      loadSession(sessionIdParam);
    } else {
      clearMessages();
    }
  }, [sessionIdParam]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className={cn(
      "flex-1 relative flex flex-col h-full overflow-hidden transition-colors duration-700",
      isNaruto ? "bg-[#050505]" : "bg-black"
    )}>
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        {messages.length === 0 ? (
          <WelcomeScreen onQuickAction={sendMessage} />
        ) : (
          <ScrollArea className="h-full px-4">
            <div className="container max-w-3xl mx-auto pt-10 pb-40 space-y-8">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  role={message.role}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <ChatMessage content="" role="assistant" isTyping />
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Fixed/Anchored Input Area */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-6 z-10 transition-all duration-700",
        isNaruto
          ? "bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"
          : "bg-gradient-to-t from-black via-black/80 to-transparent"
      )}>
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

