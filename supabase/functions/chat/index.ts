import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert AI college advisor with comprehensive knowledge about universities and colleges worldwide. Your role is to help students find the right educational institutions.

IMPORTANT GUIDELINES:
1. Provide accurate, helpful information about colleges, courses, fees, rankings, and admissions
2. When you're not 100% certain about specific data (exact fees, rankings), say "approximately" or "based on available data"
3. Be concise but thorough - use bullet points and clear formatting
4. If asked about comparisons, provide structured side-by-side analysis
5. Always encourage users to verify critical information on official college websites
6. Use emojis sparingly to make responses more engaging (🎓 📚 🌍 💰)
7. For fees, always mention the currency and clarify if it's per year/semester
8. Mention scholarship opportunities when relevant

You have access to a database of colleges, but if specific data isn't available, provide general guidance based on your knowledge while being transparent about uncertainty.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Try to find relevant college data from the database
    let dbContext = "";
    const lowerMessage = userMessage.toLowerCase();
    
    // Search for colleges mentioned in the query
    const { data: colleges } = await supabase
      .from("colleges")
      .select(`
        *,
        rankings (*),
        fees (*),
        admissions (*)
      `)
      .or(`name.ilike.%${userMessage}%,country.ilike.%${userMessage}%`)
      .limit(5);

    if (colleges && colleges.length > 0) {
      dbContext = `\n\nRELEVANT DATABASE DATA:\n${JSON.stringify(colleges, null, 2)}\n\nUse this verified data in your response when applicable.`;
    }

    // Check cache for similar queries
    const queryHash = await hashQuery(userMessage);
    const { data: cached } = await supabase
      .from("ai_response_cache")
      .select("response")
      .eq("query_hash", queryHash)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      // Return cached response
      return new Response(JSON.stringify({ content: cached.response, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call AI gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + dbContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store user message in chat history
    if (sessionId) {
      await supabase.from("chat_history").insert({
        session_id: sessionId,
        user_id: userId || null,
        message: userMessage,
        role: "user",
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function hashQuery(query: string): Promise<string> {
  const normalized = query.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
