import { GraduationCap, Globe } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                <Globe className="w-2.5 h-2.5 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">
                College AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Your global education guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
