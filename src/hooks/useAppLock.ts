import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAppLock = () => {
    // Optimistic state management
    const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            // Cast to any to bypass missing table types for new app_settings table
            const { data, error } = await (supabase
                .from("app_settings" as any)
                .select("value")
                .eq("key", "app_unlocked")
                .maybeSingle() as any);

            if (error) throw error;

            // If row doesn't exist, we default to LOCKED (false)
            setIsUnlocked(data?.value === "true");
        } catch (e) {
            console.error("Error fetching app lock status:", e);
            setIsUnlocked(false); // Default to safe state
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        const channel = supabase
            .channel("app_lock_changes")
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to INSERT/UPDATE
                    schema: "public",
                    table: "app_settings",
                },
                (payload) => {
                    const newData = payload.new as any;
                    if (newData && newData.key === "app_unlocked") {
                        setIsUnlocked(newData.value === "true");
                        setIsLoading(false);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const toggleLock = async (unlocked: boolean) => {
        // 1. Optimistic Update (Immediate Feedback)
        setIsUnlocked(unlocked);

        try {
            const { error } = await (supabase
                .from("app_settings" as any)
                .upsert({
                    key: "app_unlocked",
                    value: String(unlocked),
                    updated_at: new Date().toISOString()
                })
                .select() as any); // Select to confirm

            if (error) throw error;
        } catch (error) {
            console.error("Failed to update lock:", error);
            toast.error("Failed to sync setting. Reverting...");
            // Revert state if server update fails
            setIsUnlocked(!unlocked);
            fetchStatus(); // Re-sync with truth
        }
    };

    return { isUnlocked, isLoading, toggleLock };
};
