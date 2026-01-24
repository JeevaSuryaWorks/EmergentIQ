import { motion } from "framer-motion";
import { GraduationCap, Heart, Award, ArrowLeft, Star, Sparkles, Building2, User } from "lucide-react";
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

            <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center backdrop-blur-2xl border-b border-white/5 bg-black/60">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="font-black text-xl md:text-2xl tracking-tighter">EmergentIQ</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button variant="ghost" className="text-white/70 hover:text-white rounded-full px-4 md:px-6 hover:bg-white/10" onClick={() => navigate("/")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Back to Hub</span><span className="sm:hidden">Back</span>
                    </Button>
                </motion.div>
            </nav>

            <main className="pt-32 md:pt-40 pb-20 px-6 container max-w-5xl mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <div className="relative mb-24 md:mb-32 group perspective-1000">
                        <div className="absolute inset-x-20 top-20 bottom-20 bg-primary/20 blur-[100px] rounded-full mix-blend-screen" />
                        <motion.div
                            initial={{ y: 20, opacity: 0, rotateX: 20 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="relative mx-auto max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl shadow-primary/10 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5" />
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="relative rounded-xl overflow-hidden border border-white/5 bg-black/50 aspect-[21/9] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700">
                                <img
                                    src="/EmergentIQ_Logo.png"
                                    alt="EmergentIQ Central Hub"
                                    className="w-full h-full object-contain p-8 md:p-12 opacity-90 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 group-hover:text-primary/70 transition-colors">EST. 2026</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-9xl font-playfair font-black mb-6 tracking-tight bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[0.9]">
                        Mentors of <br /> <span className="text-primary italic font-serif">Intelligence</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl md:text-3xl text-white/80 mb-20 md:mb-32 max-w-4xl mx-auto leading-relaxed font-light tracking-wide font-sans">
                        Recognizing the <span className="text-white font-semibold">brilliant minds</span> who transformed academic vision into engineering reality.
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-24 md:mb-32 items-stretch max-w-6xl mx-auto">
                        {/* Executive Card 1: Mrs. Mehala */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="group relative flex flex-col"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-[3rem] blur-2xl transform group-hover:scale-105 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                            <div className="relative flex-1 p-8 md:p-12 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 overflow-hidden flex flex-col items-center text-center shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-black flex items-center justify-center mb-10 border border-primary/20 shadow-[0_10px_30px_-10px_rgba(0,255,180,0.3)] group-hover:rotate-6 transition-transform duration-500">
                                    <Award className="w-10 h-10 md:w-12 md:h-12 text-primary drop-shadow-[0_0_10px_rgba(0,255,180,0.5)]" />
                                </div>

                                <div className="space-y-2 mb-8">
                                    <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Head of Department</h3>
                                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-tight leading-tight">
                                        Mrs. G. Mehala <span className="text-white/40 text-2xl md:text-3xl block mt-1 font-sans font-light tracking-widest uppercase">M.E.</span>
                                    </h2>
                                </div>

                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8 group-hover:via-primary/50 transition-colors duration-700" />

                                <div className="relative">
                                    <Sparkles className="absolute -top-6 -left-4 w-6 h-6 text-primary/20" />
                                    <p className="text-white/70 text-lg md:text-xl leading-relaxed font-serif italic">
                                        "Shaping the technical foundation with unparalleled expertise and visionary guidance."
                                    </p>
                                    <Sparkles className="absolute -bottom-6 -right-4 w-6 h-6 text-primary/20 rotate-180" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Executive Card 2: Mr. Ashok Kumar */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="group relative flex flex-col"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-[3rem] blur-2xl transform group-hover:scale-105 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                            <div className="relative flex-1 p-8 md:p-12 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 overflow-hidden flex flex-col items-center text-center shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-black flex items-center justify-center mb-10 border border-purple-500/20 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3)] group-hover:-rotate-6 transition-transform duration-500">
                                    <User className="w-10 h-10 md:w-12 md:h-12 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                </div>

                                <div className="space-y-2 mb-8">
                                    <h3 className="text-purple-400 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Project Incharge</h3>
                                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-tight leading-tight">
                                        Mr. K. Ashok Kumar <span className="text-white/40 text-2xl md:text-3xl block mt-1 font-sans font-light tracking-widest uppercase">B.E.</span>
                                    </h2>
                                </div>

                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8 group-hover:via-purple-500/50 transition-colors duration-700" />

                                <div className="relative">
                                    <Sparkles className="absolute -top-6 -left-4 w-6 h-6 text-purple-500/20" />
                                    <p className="text-white/70 text-lg md:text-xl leading-relaxed font-serif italic">
                                        "Bridging the gap between conceptual excellence and industrial application."
                                    </p>
                                    <Sparkles className="absolute -bottom-6 -right-4 w-6 h-6 text-purple-500/20 rotate-180" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="relative py-20 px-6 md:py-32 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] via-black to-white/[0.03] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,180,0.05),transparent)]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-10 shadow-lg shadow-primary/5"
                            >
                                <Building2 className="w-4 h-4" />
                                Corporate Partnership
                            </motion.div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-7xl font-black tracking-[ -0.05em] uppercase italic text-white leading-none">
                                    JS CORPORATIONS
                                </h2>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-primary/40 hidden md:block" />
                                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[11px] md:text-sm">Technical Infrastructure Hub</span>
                                    <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-primary/40 hidden md:block" />
                                </div>
                            </div>

                            <p className="mt-12 text-white/80 text-sm md:text-base font-bold tracking-widest uppercase bg-white/5 px-8 py-4 rounded-full border border-white/10 backdrop-blur-md">
                                Innovation • Excellence • Future
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-20">
                        <Button
                            onClick={() => navigate("/")}
                            className="rounded-full px-12 h-16 text-lg font-black uppercase tracking-widest bg-white text-black hover:bg-primary hover:text-black transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            Return to Central Hub
                        </Button>
                    </motion.div>
                </motion.div>
            </main>

            <footer className="py-16 text-center text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                © 2026 <span className="text-primary">JS Corporations</span> X EmergentIQ
            </footer>
        </div>
    );
};

export default Guide;
