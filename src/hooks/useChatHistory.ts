import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatSession {
    session_id: string;
    last_message: string;
    session_name?: string | null;
    created_at: string;
}

export const useChatHistory = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSessions = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("chat_history")
                .select("session_id, message, session_name, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const sessionMap = new Map<string, ChatSession>();
            data?.forEach((row: any) => {
                if (!sessionMap.has(row.session_id)) {
                    sessionMap.set(row.session_id, {
                        session_id: row.session_id,
                        last_message: row.message,
                        session_name: row.session_name,
                        created_at: row.created_at
                    });
                }
            });

            setSessions(Array.from(sessionMap.values()));
        } catch (error) {
            console.error("Error fetching chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renameSession = async (sessionId: string, newName: string) => {
        try {
            const { error } = await supabase
                .from("chat_history")
                .update({ session_name: newName } as any)
                .eq("session_id", sessionId);

            if (error) throw error;
            await fetchSessions();
        } catch (error) {
            console.error("Error renaming session:", error);
            throw error;
        }
    };

    const deleteSession = async (sessionId: string) => {
        try {
            const { error } = await supabase
                .from("chat_history")
                .delete()
                .eq("session_id", sessionId);

            if (error) throw error;
            await fetchSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [user]);

    return { sessions, isLoading, refreshSessions: fetchSessions, renameSession, deleteSession };
};
