import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  DollarSign,
  BarChart3,
  MapPin,
  BookOpen,
  Scale
} from "lucide-react";

interface QuickActionsProps {
  onAction: (query: string) => void;
  userContext?: {
    locations?: string[];
    interests?: string[];
  };
}

const quickActions = [
  {
    icon: GraduationCap,
    label: "Top Universities",
    query: "What are the top 10 universities in the world for 2025?",
  },
  {
    icon: DollarSign,
    label: "Fee Comparison",
    query: "Compare tuition fees of MIT, Stanford, and Harvard for Computer Science",
  },
  {
    icon: BookOpen,
    label: "Courses",
    query: "What courses does Oxford University offer?",
  },
  {
    icon: BarChart3,
    label: "Rankings",
    query: "Show me the QS World University Rankings for Engineering",
  },
  {
    icon: MapPin,
    label: "By Location",
    query: "What are the best universities in Germany for international students?",
  },
  {
    icon: Scale,
    label: "Compare",
    query: "Compare MIT and Stanford for Computer Science program",
  },
];

export const QuickActions = ({ onAction, userContext }: QuickActionsProps) => {
  const handleAction = (query: string, label: string) => {
    let personalizedQuery = query;

    // Inject location context for relevant actions
    if (userContext?.locations?.length && (label === "By Location" || label === "Top Universities" || label === "Rankings")) {
      const location = userContext.locations[0];
      personalizedQuery += ` in ${location}`;
    }

    // Inject interest context
    if (userContext?.interests?.length && (label === "Courses" || label === "Top Universities")) {
      const focus = userContext.interests[0];
      personalizedQuery += ` for ${focus}`;
    }

    onAction(personalizedQuery);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          onClick={() => handleAction(action.query, action.label)}
          className="gap-2 bg-card/50 hover:bg-card hover:shadow-soft border-border/50 text-foreground transition-all duration-200 hover:scale-[1.02]"
        >
          <action.icon className="w-4 h-4 text-accent" />
          <span className="text-sm">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};
