import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MapPin,
    BookOpen,
    DollarSign,
    GraduationCap,
    ArrowRight,
    Check,
    Globe,
    Search,
    ChevronRight,
    ArrowLeft,
    Laptop,
    Clock,
    X,
    TrendingUp,
    Settings as SettingsIcon,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateInterests, generateLocations } from "@/utils/dataGenerators";
import { LocationNode, InterestNode, BudgetPreference } from "@/types/onboarding";

// Removed react-window for now to debug SyntaxError

const steps = [
    {
        id: "location",
        title: "Study Destinations",
        description: "Explore global opportunities from continents to cities.",
        icon: MapPin,
    },
    {
        id: "interests",
        title: "Academic Focus",
        description: "Choose from thousands of specializations.",
        icon: BookOpen,
    },
    {
        id: "budget",
        title: "Financials & Mode",
        description: "Set your INR budget and preferred study style.",
        icon: DollarSign,
    },
];

const OnboardingFlow = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Master Data (Simulating large-scale fetch)
    const allLocations = useMemo(() => generateLocations(), []);
    const allInterests = useMemo(() => generateInterests(3000), []);

    // Form Data
    const [selectedLocations, setSelectedLocations] = useState<LocationNode[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<InterestNode[]>([]);
    const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
    const [budget, setBudget] = useState<BudgetPreference>({
        currencyCode: 'INR',
        min: 500000,
        max: 1500000,
        label: "₹5L - ₹15L",
        isCustom: false
    });
    const [studyModes, setStudyModes] = useState<string[]>([]);
    const [languagePreference, setLanguagePreference] = useState("English");

    // Location Drilling State
    const [drillPath, setDrillPath] = useState<LocationNode[]>([]);

    // Interests Search State
    const [interestSearch, setInterestSearch] = useState("");
    const [activeInterestTab, setActiveInterestTab] = useState("All");

    // UI Effects
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    // --- Location Logic ---
    const visibleLocations = useMemo(() => {
        const parentId = drillPath.length > 0 ? drillPath[drillPath.length - 1].id : null;
        return allLocations.filter(loc => loc.parentId === parentId);
    }, [drillPath, allLocations]);

    const handleDrill = (loc: LocationNode) => {
        if (loc.hasChildren) {
            setDrillPath([...drillPath, loc]);
        }
    };

    const toggleLocationSelection = (loc: LocationNode) => {
        setSelectedLocations(prev =>
            prev.find(l => l.id === loc.id)
                ? prev.filter(l => l.id !== loc.id)
                : [...prev, loc]
        );
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) setDrillPath([]);
        else setDrillPath(drillPath.slice(0, index + 1));
    };

    // --- Interests Logic ---
    const filteredInterests = useMemo(() => {
        let items = allInterests;
        if (activeInterestTab !== "All") {
            items = items.filter(i => i.category === activeInterestTab);
        }
        if (interestSearch) {
            const query = interestSearch.toLowerCase();
            items = items.filter(i => i.searchSlug.includes(query));
        }
        return items;
    }, [allInterests, interestSearch, activeInterestTab]);

    const toggleInterest = (interest: InterestNode) => {
        setSelectedInterests(prev =>
            prev.find(i => i.id === interest.id)
                ? prev.filter(i => i.id !== interest.id)
                : [...prev, interest]
        );
    };

    // Row renderer for the list
    const InterestRow = ({ index, style }: any) => {
        const interest = filteredInterests[index];
        if (!interest) return null;
        const isSelected = selectedInterests.find(i => i.id === interest.id);

        return (
            <div style={style} className="px-6 py-1.5 focus:outline-none">
                <button
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                        "w-full h-[70px] rounded-2xl px-5 flex items-center justify-between transition-all group border",
                        isSelected
                            ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                            : "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.06]"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isSelected ? "bg-black/10" : "bg-white/5"
                        )}>
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-xs uppercase italic tracking-tighter leading-none mb-1">{interest.label}</span>
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest opacity-40", isSelected ? "text-black" : "text-white")}>{interest.category}</span>
                        </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 animate-in zoom-in duration-300" />}
                </button>
            </div>
        );
    };

    // --- Budget Logic ---
    const handleTierSelection = (label: string, min: number, max: number) => {
        setBudget({ currencyCode: 'INR', min, max, label, isCustom: false });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No secure identity found");

            const { error } = await supabase.auth.updateUser({
                data: {
                    onboarding_completed: true,
                    onboarding_data: {
                        locations: selectedLocations,
                        interests: selectedInterests.map(i => i.label),
                        degreeLevels,
                        budget,
                        studyModes,
                        languagePreference
                    }
                }
            });

            if (error) throw error;

            toast.success("Identity established. Syncing intelligence...", {
                style: { background: '#000', border: '1px solid #22c55e', color: '#fff' }
            });

            setTimeout(() => {
                navigate("/chat");
            }, 800);
        } catch (error: any) {
            toast.error(error.message || "Sync failure");
        } finally {
            setIsSubmitting(false);
        }
    };

    const StepIcon = steps[currentStep].icon;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20">

                {/* Left Section: Visual Title & Content */}
                <div className="flex flex-col">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                <StepIcon className="w-7 h-7" />
                            </div>
                            <div className="h-[1px] flex-1 bg-white/5" />
                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Phase 0{currentStep + 1}</div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4">
                            {steps[currentStep].title}
                        </h1>
                        <p className="text-white/40 text-xl md:text-2xl font-medium tracking-tight max-w-xl">
                            {steps[currentStep].description}
                        </p>
                    </motion.div>

                    <div className="mt-16 flex-1 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col"
                            >
                                {/* --- Step 0: Locations --- */}
                                {currentStep === 0 && (
                                    <div className="flex-1 flex flex-col gap-10">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                                            <button
                                                onClick={() => handleBreadcrumbClick(-1)}
                                                className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all", drillPath.length === 0 ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                                            >
                                                World
                                            </button>
                                            {drillPath.map((node, i) => (
                                                <React.Fragment key={node.id}>
                                                    <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />
                                                    <button
                                                        onClick={() => handleBreadcrumbClick(i)}
                                                        className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl whitespace-nowrap transition-all", i === drillPath.length - 1 ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                                                    >
                                                        {node.label}
                                                    </button>
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {visibleLocations.map(loc => {
                                                const isSelected = selectedLocations.find(l => l.id === loc.id);
                                                return (
                                                    <button
                                                        key={loc.id}
                                                        onClick={() => loc.hasChildren ? handleDrill(loc) : toggleLocationSelection(loc)}
                                                        className={cn(
                                                            "group p-6 rounded-[1.75rem] border text-left transition-all duration-500 relative overflow-hidden",
                                                            isSelected
                                                                ? "bg-primary border-primary text-black shadow-2xl shadow-primary/20"
                                                                : "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02]"
                                                        )}
                                                    >
                                                        <div className="relative z-10 flex flex-col gap-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isSelected ? "bg-black/10" : "bg-white/5")}>
                                                                    {loc.hasChildren ? <Globe className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {loc.hasChildren && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className={cn("w-8 h-8 rounded-lg hover:bg-white/10", isSelected ? "text-black/40 hover:text-black" : "text-white/40 hover:text-white")}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleLocationSelection(loc);
                                                                            }}
                                                                        >
                                                                            {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-sm opacity-20" />}
                                                                        </Button>
                                                                    )}
                                                                    {loc.hasChildren && <ArrowUpRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />}
                                                                    {!loc.hasChildren && isSelected && <Check className="w-5 h-5" />}
                                                                </div>
                                                            </div>
                                                            <span className="font-black text-sm tracking-tight leading-tight uppercase italic">{loc.label}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {selectedLocations.length > 0 && (
                                            <div className="mt-auto pt-10 border-t border-white/5">
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5">Selected Domains // {selectedLocations.length}</p>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {selectedLocations.map(loc => (
                                                        <Badge
                                                            key={loc.id}
                                                            className="bg-primary/10 text-primary border-primary/20 pl-4 pr-3 py-2.5 rounded-2xl hover:bg-red-500/20 hover:text-red-400 group cursor-pointer transition-all active:scale-95"
                                                            onClick={() => toggleLocationSelection(loc)}
                                                        >
                                                            <span className="font-bold tracking-tight">{loc.label}</span>
                                                            <X className="w-3.5 h-3.5 ml-3 opacity-40 group-hover:opacity-100" />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- Step 1: Academic Focus --- */}
                                {currentStep === 1 && (
                                    <div className="flex-1 flex flex-col gap-10 h-full">
                                        <div className="flex flex-col gap-6">
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                    <Search className="w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
                                                    <div className="w-[1px] h-6 bg-white/10" />
                                                </div>
                                                <Input
                                                    placeholder="Query 3,000+ specialized disciplines..."
                                                    className="pl-20 bg-white/5 border-white/5 text-white h-20 rounded-[1.5rem] focus:ring-primary/20 text-xl font-bold placeholder:text-white/20 shadow-inner"
                                                    value={interestSearch}
                                                    onChange={(e) => setInterestSearch(e.target.value)}
                                                />
                                            </div>

                                            <ScrollArea className="w-full">
                                                <div className="flex gap-2.5 pb-2">
                                                    {["All", "Engineering", "Tech", "Business", "Medicine", "Arts", "Science"].map(tab => (
                                                        <button
                                                            key={tab}
                                                            onClick={() => setActiveInterestTab(tab)}
                                                            className={cn(
                                                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border",
                                                                activeInterestTab === tab
                                                                    ? "bg-white text-black border-white shadow-xl shadow-white/5"
                                                                    : "bg-white/5 text-white/30 border-white/5 hover:border-white/20 hover:bg-white/10"
                                                            )}
                                                        >
                                                            {tab}
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        {/* Standard Scroll Area instead of Virtualized List for Debugging */}
                                        <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner">
                                            <ScrollArea className="h-[320px] w-full px-6">
                                                <div className="py-6 space-y-2">
                                                    {filteredInterests.map((interest, index) => (
                                                        <div key={interest.id}>
                                                            {InterestRow({ index, style: {} })}
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <GraduationCap className="w-5 h-5 text-primary opacity-50" />
                                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Credential Levels</Label>
                                            </div>
                                            <div className="flex flex-wrap gap-2.5">
                                                {["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"].map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setDegreeLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level])}
                                                        className={cn(
                                                            "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all",
                                                            degreeLevels.includes(level)
                                                                ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10"
                                                                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                                                        )}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- Step 2: Budget & Mode --- */}
                                {currentStep === 2 && (
                                    <div className="flex-1 flex flex-col gap-16">
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Financial Protocol</div>
                                                    <h3 className="text-3xl font-black italic uppercase italic">Projected Allocation</h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[24px] font-black text-primary underline decoration-2 underline-offset-8">
                                                        {budget.label || `₹${budget.min} - ₹${budget.max}`}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    ["Budget (Entry)", 0, 1500000, "₹0 - ₹15L"],
                                                    ["Standard", 1500000, 3000000, "₹15L - ₹30L"],
                                                    ["Elite", 3000000, 6000000, "₹30L - ₹60L"],
                                                    ["Unlimited", 6000000, 20000000, "₹60L+"]
                                                ].map(([tier, min, max, label]) => (
                                                    <button
                                                        key={tier as string}
                                                        onClick={() => handleTierSelection(label as string, min as number, max as number)}
                                                        className={cn(
                                                            "p-6 rounded-3xl border text-left transition-all group",
                                                            budget.label === label
                                                                ? "bg-white text-black border-white shadow-xl shadow-white/5"
                                                                : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-3 opacity-40 group-hover:opacity-100">{tier as string}</div>
                                                        <div className="font-black text-sm uppercase italic">{label as string}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3">
                                                <Laptop className="w-5 h-5 text-primary opacity-50" />
                                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Operational Modality</Label>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {["On-campus", "Online", "Hybrid", "Part-time"].map(mode => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => setStudyModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode])}
                                                        className={cn(
                                                            "p-6 rounded-3xl border text-center transition-all",
                                                            studyModes.includes(mode)
                                                                ? "bg-primary/20 border-primary text-primary"
                                                                : "bg-white/5 border-white/5 text-white/40"
                                                        )}
                                                    >
                                                        <span className="font-black text-[10px] uppercase tracking-widest">{mode}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-20 flex items-center justify-between gap-10">
                        <div className="flex gap-2">
                            {steps.map((_, i) => (
                                <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === currentStep ? "w-12 bg-primary" : "w-4 bg-white/10")} />
                            ))}
                        </div>
                        <div className="flex gap-4">
                            {currentStep > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white"
                                >
                                    <ArrowLeft className="mr-3 w-4 h-4" /> Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                disabled={isSubmitting || (currentStep === 0 && selectedLocations.length === 0)}
                                className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-white/5 group"
                            >
                                {isSubmitting ? "Syncing..." : currentStep === steps.length - 1 ? "Initialize Identity" : "Next Phase"}
                                {!isSubmitting && <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Section: Manifesto/Tips */}
                <div className="hidden lg:flex flex-col gap-10">
                    <Card className="bg-white/[0.03] border-white/5 p-10 rounded-[3rem] space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Manifesto</div>
                            <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter">Your Future, Scaled.</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                EmergentIQ isn't just a search tool. It's a high-performance engine designed to map your unique intellectual trajectory across the globe.
                            </p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex gap-5 group/item">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Global Intelligence</p>
                                    <p className="text-[11px] text-white/30 leading-tight">Cross-reference thousands of data points instantly.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 group/item">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                    <SettingsIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">AI Personalization</p>
                                    <p className="text-[11px] text-white/30 leading-tight">Your inputs directly influence the neural advice layer.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="px-10 space-y-4">
                        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10">Security Protocol</div>
                        <p className="text-[10px] text-white/20 italic leading-snug">
                            All data is encrypted and synced with your primary identity vault. Changes are reflected in real-time across the chat advisor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
