import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Settings, ArrowRight, Zap, Globe, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };
        getUser();
    }, []);

    const onboardingData = user?.user_metadata?.onboarding_data;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-12 pb-20 px-4"
        >
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden glass-panel p-8 md:p-12 rounded-[3.5rem] group shadow-2xl"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] premium-gradient rounded-full blur-[80px] -mr-40 -mt-20 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] ml-10 mb-10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-primary/30 to-transparent border border-white/10 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden transform group-hover/avatar:scale-105 transition-all duration-700">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                            <User className="w-20 h-20 text-primary group-hover/avatar:scale-110 transition-all duration-700 relative z-20" />
                        </div>
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000" />

                        {/* Level/Status Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl z-20">
                            <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
                            <span className="text-[9px] font-black tracking-widest text-white/80">LEVEL 1</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
                                    {user?.user_metadata?.full_name || "Nexus Identity"}
                                </h1>
                                {user?.user_metadata?.onboarding_completed !== false && (
                                    <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">Verified Ops</Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/50">
                            <div className="flex items-center gap-2 group/info">
                                <Mail className="w-4 h-4 group-hover/info:text-primary transition-colors" />
                                <span className="text-sm font-medium tracking-tight text-white/80">{user?.email}</span>
                            </div>
                            <div className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary/60" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Secure Link Active</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Button
                                onClick={() => navigate("/settings")}
                                className="bg-white text-black hover:bg-white/90 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl h-12 px-8 shadow-lg shadow-white/5 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Reconfigure System
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl h-12 px-8 transition-all"
                                onClick={() => navigate("/chat")}
                            >
                                Open Console
                                <ArrowRight className="w-3.5 h-3.5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Target Regions", value: onboardingData?.locations?.length || 0, unit: "Coordinates", icon: Globe },
                    { label: "Specializations", value: onboardingData?.interests?.length || 0, unit: "Interests", icon: Star },
                    { label: "Budget Tier", value: onboardingData?.budget?.label || "Balanced", unit: "INR (₹) Base", icon: Zap }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="glass-panel p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary/60 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.label}</div>
                            <div className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{stat.unit}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Account Activity / Summary */}
            <motion.div variants={itemVariants} className="glass-panel rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">System Intelligence</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Last synchronized with neural core</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Profile</label>
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            Your identity is anchored in India with a focus on {onboardingData?.interests?.[0] || 'General Academics'}.
                            The AI consultant is currently optimized for INR-based fee calculations and Indian educational structures.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary">Security Protocol</div>
                            <div className="text-sm font-bold text-white/80">End-to-End Encryption</div>
                        </div>
                        <Shield className="w-8 h-8 text-primary opacity-40" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Profile;
