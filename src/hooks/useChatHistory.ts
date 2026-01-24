import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatSession {
    session_id: string;
    last_message: string;
    session_name?: string | null;
    created_at: string;
}

// Global state to sync across multiple hook instances (Sidebar and Dialog)
let globalSessions: ChatSession[] = [];
let globalIsLoading = false;
let isFetchingPromise: Promise<void> | null = null;
const listeners = new Set<(data: { sessions: ChatSession[], isLoading: boolean }) => void>();

const notifyListeners = () => {
    listeners.forEach(listener => listener({ sessions: [...globalSessions], isLoading: globalIsLoading }));
};

export const useChatHistory = () => {
    const { user } = useAuth();
    const [state, setState] = useState({ sessions: globalSessions, isLoading: globalIsLoading });

    useEffect(() => {
        const listener = (newState: { sessions: ChatSession[], isLoading: boolean }) => {
            setState(newState);
        };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const fetchSessions = async (force = false) => {
        if (!user) return;

        // Return existing promise if fetching to prevent duplicate concurrent requests
        if (isFetchingPromise && !force) return isFetchingPromise;
        if (globalSessions.length > 0 && !force) return;

        globalIsLoading = true;
        notifyListeners();

        isFetchingPromise = (async () => {
            try {
                // Fetching only required columns to reduce payload size
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
                            last_message: row.message.slice(0, 100), // Only take first 100 chars for list snippet
                            session_name: row.session_name,
                            created_at: row.created_at
                        });
                    }
                });

                globalSessions = Array.from(sessionMap.values());
            } catch (error) {
                console.error("Error fetching chat history:", error);
            } finally {
                globalIsLoading = false;
                isFetchingPromise = null;
                notifyListeners();
            }
        })();

        return isFetchingPromise;
    };

    const renameSession = async (sessionId: string, newName: string) => {
        const previousSessions = [...globalSessions];

        // Optimistic UI update
        globalSessions = globalSessions.map(s =>
            s.session_id === sessionId ? { ...s, session_name: newName } : s
        );
        notifyListeners();

        try {
            const { error } = await supabase
                .from("chat_history")
                .update({ session_name: newName } as any)
                .eq("session_id", sessionId);

            if (error) throw error;

            // Silent background refresh to ensure sync, but don't block
            fetchSessions(true);
        } catch (error) {
            console.error("Error renaming session:", error);
            // Rollback on error
            globalSessions = previousSessions;
            notifyListeners();
            throw error;
        }
    };

    const deleteSession = async (sessionId: string) => {
        const previousSessions = [...globalSessions];

        // Optimistic UI update
        globalSessions = globalSessions.filter(s => s.session_id !== sessionId);
        notifyListeners();

        try {
            const { error } = await supabase
                .from("chat_history")
                .delete()
                .eq("session_id", sessionId);

            if (error) throw error;

            fetchSessions(true);
        } catch (error) {
            console.error("Error deleting session:", error);
            globalSessions = previousSessions;
            notifyListeners();
            throw error;
        }
    };

    useEffect(() => {
        if (user) {
            fetchSessions();
        } else {
            globalSessions = [];
            notifyListeners();
        }
    }, [user]);

    return {
        sessions: state.sessions,
        isLoading: state.isLoading,
        refreshSessions: () => fetchSessions(true),
        renameSession,
        deleteSession
    };
};
