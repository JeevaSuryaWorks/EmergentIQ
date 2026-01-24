import { GraduationCap, Search, BarChart3, Globe } from "lucide-react";
import { QuickActions } from "./QuickActions";

interface WelcomeScreenProps {
  onQuickAction: (query: string) => void;
  userContext?: {
    locations?: string[];
    interests?: string[];
  };
}

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find any college worldwide with intelligent search",
  },
  {
    icon: BarChart3,
    title: "Compare & Rank",
    description: "Side-by-side comparisons and latest rankings",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Information on universities from 100+ countries",
  },
];

export const WelcomeScreen = ({ onQuickAction, userContext }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-8">
      <div className="text-center max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Hero Icon */}
        <div className="relative inline-flex">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center animate-fade-in">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-accent flex items-center justify-center animate-slide-up">
            <Globe className="w-3 h-3 md:w-4 md:h-4 text-accent-foreground" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2 md:space-y-3 animate-fade-in [animation-delay:0.1s]">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight">
            Welcome to{" "}
            <span className="gradient-text">EmergentIQ</span>
          </h2>
          <p className="text-sm md:text-lg text-white/60 max-w-md mx-auto px-2">
            I'm Emily, your AI advisor. From global rankings to fee comparisons, I'm here to build your academic future.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 animate-fade-in [animation-delay:0.3s]">
          <p className="text-sm text-white/40">
            Try these popular queries
          </p>
          <QuickActions onAction={onQuickAction} userContext={userContext} />
        </div>
      </div>
    </div>
  );
};
