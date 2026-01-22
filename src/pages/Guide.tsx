import { motion } from "framer-motion";
import { GraduationCap, Heart, Award, ArrowLeft, Star, Sparkles, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Guide = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-white/5 bg-black/40">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter">EmergentIQ</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button variant="ghost" className="text-white/50 hover:text-white rounded-full px-6 hover:bg-white/5" onClick={() => navigate("/")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </motion.div>
            </nav>

            <main className="pt-40 pb-20 px-6 container max-w-5xl mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.div variants={itemVariants} className="flex justify-center mb-10">
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm"
                            >
                                <Heart className="w-12 h-12 text-primary" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
                            >
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-[0.9]">
                        Mentors of <br /> <span className="text-primary italic">Intelligence</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/40 mb-20 max-w-3xl mx-auto leading-relaxed font-medium">
                        Recognizing the brilliant minds who transformed academic vision into engineering reality.
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-10 mb-24 items-stretch">
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="p-10 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 text-left relative overflow-hidden group transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                                <Award className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3">Project Guide</h3>
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Mrs. G. MEHALA M.E</h2>
                            <p className="text-white/40 font-medium mb-6">Head of the Department</p>
                            <div className="h-[1px] w-12 bg-primary/50 mb-6 group-hover:w-full transition-all duration-700" />
                            <p className="text-white/60 leading-relaxed italic">
                                "Shaping the technical foundation with unparalleled expertise and visionary guidance."
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="p-10 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 text-left relative overflow-hidden group transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-purple-500/20 transition-colors duration-700" />
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Project Incharge</h3>
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Mr. K. ASHOK KUMAR B.E</h2>
                            <p className="text-white/40 font-medium mb-6">Project Incharge</p>
                            <div className="h-[1px] w-12 bg-purple-400/50 mb-6 group-hover:w-full transition-all duration-700" />
                            <p className="text-white/60 leading-relaxed italic">
                                "Bridging the gap between conceptual excellence and industrial application."
                            </p>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="relative py-24 border-t border-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-y-24" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary-foreground text-xs font-bold uppercase tracking-[0.4em] mb-8"
                            >
                                <Building2 className="w-4 h-4 text-primary" />
                                Corporate Partnership
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">
                                Powered by <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">JS Corporations</span>
                            </h2>
                            <p className="text-white/30 text-sm font-medium tracking-widest uppercase">Innovation • Excellence • Future</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-20">
                        <Button
                            onClick={() => navigate("/")}
                            className="rounded-full px-12 h-14 text-lg font-bold bg-white text-black hover:bg-white/90 hover:scale-110 transition-all shadow-2xl"
                        >
                            Return Home
                        </Button>
                    </motion.div>
                </motion.div>
            </main>

            <footer className="py-12 text-center text-white/20 text-xs font-medium tracking-widest uppercase">
                © 2026 JS Corporations X EmergentIQ
            </footer>
        </div>
    );
};

export default Guide;
