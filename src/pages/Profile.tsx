import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, CheckCircle, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const onboardingData = user?.user_metadata?.onboarding_data;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-950/50 border-white/5 p-12 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center shadow-2xl shrink-0 group hover:scale-[1.05] transition-transform duration-500">
                    <User className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">{user?.user_metadata?.full_name || "User Identity"}</h1>
                        {user?.user_metadata?.onboarding_completed && (
                            <Badge className="bg-primary/20 text-primary border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">VERIFIED PROFILE</Badge>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-white/40 mb-6">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-bold tracking-tight">{user?.email}</span>
                        </div>
                        <div className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Security Protocol</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate("/settings")}
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl h-10 px-6"
                    >
                        <Settings className="w-3.5 h-3.5 mr-2" />
                        Configure Parameters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Target Destinations</div>
                    <div className="text-2xl font-black italic text-primary uppercase tracking-tighter">
                        {onboardingData?.locations?.length || 0} Portals
                    </div>
                </Card>
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Academic Specializations</div>
                    <div className="text-2xl font-black italic text-primary uppercase tracking-tighter">
                        {onboardingData?.interests?.length || 0} Vaults
                    </div>
                </Card>
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Financial Tier</div>
                    <div className="text-2xl font-black italic text-primary uppercase tracking-tighter">
                        {onboardingData?.budget?.label || "UNCONFIGURED"}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
