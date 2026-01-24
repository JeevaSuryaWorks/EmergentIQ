import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export const useChat = (initialSessionId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId || (() => crypto.randomUUID()));
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSession = useCallback(async (id: string) => {
    setSessionId(id);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .select("message, role, created_at")
        .eq("session_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = data.map((row: any) => ({
        id: crypto.randomUUID(),
        content: row.message,
        role: row.role as "user" | "assistant",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading session:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Use a fresh abort controller for each request
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {
        console.debug("Silent abort failed:", e);
      }
    }
    abortControllerRef.current = new AbortController();

    try {
      // 1. Get current session and user metadata for personalization
      const { data: { user } } = await supabase.auth.getUser();
      const onboardingData = user?.user_metadata?.onboarding_data;

      const GLOBAL_DEFAULT_CONTEXT = `[Global Baseline Context]
      User Origin: India
      Preferred Destinations: India (Primary), global (Secondary)
      Financial Baseline: INR (₹) - All costs and budgets must be in Lakhs/Crores per annum
      Education System: Indian (UG/PG cycles, 10+2+3/4 structure)`;

      // Construct personalization context string
      let personalizationContext = "";
      if (onboardingData) {
        const locations = onboardingData.locations?.map((l: any) => l.label).join(", ") || "India, Global";
        const interests = Array.isArray(onboardingData.interests) ? onboardingData.interests.join(", ") : "General academics";
        const budgetLabel = onboardingData.budget?.label || "Balanced (INR-focused)";
        const degreeLevels = onboardingData.degreeLevels?.join(", ") || "Not specified";
        const studyModes = onboardingData.studyModes?.join(", ") || "On-campus";

        personalizationContext = `[Personalization Context]
        Target Destinations: ${locations}
        Academic Focus: ${interests}
        Degree Level: ${degreeLevels}
        Financial Strategy: ${budgetLabel} (Base Currency: INR ₹)
        Study Mode: ${studyModes}
        Language: ${onboardingData.languagePreference || "English"}
        ${GLOBAL_DEFAULT_CONTEXT}`;
      } else {
        personalizationContext = GLOBAL_DEFAULT_CONTEXT;
      }

      // 2. Prepare the payload (including previous messages)
      const currentMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      // 3. Invoke function with signal and user context
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: currentMessages,
          sessionId,
          userId: user?.id,
          userContext: personalizationContext, // New field for personalization
        },
        signal: abortControllerRef.current.signal,
      });

      if (error) {
        console.error("Supabase edge function error:", error);
        // Try to parse the response body if it exists on the error object (sometimes it does in the custom error types)
        // or re-throw with more context
        throw new Error(error.message || "AI backend failed to respond");
      }

      if (!data?.content) {
        throw new Error("No response content from AI service");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.content,
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        console.debug("Chat request cancelled by user or internal signal");
        return; // Exit silently
      } else {
        console.error("Chat error details:", error);
        // If it's a FunctionsHttpError, it might have context
        if (error.context && typeof error.context.json === 'function') {
          error.context.json().then((details: any) => {
            console.error("Edge Function Error Details:", details);
            toast.error(`Error: ${details.error || error.message}`);
          }).catch(() => {
            toast.error(error.message || "Failed to get response. Please try again.");
          });
        } else {
          toast.error(error.message || "Failed to get response. Please try again.");
        }
      }
    } finally {
      // Clear controller if it matches the current one (meaning we finished)
      // Note: If we started a NEW request, current would be different, so don't null it.
      // But here we can't easily check if it's "ours".
      // However, since we are setting isLoading(false), we effectively "end" the active state.
      // We should only null it if we are sure we are the active one.
      // But cleaner: Just let it persist or null it.
      setIsLoading(false);
    }
  }, [messages, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    cancelRequest,
    loadSession,
    setSessionId,
    sessionId,
  };
};
