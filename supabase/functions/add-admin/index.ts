import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Check if the requester is an admin
        const authHeader = req.headers.get("Authorization")!;
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);

        const isAdmin = roles?.some((r) => r.role === "admin");
        if (!isAdmin) {
            return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Parse request body
        const { email, password, fullName } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Create user in Auth
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName },
        });

        if (createError) {
            return new Response(JSON.stringify({ error: createError.message }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 4. Assign admin role
        const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: "admin" })
            .eq("user_id", newUser.user.id);

        // Note: handle_new_user trigger already creates a 'user' role entry.
        // We update it to 'admin'.
        // If update fails (e.g. race condition), we try to insert.
        if (roleError) {
            await supabase.from("user_roles").upsert({
                user_id: newUser.user.id,
                role: "admin"
            }, { onConflict: 'user_id, role' });
        }

        return new Response(JSON.stringify({ message: "Admin created successfully", user: newUser.user }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
