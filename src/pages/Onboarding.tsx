import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MapPin,
    BookOpen,
    DollarSign,
    GraduationCap,
    ArrowRight,
    Check,
    Globe,
    Building2,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
    {
        id: "location",
        title: "Study Destinations",
        description: "Where would you like to pursue your education?",
        icon: MapPin,
    },
    {
        id: "interests",
        title: "Academic Interests",
        description: "What fields are you most passionate about?",
        icon: BookOpen,
    },
    {
        id: "budget",
        title: "Budget & Mode",
        description: "Help us understand your financial and study preferences.",
        icon: DollarSign,
    },
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        locations: [] as string[],
        interests: [] as string[],
        degreeLevel: "",
        budgetRange: "",
        studyMode: "On-campus",
        languagePreference: "English"
    });

    const locations = ["USA", "UK", "Canada", "Germany", "Australia", "Europe", "Asia"];
    const interests = ["Computer Science", "Business", "Engineering", "Medicine", "Arts", "Social Sciences", "Law"];
    const degreeLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
    const studyModes = ["On-campus", "Online", "Hybrid"];

    const toggleSelection = (field: "locations" | "interests", value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
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
            if (!user) throw new Error("No user found");

            const { error } = await supabase.auth.updateUser({
                data: {
                    onboarding_completed: true,
                    onboarding_data: formData
                }
            });

            if (error) throw error;

            toast.success("Welcome aboard! Personalizing your experience...");

            // Allow a tiny moment for session sync
            setTimeout(() => {
                navigate("/chat");
            }, 500);
        } catch (error: any) {
            toast.error(error.message || "Failed to save preferences");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-all duration-500",
                                idx <= currentStep ? "bg-primary" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="bg-zinc-950 border-white/5 p-8 shadow-2xl relative overflow-hidden">
                            {/* Abstract background effect */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    {steps[currentStep] && (() => {
                                        const StepIcon = steps[currentStep].icon;
                                        return <StepIcon className="w-6 h-6 text-primary" />;
                                    })()}
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h1>
                                <p className="text-white/40 mb-8">{steps[currentStep].description}</p>

                                {currentStep === 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {locations.map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => toggleSelection("locations", loc)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-sm font-medium transition-all",
                                                    formData.locations.includes(loc)
                                                        ? "bg-primary border-primary text-black"
                                                        : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                                                )}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {interests.map(int => (
                                                <button
                                                    key={int}
                                                    onClick={() => toggleSelection("interests", int)}
                                                    className={cn(
                                                        "p-3 rounded-xl border text-sm font-medium transition-all",
                                                        formData.interests.includes(int)
                                                            ? "bg-primary border-primary text-black"
                                                            : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                                                    )}
                                                >
                                                    {int}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            <Label className="text-white/60">Degree Level</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {degreeLevels.map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setFormData(prev => ({ ...prev, degreeLevel: level }))}
                                                        className={cn(
                                                            "px-4 py-2 rounded-lg border text-xs font-medium transition-all",
                                                            formData.degreeLevel === level
                                                                ? "bg-primary/20 border-primary text-primary"
                                                                : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                                                        )}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-white/60">Annual Tuition Budget (USD)</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Under $15k", "$15k - $30k", "$30k - $50k", "$50k+"].map(range => (
                                                    <button
                                                        key={range}
                                                        onClick={() => setFormData(prev => ({ ...prev, budgetRange: range }))}
                                                        className={cn(
                                                            "p-3 rounded-xl border text-sm font-medium transition-all",
                                                            formData.budgetRange === range
                                                                ? "bg-primary border-primary text-black"
                                                                : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                                                        )}
                                                    >
                                                        {range}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                            <div className="space-y-3">
                                                <Label className="text-white/60">Study Mode</Label>
                                                <div className="flex flex-col gap-2">
                                                    {studyModes.map(mode => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => setFormData(prev => ({ ...prev, studyMode: mode }))}
                                                            className={cn(
                                                                "p-2 rounded-lg border text-xs text-left transition-all",
                                                                formData.studyMode === mode
                                                                    ? "bg-primary/10 border-primary/50 text-white"
                                                                    : "bg-white/5 border-white/5 text-white/40"
                                                            )}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-white/60">Preferred Language</Label>
                                                <Input
                                                    value={formData.languagePreference}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, languagePreference: e.target.value }))}
                                                    className="bg-white/5 border-white/10 text-white h-9 text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-12 flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        disabled={currentStep === 0}
                                        className="text-white/40 hover:text-white"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className="bg-primary text-black hover:bg-primary/90 px-8 rounded-xl font-bold h-12"
                                    >
                                        {isSubmitting ? "Saving..." : currentStep === steps.length - 1 ? "Start Discovering" : "Continue"}
                                        {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <p className="mt-8 text-center text-white/20 text-xs">
                    Your preferences help EmergentIQ AI provide personalized recommendations.
                </p>
            </div>
        </div>
    );
};

export default Onboarding;
