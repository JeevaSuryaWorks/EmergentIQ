import { motion } from "framer-motion";
import { GraduationCap, Award, Globe, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Rankings = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,200,255,0.05),transparent)] pointer-events-none" />

            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">EmergentIQ</span>
                </div>
                <Button variant="ghost" className="text-white/50 hover:text-white" onClick={() => navigate("/")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
            </nav>

            <main className="pt-32 pb-20 px-6 container max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter">
                        Global Rankings
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Track the performance and authority of elite institutions across the globe.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    {[
                        { rank: 1, name: "Massachusetts Institute of Technology (MIT)", location: "USA", score: 100 },
                        { rank: 2, name: "Stanford University", location: "USA", score: 98.7 },
                        { rank: 3, name: "University of Oxford", location: "UK", score: 98.4 },
                        { rank: 4, name: "Harvard University", location: "USA", score: 97.9 },
                        { rank: 5, name: "University of Cambridge", location: "UK", score: 97.6 },
                    ].map((uni, i) => (
                        <motion.div
                            key={uni.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all cursor-default group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20">
                                {uni.rank}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{uni.name}</h3>
                                <p className="text-sm text-white/40 flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> {uni.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-white/30 uppercase tracking-widest font-black mb-1">Score</div>
                                <div className="text-2xl font-black flex items-center gap-2">
                                    {uni.score}
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Rankings;
