import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import * as ReactWindowNamespace from "react-window";
// const List = (ReactWindowNamespace as any).FixedSizeList || (ReactWindowNamespace as any).default?.FixedSizeList || (ReactWindowNamespace as any).default;
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

const Onboarding = () => {
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

    // --- Budget Logic ---
    const handleTierSelection = (label: string, min: number, max: number) => {
        setBudget({ currencyCode: 'INR', min, max, label, isCustom: false });
    };

    const handleNext = () => {
        if (currentStep === 0 && selectedLocations.length === 0) {
            toast.error("Please select at least one destination.");
            return;
        }
        if (currentStep === 1 && selectedInterests.length === 0) {
            toast.error("Tell us what you're passionate about!");
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Normalization for AI consumption
            const onboarding_data = {
                locations: selectedLocations,
                interests: selectedInterests.map(i => i.label),
                degreeLevels,
                budget,
                studyModes,
                languagePreference,
                onboarding_completed: true
            };

            const { error } = await supabase.auth.updateUser({
                data: {
                    onboarding_completed: true,
                    onboarding_data
                }
            });

            if (error) throw error;

            toast.success("Identity secured. Personalizing your portal...");
            setTimeout(() => navigate("/chat"), 1200);
        } catch (error: any) {
            toast.error(error.message || "Archive sync failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Virtualization Row Renderer ---
    const InterestRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const item = filteredInterests[index];
        const isSelected = selectedInterests.find(i => i.id === item.id);
        return (
            <div style={style} className="px-4 pb-2">
                <button
                    onClick={() => toggleInterest(item)}
                    className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                        isSelected
                            ? "bg-primary border-primary text-black shadow-lg shadow-primary/20"
                            : "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.05]"
                    )}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-40">{item.category}</span>
                            <ChevronRight className="w-2.5 h-2.5 opacity-20" />
                            <span className="text-[10px] font-bold opacity-60">{item.subCategory}</span>
                        </div>
                        <p className="font-bold text-sm group-hover:text-white transition-colors">{item.label}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 ml-4 shrink-0" />}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8 selection:bg-primary selection:text-black">
            <div className="w-full max-w-6xl relative">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center shadow-2xl">
                            <TrendingUp className="w-7 h-7 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Blueprint Discovery</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black tracking-[0.2em]">{steps[currentStep].id.toUpperCase()}</Badge>
                                <span className="text-white/20 text-[10px] uppercase font-black tracking-widest">Stage {currentStep + 1} // 3</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1.5 w-full md:w-64">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-700",
                                    idx < currentStep ? "bg-primary shadow-[0_0_10px_rgba(255,40,40,0.5)]" :
                                        idx === currentStep ? "bg-primary/40" : "bg-white/5"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.98, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.02, x: -20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                    >
                        <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative min-h-[650px] flex flex-col md:flex-row rounded-[2.5rem]">

                            {/* Visual Asset Side */}
                            <div className="w-full md:w-[35%] bg-gradient-to-b from-primary/10 to-transparent p-12 flex flex-col justify-end relative overflow-hidden hidden md:flex">
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                                    <div className="absolute top-20 left-10 w-32 h-32 bg-primary/40 rounded-full blur-[80px]" />
                                    <div className="absolute bottom-40 right-10 w-48 h-48 bg-primary/30 rounded-full blur-[100px]" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                                        {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-primary" })}
                                    </div>
                                    <h3 className="text-5xl font-black leading-[0.9] mb-6 italic uppercase tracking-tighter">
                                        {steps[currentStep].title}
                                    </h3>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[200px]">
                                        {steps[currentStep].description}
                                    </p>
                                </div>
                            </div>

                            {/* Interaction Side */}
                            <div className="flex-1 p-8 md:p-14 flex flex-col relative bg-white/[0.01]">

                                {/* --- Step 1: Hierarchical Location --- */}
                                {currentStep === 0 && (
                                    <div className="flex-1 flex flex-col space-y-10">
                                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 min-h-[40px]">
                                            <button
                                                onClick={() => handleBreadcrumbClick(-1)}
                                                className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all", drillPath.length === 0 ? "bg-primary text-black" : "text-white/40 hover:text-white")}
                                            >
                                                GLOBAL ATLAS
                                            </button>
                                            {drillPath.map((node, i) => (
                                                <React.Fragment key={node.id}>
                                                    <ChevronRight className="w-3.5 h-3.5 opacity-20 shrink-0" />
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

                                {/* --- Step 2: Academic Focus --- */}
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
                                                        <div key={interest.id} style={{ height: 85 }}>
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

                                {/* --- Step 3: Budget & Details --- */}
                                {currentStep === 2 && (
                                    <div className="flex-1 space-y-12 h-full flex flex-col">
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                                                        <DollarSign className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-2xl font-black italic uppercase tracking-tighter">Budget Protocol</Label>
                                                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Primary Grid: INR (₹)</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setBudget(b => ({ ...b, isCustom: !b.isCustom }))}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-primary transition-all border border-white/5"
                                                >
                                                    <SettingsIcon className="w-3.5 h-3.5" />
                                                    {budget.isCustom ? "TIER SYNC" : "CUSTOM CONFIG"}
                                                </button>
                                            </div>

                                            {budget.isCustom ? (
                                                <div className="grid grid-cols-2 gap-8 bg-black/40 p-10 rounded-[2.5rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Min Allocation (₹)</Label>
                                                        <Input
                                                            type="number"
                                                            value={budget.min}
                                                            onChange={e => setBudget(b => ({ ...b, min: Number(e.target.value) }))}
                                                            className="bg-zinc-900/50 border-white/5 h-16 rounded-2xl text-2xl font-black text-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Max Allocation (₹)</Label>
                                                        <Input
                                                            type="number"
                                                            value={budget.max}
                                                            onChange={e => setBudget(b => ({ ...b, max: Number(e.target.value) }))}
                                                            className="bg-zinc-900/50 border-white/5 h-16 rounded-2xl text-2xl font-black text-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {[
                                                        { label: "₹5L - ₹15L", min: 500000, max: 1500000 },
                                                        { label: "₹15L - ₹30L", min: 1500000, max: 3000000 },
                                                        { label: "₹30L - ₹50L", min: 3000000, max: 5000000 },
                                                        { label: "₹50L+", min: 5000000, max: 10000000 }
                                                    ].map(tier => (
                                                        <button
                                                            key={tier.label}
                                                            onClick={() => handleTierSelection(tier.label, tier.min, tier.max)}
                                                            className={cn(
                                                                "p-8 rounded-[2rem] border text-left transition-all flex items-center justify-between group relative overflow-hidden",
                                                                budget.label === tier.label
                                                                    ? "bg-primary border-primary text-black scale-[1.02] shadow-2xl shadow-primary/20"
                                                                    : "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.06]"
                                                            )}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-xl uppercase tracking-tighter italic">{tier.label}</span>
                                                                <span className={cn("text-[8px] font-black uppercase tracking-widest mt-1", budget.label === tier.label ? "text-black/40" : "text-white/20")}>Global Index Tier</span>
                                                            </div>
                                                            <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all", budget.label === tier.label ? "border-black bg-black/10" : "border-white/10 group-hover:border-white/30")}>
                                                                {budget.label === tier.label && <Check className="w-4 h-4 text-black" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-auto">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <Laptop className="w-6 h-6 text-primary opacity-50" />
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Operation Modes</Label>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {["On-campus", "Online", "Hybrid", "Part-time"].map(mode => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => setStudyModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode])}
                                                            className={cn(
                                                                "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                                                                studyModes.includes(mode)
                                                                    ? "bg-white text-black border-white shadow-xl"
                                                                    : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/20"
                                                            )}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <Clock className="w-6 h-6 text-primary opacity-50" />
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Primary Lexicon</Label>
                                                </div>
                                                <Input
                                                    value={languagePreference}
                                                    onChange={(e) => setLanguagePreference(e.target.value)}
                                                    className="bg-black/40 border-white/5 text-white h-14 rounded-2xl font-bold px-8 text-sm focus:ring-primary/20 shadow-inner"
                                                    placeholder="Linguistic Preference..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Footer */}
                                <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            if (currentStep > 0) setCurrentStep(prev => prev - 1);
                                            else navigate("/");
                                        }}
                                        className="text-white/40 hover:text-white font-black uppercase tracking-widest h-14 px-10 rounded-2xl group transition-all"
                                    >
                                        <ArrowLeft className="mr-3 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                        {currentStep === 0 ? "TERMINATE" : "BACKTRACK"}
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className="bg-primary text-black hover:bg-primary/90 px-14 rounded-[2rem] font-black uppercase tracking-widest h-20 shadow-[0_20px_50px_rgba(255,40,40,0.3)] transition-all hover:scale-[1.05] active:scale-[0.95] group"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                                                <span className="italic">INITIALIZING DISCOVERY...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="italic">{currentStep === steps.length - 1 ? "ACTIVATE SYSTEM" : "PROCEED SEQUENCE"}</span>
                                                <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-14 flex items-center justify-center gap-10 opacity-30">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">NEURAL LINK ACTIVE</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">EMERGENT.IQ // PRODUCTION GEN 04</span>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
