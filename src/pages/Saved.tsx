import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Loader2, Bookmark } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Saved = () => {
    const { user } = useAuth();

    const { data: savedColleges, isLoading } = useQuery({
        queryKey: ["saved-colleges", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bookmarks")
                .select(`
          *,
          college:colleges(*)
        `)
                .eq("user_id", user?.id);

            if (error) throw error;
            const colleges = data
                .map((item: any) => item.college)
                .filter(Boolean);

            // Deduplicate by ID just in case
            return Array.from(new Map(colleges.map(c => [c.id, c])).values());
        },
        enabled: !!user,
    });

    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-8 md:p-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Bookmark className="w-7 h-7 text-primary shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Saved Colleges</h1>
                        <p className="text-white/40 text-sm">Your curated list of institutions for future reference.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-white/40 animate-pulse">Syncing your collection...</p>
                    </div>
                ) : savedColleges?.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Bookmark className="w-10 h-10 text-white/10" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-2">Workspace Empty</p>
                        <p className="text-white/30 max-w-xs mx-auto">
                            Go to the Compare tool or University search to start building your future.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedColleges?.map((college) => (
                            <CollegeCard key={college.id} college={college} />
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default Saved;
