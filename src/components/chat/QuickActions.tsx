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
    locations?: (string | { label: string })[];
    interests?: string[];
  };
}

const quickActions = [
  {
    icon: GraduationCap,
    label: "Top Institutions",
    query: "List the top 10 engineering and medical colleges in India (IITs, AIIMS, NITs) for 2025.",
  },
  {
    icon: DollarSign,
    label: "Fee Estimates",
    query: "What are the average annual tuition fees in INR (₹) for private vs govt medical colleges in India?",
  },
  {
    icon: BookOpen,
    label: "Degree info",
    query: "How does the UG/PG degree structure work in the Indian education system compared to global standards?",
  },
  {
    icon: BarChart3,
    label: "Entrance Exams",
    query: "Provide a calendar and difficulty analysis for major Indian entrance exams: JEE, NEET, and CUET.",
  },
  {
    icon: MapPin,
    label: "Regional Hubs",
    query: "What are the best academic cities in India? Focus on Bangalore, Chennai, Delhi, and Mumbai.",
  },
  {
    icon: Scale,
    label: "IIT vs BITS",
    query: "Compare IIT Bombay and BITS Pilani for Computer Science in terms of ROI and campus life in INR.",
  },
];

export const QuickActions = ({ onAction, userContext }: QuickActionsProps) => {
  const handleAction = (query: string, label: string) => {
    let personalizedQuery = query;

    // Inject location context or default to India-First
    if (userContext?.locations?.length) {
      const locationData = userContext.locations[0];
      const fullLocationLabel = typeof locationData === 'string' ? locationData : locationData.label;
      const region = fullLocationLabel.split(',')[0].trim();

      if (label === "Regional Hubs") {
        personalizedQuery = `What are the best academic centers in ${region}? Focus on educational ROI in INR.`;
      } else {
        personalizedQuery += ` with focus on ${region}`;
      }
    }

    // Default grounding logic for India-first context if no specific context exists
    if (!userContext?.locations?.length) {
      personalizedQuery += " (Assume I am an Indian student, prioritize India-based universities and use INR ₹ for all costs)";
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
