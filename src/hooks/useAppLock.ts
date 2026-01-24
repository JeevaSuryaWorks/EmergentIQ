import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAppLock = () => {
    const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null); // null = loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        const checkStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from("app_settings")
                    .select("value")
                    .eq("key", "app_unlocked")
                    .single();

                if (error || !data) {
                    console.error("Error fetching app lock status:", error);
                    // Default to locked if error, for safety
                    setIsUnlocked(false);
                } else {
                    setIsUnlocked(data.value === "true");
                }
            } catch (e) {
                setIsUnlocked(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();

        // Realtime subscription
        const channel = supabase
            .channel("app_lock_changes")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "app_settings",
                    filter: "key=eq.app_unlocked",
                },
                (payload) => {
                    if (payload.new && payload.new.value) {
                        setIsUnlocked(payload.new.value === "true");
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const toggleLock = async (unlocked: boolean) => {
        const { error } = await supabase
            .from("app_settings")
            .update({ value: String(unlocked), updated_at: new Date().toISOString() })
            .eq("key", "app_unlocked");

        if (error) throw error;
    };

    return { isUnlocked, isLoading, toggleLock };
};
