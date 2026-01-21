import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (will be replaced with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getSimulatedResponse(content),
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("mit") || lowerQuery.includes("stanford") || lowerQuery.includes("harvard")) {
      return `Great question about these prestigious institutions! Here's a quick comparison:

🎓 **MIT (Massachusetts Institute of Technology)**
- Location: Cambridge, MA, USA
- Tuition: ~$57,590/year
- Known for: Engineering, Computer Science, Physics
- QS Ranking 2024: #1

🎓 **Stanford University**
- Location: Stanford, CA, USA
- Tuition: ~$58,416/year
- Known for: Business, Computer Science, Engineering
- QS Ranking 2024: #5

🎓 **Harvard University**
- Location: Cambridge, MA, USA
- Tuition: ~$57,261/year
- Known for: Law, Business, Medicine
- QS Ranking 2024: #4

Would you like more details about any specific program or admission requirements?`;
    }
    
    if (lowerQuery.includes("top") || lowerQuery.includes("best") || lowerQuery.includes("ranking")) {
      return `Here are the **Top 10 Universities Globally (QS Rankings 2024)**:

1. 🥇 MIT (USA)
2. 🥈 University of Cambridge (UK)
3. 🥉 University of Oxford (UK)
4. Harvard University (USA)
5. Stanford University (USA)
6. Imperial College London (UK)
7. ETH Zurich (Switzerland)
8. National University of Singapore
9. UCL (UK)
10. UC Berkeley (USA)

Would you like details about any specific university or explore rankings by subject?`;
    }
    
    if (lowerQuery.includes("germany") || lowerQuery.includes("europe")) {
      return `**Top Universities in Germany for International Students:**

🇩🇪 **Technical University of Munich (TUM)**
- Tuition: FREE for most programs!
- Strong in: Engineering, Computer Science
- QS Ranking: #37

🇩🇪 **Ludwig Maximilian University (LMU Munich)**
- Tuition: FREE
- Strong in: Medicine, Natural Sciences, Law
- QS Ranking: #54

🇩🇪 **Heidelberg University**
- Tuition: ~€3,000/year for non-EU
- Oldest university in Germany (1386)
- QS Ranking: #87

💡 **Tip:** Most German public universities offer free tuition, even for international students!

Would you like information about admission requirements or visa procedures?`;
    }

    return `Thank you for your question about "${query}"!

I'm your AI college advisor, ready to help you explore educational opportunities worldwide. I can assist with:

📚 **Course Information** - Programs, curriculum, specializations
💰 **Fees & Scholarships** - Tuition costs and financial aid
📊 **Rankings & Reviews** - Global and subject-specific rankings
🎯 **Admissions** - Requirements, deadlines, and tips
🌍 **Location Insights** - Campus life, city info, visa requirements

Please ask a more specific question, and I'll provide detailed information from our comprehensive database of 10,000+ universities worldwide!`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {messages.length === 0 ? (
        <WelcomeScreen onQuickAction={handleSendMessage} />
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
            {isLoading && (
              <ChatMessage content="" role="assistant" isTyping />
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      )}

      <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
        <div className="container max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
