import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    User,
    Settings as SettingsIcon,
    MapPin,
    BookOpen,
    DollarSign,
    Laptop,
    Save,
    ChevronRight,
    X,
    Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Settings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [preferences, setPreferences] = useState<any>(null);

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.onboarding_data) {
                setPreferences(user.user_metadata.onboarding_data);
            }
        } catch (error) {
            console.error("Error fetching preferences:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    onboarding_data: preferences
                }
            });
            if (error) throw error;
            toast.success("Preferences updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update preferences");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">System Configuration</h1>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Adjust your AI personalization parameters</p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-black font-black uppercase tracking-widest px-8 rounded-xl h-12 shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
                >
                    {isSaving ? "Syncing..." : "Commit Changes"}
                    <Save className="ml-2 w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destinations */}
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Target Destinations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {preferences?.locations?.map((loc: any) => (
                            <Badge key={loc.id} className="bg-white/5 border-white/10 text-white/60 px-4 py-2 rounded-xl">
                                {loc.label}
                            </Badge>
                        ))}
                        {(!preferences?.locations || preferences.locations.length === 0) && (
                            <p className="text-white/20 text-xs italic">No destinations selected</p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/onboarding")}
                        className="w-full border border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        Modify Locations <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                </Card>

                {/* Academic Focus */}
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Academic Focus</h3>
                    </div>
                    <ScrollArea className="h-32">
                        <div className="flex flex-wrap gap-2">
                            {preferences?.interests?.map((interest: string) => (
                                <Badge key={interest} className="bg-primary/10 border-primary/20 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold">
                                    {interest}
                                </Badge>
                            ))}
                            {(!preferences?.interests || preferences.interests.length === 0) && (
                                <p className="text-white/20 text-xs italic">No interests archived</p>
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Budget */}
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Financial Protocol</h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Allocation</span>
                            <span className="text-sm font-black text-primary italic underline">{preferences?.budget?.label || `₹${preferences?.budget?.min} - ₹${preferences?.budget?.max}`}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-white/20">Min (₹)</Label>
                            <Input
                                type="number"
                                value={preferences?.budget?.min}
                                onChange={e => setPreferences({ ...preferences, budget: { ...preferences.budget, min: Number(e.target.value), label: 'Custom' } })}
                                className="bg-black/50 border-white/5 h-10 rounded-lg text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-white/20">Max (₹)</Label>
                            <Input
                                type="number"
                                value={preferences?.budget?.max}
                                onChange={e => setPreferences({ ...preferences, budget: { ...preferences.budget, max: Number(e.target.value), label: 'Custom' } })}
                                className="bg-black/50 border-white/5 h-10 rounded-lg text-xs font-bold"
                            />
                        </div>
                    </div>
                </Card>

                {/* Study Mode */}
                <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-primary" />
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Mode of Operation</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["On-campus", "Online", "Hybrid", "Part-time"].map(mode => (
                            <button
                                key={mode}
                                onClick={() => {
                                    const modes = preferences?.studyModes || [];
                                    const newModes = modes.includes(mode) ? modes.filter((m: string) => m !== mode) : [...modes, mode];
                                    setPreferences({ ...preferences, studyModes: newModes });
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                    preferences?.studyModes?.includes(mode)
                                        ? "bg-white text-black border-white"
                                        : "bg-white/5 border-white/5 text-white/40"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Account & Security Section */}
            <div className="pt-10 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Account & Security</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Manage your credentials and session</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-zinc-950/50 border-white/5 p-8 rounded-[2rem] space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-black uppercase tracking-widest text-sm italic text-white/80">Access Strategy</h3>
                            <p className="text-white/40 text-xs">Securely update your authentication credentials</p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-xl"
                            onClick={async () => {
                                const { data: { user } } = await supabase.auth.getUser();
                                if (user?.email) {
                                    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                                        redirectTo: `${window.location.origin}/auth?mode=reset`
                                    });
                                    if (error) toast.error(error.message);
                                    else toast.success("Password reset link sent to your email");
                                }
                            }}
                        >
                            Reset Password Cipher
                        </Button>
                    </Card>

                    <Card className="bg-red-500/5 border-red-500/10 p-8 rounded-[2rem] space-y-6 group hover:bg-red-500/10 transition-colors">
                        <div className="space-y-2">
                            <h3 className="font-black uppercase tracking-widest text-sm italic text-red-400">System Termination</h3>
                            <p className="text-red-400/40 text-xs">Sign out of your current session across this device</p>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-red-600/20"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to terminate your session?")) {
                                    supabase.auth.signOut().then(() => {
                                        navigate("/");
                                        toast.success("Session terminated. Security lock active.");
                                    });
                                }
                            }}
                        >
                            Sign Out Signal
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
