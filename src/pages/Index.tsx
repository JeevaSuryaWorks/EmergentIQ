import { Header } from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ChatWindow />
    </div>
  );
};

export default Index;
