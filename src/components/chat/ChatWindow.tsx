import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";

export const ChatWindow = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {messages.length === 0 ? (
        <WelcomeScreen onQuickAction={sendMessage} />
      ) : (
        <ScrollArea className="flex-1 px-4">
          <div className="container max-w-3xl mx-auto py-6 space-y-6">
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

      <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
        <div className="container max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
