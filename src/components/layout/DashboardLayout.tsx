import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";


export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();
    const isNaruto = theme === "light";

    return (
        <SidebarProvider>
            <div className={cn(
                "flex min-h-screen w-full transition-colors duration-700",
                isNaruto ? "bg-[#050505] text-white" : "bg-black text-white"
            )}>
                <AppSidebar />
                <main className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Top Bar for Mobile/Trigger */}
                    <header className={cn(
                        "h-16 flex items-center px-4 border-b sticky top-0 z-40 backdrop-blur-md transition-colors",
                        isNaruto ? "bg-[#050505]/50 border-red-900/20" : "bg-black/50 border-white/5"
                    )}>
                        <SidebarTrigger className={cn(
                            "transition-colors",
                            isNaruto ? "text-red-500 hover:bg-red-500/10" : "text-white hover:bg-white/10"
                        )} />
                    </header>


                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </SidebarProvider>
    );
};
