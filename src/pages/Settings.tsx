import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Shield,
    Globe,
    Zap,
    Search,
    Check,
    ArrowLeft,
    RotateCcw,
    LogOut,
    Info,
    Users,
    Phone,
    FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [preferences, setPreferences] = useState<any>({
        locations: [],
        interests: [],
        budget: { label: 'Balanced', min: 1000000, max: 5000000 },
        studyModes: ["On-campus"],
        languagePreference: "English",
        degreeLevels: ["Undergraduate"]
    });

    // Master Data for Selectors
    const [allLocations, setAllLocations] = useState<any[]>([]);
    const [allInterests, setAllInterests] = useState<any[]>([]);
    const [drillPath, setDrillPath] = useState<any[]>([]);
    const [interestSearch, setInterestSearch] = useState("");
    const [isDrilling, setIsDrilling] = useState(false);

    useEffect(() => {
        fetchPreferences();
        fetchInitialData();
    }, []);

    const fetchPreferences = async (forceRefresh = false) => {
        try {
            setIsLoading(true);

            if (forceRefresh) {
                // Force a session refresh to get the absolute latest metadata from the server
                const { error: refreshError } = await supabase.auth.refreshSession();
                if (refreshError) throw refreshError;
            }

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            if (user?.user_metadata?.onboarding_data) {
                setPreferences(user.user_metadata.onboarding_data);
            }

            // Clear navigation/search state on reset
            setDrillPath([]);
            setInterestSearch("");

            if (forceRefresh) {
                toast.success("Settings reverted to last saved state");
            }
        } catch (error: any) {
            console.error("Error fetching preferences:", error);
            toast.error(error.message || "Failed to load/reset your preferences");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        // Fetch Continents
        const { data: continents } = await supabase.from('continents').select('*');
        if (continents) {
            setAllLocations(continents.map(c => ({
                id: c.id,
                label: c.name,
                type: 'continent',
                parentId: null,
                hasChildren: true
            })));
        }

        // Fetch Initial Interests
        const { data: interests } = await supabase
            .from('academic_interests')
            .select('*, academic_categories(name)')
            .limit(50);
        if (interests) {
            setAllInterests(interests.map((i: any) => ({
                id: i.id,
                label: i.name,
                category: i.academic_categories.name
            })));
        }
    };

    // --- Searchable Interests ---
    const filteredInterests = useMemo(() => {
        if (!interestSearch) return allInterests;
        return allInterests.filter(i =>
            i.label.toLowerCase().includes(interestSearch.toLowerCase()) ||
            i.category.toLowerCase().includes(interestSearch.toLowerCase())
        );
    }, [allInterests, interestSearch]);

    useEffect(() => {
        const searchInterests = async () => {
            if (!interestSearch) return;
            const { data } = await supabase
                .from('academic_interests')
                .select('*, academic_categories(name)')
                .ilike('name', `%${interestSearch}%`)
                .limit(20);
            if (data) {
                const mapped = data.map((i: any) => ({
                    id: i.id,
                    label: i.name,
                    category: i.academic_categories.name
                }));
                setAllInterests(prev => {
                    const ids = new Set(prev.map(p => p.id));
                    return [...prev, ...mapped.filter(m => !ids.has(m.id))];
                });
            }
        };
        const timer = setTimeout(searchInterests, 300);
        return () => clearTimeout(timer);
    }, [interestSearch]);

    // --- Location Drilling ---
    const visibleLocations = useMemo(() => {
        const parentId = drillPath.length > 0 ? drillPath[drillPath.length - 1].id : null;
        return allLocations.filter(loc => loc.parentId === parentId);
    }, [drillPath, allLocations]);

    const toggleLocation = (loc: any) => {
        const isSelected = preferences.locations.find((l: any) => l.id === loc.id);
        const newLocs = isSelected
            ? preferences.locations.filter((l: any) => l.id !== loc.id)
            : [...preferences.locations, loc];
        setPreferences({ ...preferences, locations: newLocs });
    };

    const handleDrill = async (loc: any) => {
        if (loc.hasChildren) {
            setDrillPath([...drillPath, loc]);
            const alreadyFetched = allLocations.some(l => l.parentId === loc.id);
            if (!alreadyFetched) {
                setIsDrilling(true);
                const table = loc.type === 'continent' ? 'countries' : 'states_regions';
                const filterCol = loc.type === 'continent' ? 'continent_id' : 'country_id';
                const { data } = await supabase.from(table as any).select('*').eq(filterCol, loc.id);
                if (data) {
                    const newNodes = data.map((item: any) => ({
                        id: item.id,
                        label: item.name,
                        type: table === 'countries' ? 'country' : 'state',
                        parentId: loc.id,
                        hasChildren: table === 'countries'
                    }));
                    setAllLocations(prev => [...prev, ...newNodes]);
                }
                setIsDrilling(false);
            }
        } else {
            toggleLocation(loc);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    onboarding_data: preferences
                }
            });
            if (error) throw error;

            // Refresh local state from server response to confirm sync
            if (data?.user?.user_metadata?.onboarding_data) {
                setPreferences(data.user.user_metadata.onboarding_data);
            }

            toast.success("Profile settings updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update settings");
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
        <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-xl border border-primary/20">
                        <SettingsIcon className="w-8 h-8 text-primary animate-pulse-soft" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Profile Settings</h1>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mt-2">Manage your academic preferences and account</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => fetchPreferences(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-black font-black uppercase tracking-[0.2em] px-10 rounded-2xl h-14 shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all text-[11px] group"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                        <Save className="ml-3 w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="preferences" className="space-y-10">
                <TabsList className="bg-white/5 border border-white/5 p-1.5 h-auto rounded-[2rem] flex flex-wrap md:inline-flex shadow-inner">
                    <TabsTrigger value="preferences" className="rounded-[1.5rem] px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest transition-all">
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger value="account" className="rounded-[1.5rem] px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest transition-all">
                        Security & Access
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-[1.5rem] px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-black text-[10px] font-black uppercase tracking-widest transition-all">
                        Resources
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="preferences" className="space-y-10 animate-fade-in outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location Matrix */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="glass-panel p-8 rounded-[3rem] space-y-8 h-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg border border-primary/10">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-black uppercase tracking-widest text-sm italic">Explore Destinations</h3>
                                    </div>
                                    <Badge className="bg-white/5 text-white/40 border-white/5">{preferences.locations.length}</Badge>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
                                        <button onClick={() => setDrillPath([])} className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap", drillPath.length === 0 ? "bg-primary text-black" : "text-white/40 hover:text-white")}>Global</button>
                                        {drillPath.map((node, i) => (
                                            <React.Fragment key={node.id}>
                                                <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />
                                                <button onClick={() => setDrillPath(drillPath.slice(0, i + 1))} className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap", i === drillPath.length - 1 ? "bg-primary text-black" : "text-white/40 hover:text-white")}>{node.label}</button>
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <ScrollArea className="h-[240px] pr-4">
                                        <div className="space-y-2">
                                            {isDrilling ? (
                                                <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                                            ) : visibleLocations.map(loc => {
                                                const isSelected = preferences.locations.find((l: any) => l.id === loc.id);
                                                return (
                                                    <button
                                                        key={loc.id}
                                                        onClick={() => handleDrill(loc)}
                                                        className="w-full group p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-primary/20 transition-all flex items-center justify-between"
                                                    >
                                                        <span className="text-xs font-bold uppercase tracking-tight">{loc.label}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newLocs = isSelected
                                                                        ? preferences.locations.filter((l: any) => l.id !== loc.id)
                                                                        : [...preferences.locations, loc];
                                                                    setPreferences({ ...preferences, locations: newLocs });
                                                                }}
                                                                className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", isSelected ? "bg-primary text-black shadow-lg" : "bg-white/5 text-white/40 hover:text-white")}
                                                            >
                                                                {isSelected ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                            </button>
                                                            {loc.hasChildren && <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Interests Matrix */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="glass-panel p-8 rounded-[3rem] space-y-8 h-full">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg border border-primary/10">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-widest text-sm italic">Field of Study</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Query interests..."
                                            value={interestSearch}
                                            onChange={e => setInterestSearch(e.target.value)}
                                            className="bg-white/5 border-white/5 pl-12 h-14 rounded-2xl focus:ring-primary/20 text-xs font-bold uppercase tracking-widest"
                                        />
                                    </div>

                                    <ScrollArea className="h-[280px] pr-4">
                                        <div className="space-y-3 pb-4">
                                            {filteredInterests.map(interest => {
                                                const isSelected = preferences.interests.includes(interest.label);
                                                return (
                                                    <button
                                                        key={interest.id}
                                                        onClick={() => {
                                                            const newInterests = isSelected
                                                                ? preferences.interests.filter((i: string) => i !== interest.label)
                                                                : [...preferences.interests, interest.label];
                                                            setPreferences({ ...preferences, interests: newInterests });
                                                        }}
                                                        className={cn(
                                                            "w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group",
                                                            isSelected ? "bg-primary border-primary text-black shadow-lg shadow-primary/10" : "bg-white/5 border-white/5 text-white/60 hover:border-white/20"
                                                        )}
                                                    >
                                                        <div>
                                                            <div className="text-xs font-black uppercase italic tracking-tighter leading-none mb-1">{interest.label}</div>
                                                            <div className={cn("text-[8px] font-black uppercase tracking-[0.2em]", isSelected ? "text-black/50" : "text-white/20")}>{interest.category}</div>
                                                        </div>
                                                        {isSelected && <Check className="w-4 h-4" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Financial Protocols */}
                        <Card className="glass-panel p-10 rounded-[3rem] space-y-10">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5 border border-primary/10">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Budget Profile</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Tier</label>
                                        <div className="text-xl font-black text-primary italic uppercase tracking-tighter">{preferences.budget?.label || "Custom Sync"}</div>
                                    </div>
                                    <Zap className="w-10 h-10 text-primary opacity-20" />
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Baseline (₹)</Label>
                                        <Input
                                            type="number"
                                            value={preferences.budget?.min}
                                            onChange={e => setPreferences({ ...preferences, budget: { ...preferences.budget, min: Number(e.target.value), label: 'Custom' } })}
                                            className="bg-black/50 border-white/10 h-14 rounded-2xl text-sm font-black italic tracking-tighter focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1">Ceiling (₹)</Label>
                                        <Input
                                            type="number"
                                            value={preferences.budget?.max}
                                            onChange={e => setPreferences({ ...preferences, budget: { ...preferences.budget, max: Number(e.target.value), label: 'Custom' } })}
                                            className="bg-black/50 border-white/10 h-14 rounded-2xl text-sm font-black italic tracking-tighter focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Modalities */}
                        <Card className="glass-panel p-10 rounded-[3rem] flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-primary/60 border border-white/10 shadow-lg">
                                        <Laptop className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Learning Mode</h3>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {["On-campus", "Online", "Hybrid", "Part-time"].map(mode => {
                                        const isSelected = preferences.studyModes.includes(mode);
                                        return (
                                            <button
                                                key={mode}
                                                onClick={() => {
                                                    const newModes = isSelected
                                                        ? preferences.studyModes.filter((m: string) => m !== mode)
                                                        : [...preferences.studyModes, mode];
                                                    setPreferences({ ...preferences, studyModes: newModes });
                                                }}
                                                className={cn(
                                                    "px-8 py-4 rounded-[1.5rem] border text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                                    isSelected ? "bg-white text-black border-white shadow-xl" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                                )}
                                            >
                                                {mode}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 text-center">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Parameters define AI response grounding</p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-10 animate-fade-in outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="glass-panel p-10 rounded-[3rem] space-y-8 group transition-all duration-500 hover:shadow-primary/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Security & Recovery</h3>
                                </div>
                                <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-wider">Update your password to keep your account secure. We'll send a secure reset link to your registered email.</p>
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-lg transition-all active:scale-95"
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
                                    Change Password
                                </Button>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="glass-panel p-10 rounded-[3rem] space-y-8 bg-red-500/[0.02] border-red-500/10 hover:bg-red-500/[0.05]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        <LogOut className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">Session Guard</h3>
                                </div>
                                <p className="text-red-500/40 text-[11px] font-medium leading-relaxed uppercase tracking-wider">Sign out from your current session. This will securely clear your local authorization and close active connections.</p>
                                <Button
                                    variant="destructive"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-16 rounded-[1.5rem] shadow-2xl shadow-red-600/20 active:scale-95 transition-all text-[11px]"
                                    onClick={() => {
                                        if (window.confirm("CONFIRM SYSTEM DISCONNECT?")) {
                                            signOut().then(() => {
                                                navigate("/");
                                                toast.success("Disconnected. Security lockdown initialized.");
                                            });
                                        }
                                    }}
                                >
                                    Sign Out Securely
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-10 animate-fade-in outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company Section */}
                        <Card className="glass-panel p-10 rounded-[3rem] space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Company</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { title: "User Guide", icon: BookOpen, path: "/guide" },
                                    { title: "About Us", icon: Info, path: "/about" },
                                    { title: "Our Team", icon: Users, path: "/team" },
                                    { title: "Contact Us", icon: Phone, path: "/contact" },
                                ].map((item) => (
                                    <Button
                                        key={item.path}
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-between px-6 group transition-all"
                                        onClick={() => navigate(item.path)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className="w-4 h-4 text-primary" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{item.title}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                    </Button>
                                ))}
                            </div>
                        </Card>

                        {/* Legal Section */}
                        <Card className="glass-panel p-10 rounded-[3rem] space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Legal</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { title: "Privacy Policy", icon: Shield, path: "/privacy" },
                                    { title: "Terms of Service", icon: FileText, path: "/terms" },
                                ].map((item) => (
                                    <Button
                                        key={item.path}
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-between px-6 group transition-all"
                                        onClick={() => navigate(item.path)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className="w-4 h-4 text-primary" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{item.title}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
