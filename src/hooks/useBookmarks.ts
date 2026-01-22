import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useBookmarks = (collegeId?: string) => {
    const { user } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user && collegeId) {
            checkBookmarkStatus();
        }
    }, [user, collegeId]);

    const checkBookmarkStatus = async () => {
        if (!collegeId || !user?.id) return;

        // Basic UUID validation to prevent 400 error
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(collegeId)) {
            setIsBookmarked(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("bookmarks")
                .select("id")
                .eq("user_id", user.id)
                .eq("college_id", collegeId)
                .maybeSingle();

            if (!error && data) {
                setIsBookmarked(true);
            } else {
                setIsBookmarked(false);
            }
        } catch (e) {
            console.error("Error checking bookmark status:", e);
            setIsBookmarked(false);
        }
    };

    const toggleBookmark = async () => {
        if (!user) {
            toast.error("Please login to bookmark colleges");
            return;
        }

        if (!collegeId) return;

        // Strict UUID validation to prevent 400 error from malformed IDs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(collegeId)) {
            toast.error("Invalid college data from AI. Please try re-searching for accurate information.");
            return;
        }

        setIsLoading(true);
        try {
            if (isBookmarked) {
                const { error } = await supabase
                    .from("bookmarks")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("college_id", collegeId);

                if (error) throw error;
                setIsBookmarked(false);
                toast.success("Bookmark removed");
            } else {
                const { error } = await supabase
                    .from("bookmarks")
                    .insert({
                        user_id: user.id,
                        college_id: collegeId,
                    });

                if (error) {
                    // 409 Conflict means it's already bookmarked (likely a race condition or sync issue)
                    if (error.code === "23505" || (error as any).status === 409) {
                        setIsBookmarked(true);
                        toast.success("College bookmarked");
                        return;
                    }
                    throw error;
                }
                setIsBookmarked(true);
                toast.success("College bookmarked");
            }

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ["saved-colleges"], exact: false });
        } catch (error: any) {
            // Ignore malformed ID errors if they somehow bypass the regex
            if (error?.code === "22P02") return;

            console.error("Bookmark Infrastructure Error:", error);

            if (error?.code === "23503") {
                toast.error("This institution's data is temporarily unavailable. Please try again in a moment.");
            } else {
                toast.error(error.message || "Failed to sync bookmark. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isBookmarked, isLoading, toggleBookmark };
};
