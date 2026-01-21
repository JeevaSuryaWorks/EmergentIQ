import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatWindow } from "@/components/chat/ChatWindow";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader />
      <ChatWindow />
    </div>
  );
};

export default Index;
