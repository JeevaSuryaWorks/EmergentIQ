import { GraduationCap, Search, BarChart3, Globe } from "lucide-react";
import { QuickActions } from "./QuickActions";

interface WelcomeScreenProps {
  onQuickAction: (query: string) => void;
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

export const WelcomeScreen = ({ onQuickAction }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* Hero Icon */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-fade-in">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-accent flex items-center justify-center animate-slide-up">
            <Globe className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3 animate-fade-in [animation-delay:0.1s]">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Welcome to{" "}
            <span className="gradient-text">College AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your intelligent guide to universities worldwide. Ask anything about colleges, courses, fees, and admissions.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-fade-in [animation-delay:0.2s]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-4 rounded-xl bg-card/50 border border-border/50 hover:shadow-soft transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 mx-auto">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 animate-fade-in [animation-delay:0.3s]">
          <p className="text-sm text-muted-foreground">
            Try these popular queries
          </p>
          <QuickActions onAction={onQuickAction} />
        </div>
      </div>
    </div>
  );
};
