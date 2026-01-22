import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

import { Hero3D } from "@/components/landing/Hero3D";
import { Globe, GraduationCap, Github, Linkedin, Twitter, Mail, ExternalLink, Zap, Users, Trophy, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const NarutoBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
            {/* Deep Red Cosmic Mist */}
            <div className="absolute inset-0 opacity-20" style={{
                background: 'radial-gradient(circle at 50% 50%, #450a0a 0%, transparent 70%)'
            }} />

            {/* Blood Moon (Tsukuyomi) */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-red-600 via-red-900 to-black shadow-[0_0_100px_rgba(220,38,38,0.4)] flex items-center justify-center overflow-hidden"
            >
                {/* Moon Textures */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
                {/* Subtle Sharingan in Moon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 border-2 border-black/20 rounded-full flex items-center justify-center opacity-40"
                >
                    <div className="w-4 h-4 bg-black rounded-full" />
                    <div className="absolute top-4 w-3 h-6 bg-black rounded-full rotate-[15deg] origin-bottom" />
                    <div className="absolute bottom-4 left-10 w-3 h-6 bg-black rounded-full rotate-[135deg] origin-top" />
                    <div className="absolute bottom-4 right-10 w-3 h-6 bg-black rounded-full rotate-[255deg] origin-top" />
                </motion.div>
            </motion.div>

            {/* Parallax Layers of Crows & Feathers */}
            {[...Array(3)].map((_, layerIndex) => (
                <div key={layerIndex} className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={`${layerIndex}-${i}`}
                            initial={{
                                x: Math.random() > 0.5 ? "-20vw" : "120vw",
                                y: Math.random() * 100 + "vh",
                                scale: 0.2 + (layerIndex * 0.4),
                                opacity: 0
                            }}
                            animate={{
                                x: Math.random() > 0.5 ? "120vw" : "-20vw",
                                y: (Math.random() * 100 - 20) + "vh",
                                opacity: [0, 0.4 - (layerIndex * 0.1), 0]
                            }}
                            transition={{
                                duration: 10 + Math.random() * 20 - (layerIndex * 5),
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 3
                            }}
                            className="absolute"
                        >
                            <div className="text-black drop-shadow-[0_0_10px_rgba(220,38,38,0.3)] filter blur-[0.5px]">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ))}

            {/* Floating Ash/Embers */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`ember-${i}`}
                    initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
                    animate={{
                        y: "-10vh",
                        x: (Math.random() * 100 - 50) + "px",
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.2
                    }}
                    className="absolute w-1 h-1 bg-red-500 rounded-full blur-[1px] shadow-[0_0_5px_#ef4444]"
                />
            ))}

            {/* Horizontal Wind/Speed Lines */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`wind-${i}`}
                        initial={{ x: "-100vw", y: 20 + i * 15 + "vh" }}
                        animate={{ x: "100vw" }}
                        transition={{ duration: 12 + i * 5, repeat: Infinity, ease: "linear" }}
                        className="h-[1px] w-64 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                    />
                ))}
            </div>
        </div>
    );
};



const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (user) {
            navigate("/chat");
        }
    }, [user, navigate]);

    const isNaruto = theme === "light";

    return (
        <div className={cn(
            "min-h-screen transition-colors duration-700 selection:bg-primary/30 selection:text-primary relative overflow-x-hidden",
            isNaruto ? "bg-[#0a0a0a] text-white" : "bg-black text-white"
        )}>
            {isNaruto && <NarutoBackground />}
            <Header />


            <main className="relative pt-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 pt-32 pb-24 flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        {isNaruto && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-950/30 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.15)]"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse outline outline-offset-4 outline-red-600/30" />
                                Project Itachi: Genjutsu Edition
                            </motion.div>
                        )}
                        <h1 className={cn(
                            "text-7xl md:text-9xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent leading-[0.8] py-2 transition-all duration-1000",
                            isNaruto
                                ? "bg-gradient-to-b from-red-600 via-red-500 to-[#1a1a1a] drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
                                : "bg-gradient-to-b from-white via-white to-white/20"
                        )}>
                            EmergentIQ
                        </h1>
                        <p className="text-3xl md:text-4xl font-medium text-white/80 mb-8 tracking-tight">
                            Discover. Compare. <span className={cn("italic transition-colors duration-700", isNaruto ? "text-red-500" : "text-primary")}>Decide.</span>
                        </p>
                        <p className={cn(
                            "text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-700",
                            isNaruto ? "text-red-100/40" : "text-white/40"
                        )}>
                            The world's most advanced AI-powered global college intelligence platform.
                            Turn data into your competitive advantage.
                        </p>


                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                size="lg"
                                className={cn(
                                    "rounded-full px-10 h-14 text-lg font-bold transition-all",
                                    isNaruto
                                        ? "bg-red-700 text-white hover:bg-red-600 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
                                )}
                                onClick={() => navigate("/auth")}
                            >
                                <Zap className="mr-2 w-5 h-5 fill-current" />
                                Get Started
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-10 h-14 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white backdrop-blur-sm"
                                onClick={() => navigate("/auth")}
                            >
                                Sign In
                            </Button>
                        </div>
                    </motion.div>
                </section>

                <Hero3D />

                {/* Why EmergentIQ */}
                <section className={cn(
                    "container mx-auto px-4 py-32 transition-colors duration-1000",
                    isNaruto ? "bg-gradient-to-b from-transparent via-red-950/20 to-transparent" : "bg-gradient-to-b from-transparent to-primary/5"
                )}>
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className={cn(
                            "text-4xl md:text-5xl font-bold mb-6 tracking-tight",
                            isNaruto && "text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                        )}>Why EmergentIQ?</h2>
                        <p className={cn(
                            "text-xl transition-colors",
                            isNaruto ? "text-red-100/30" : "text-white/60"
                        )}>
                            We combine local expertise with global data to give you the most accurate university insights.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={cn(
                            "p-8 rounded-3xl border transition-all duration-500 flex gap-6 items-start group",
                            isNaruto
                                ? "bg-red-950/10 border-red-900/20 hover:border-red-500/50 hover:bg-red-900/20"
                                : "bg-white/5 border-white/10 hover:border-primary/50"
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                                isNaruto ? "bg-red-600/20 text-red-500" : "bg-primary/20 text-primary"
                            )}>
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={cn("text-xl font-semibold mb-2", isNaruto && "text-red-100")}>Global Data</h3>
                                <p className={cn("text-sm leading-relaxed", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                    Access information from over 10,000 universities across 150+ countries.
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "p-8 rounded-3xl border transition-all duration-500 flex gap-6 items-start group",
                            isNaruto
                                ? "bg-red-950/10 border-red-900/20 hover:border-red-500/50 hover:bg-red-900/20"
                                : "bg-white/5 border-white/10 hover:border-primary/50"
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                                isNaruto ? "bg-red-600/20 text-red-500" : "bg-primary/20 text-primary"
                            )}>
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={cn("text-xl font-semibold mb-2", isNaruto && "text-red-100")}>AI + Verified Sources</h3>
                                <p className={cn("text-sm leading-relaxed", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                    Our AI cross-references data with official university records for maximum accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Team Section */}
                <section className="container mx-auto px-4 py-32 border-t border-white/5 relative overflow-hidden">
                    {/* Background Accents */}
                    <div className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] -z-10 transition-colors duration-1000",
                        isNaruto ? "bg-red-900/10" : "bg-primary/5"
                    )} />

                    <div className="max-w-4xl mx-auto text-center mb-24 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.2em] mb-6",
                                isNaruto ? "bg-red-950/30 border-red-500/30 text-red-500" : "bg-white/5 border-white/10 text-primary"
                            )}
                        >
                            <Trophy className="w-4 h-4" />
                            {isNaruto ? "The Akatsuki Council" : "Our Visionaries"}
                        </motion.div>
                        <h2 className={cn(
                            "text-5xl md:text-6xl font-black mb-6 tracking-tight transition-colors",
                            isNaruto ? "text-red-100" : "text-white"
                        )}>{isNaruto ? "Led by Legends" : "Built by Pioneers"}</h2>
                        <p className={cn(
                            "text-xl max-w-2xl mx-auto transition-colors",
                            isNaruto ? "text-red-100/30" : "text-white/40"
                        )}>The engineering minds pushing the boundaries of AI-driven education technology.</p>
                    </div>

                    {/* Project Guide Feature */}
                    <div className="max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                                "p-[1px] rounded-[3rem] relative group shadow-2xl transition-all duration-1000",
                                isNaruto
                                    ? "bg-gradient-to-r from-transparent via-red-600/50 to-transparent"
                                    : "bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                                isNaruto ? "bg-red-600/20" : "bg-primary/20"
                            )} />
                            <div className="relative bg-black/80 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-12">
                                <div className={cn(
                                    "w-32 h-32 md:w-40 md:h-40 rounded-full p-1 shrink-0 bg-gradient-to-br",
                                    isNaruto ? "from-red-600 to-black" : "from-primary to-purple-600"
                                )}>
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <GraduationCap className={cn(
                                            "w-16 h-16 md:w-20 md:h-20 animate-pulse transition-colors",
                                            isNaruto ? "text-red-600" : "text-primary"
                                        )} />
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className={cn(
                                        "font-black uppercase tracking-[0.3em] text-xs mb-3 transition-colors",
                                        isNaruto ? "text-red-500" : "text-primary"
                                    )}>Project Guide</div>
                                    <h3 className={cn(
                                        "text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white group-hover:transition-colors",
                                        isNaruto ? "group-hover:text-red-500" : "group-hover:text-primary"
                                    )}>Mrs. G. Mehala M.E.</h3>
                                    <p className={cn(
                                        "text-lg leading-relaxed max-w-xl transition-colors",
                                        isNaruto ? "text-red-100/40" : "text-white/60"
                                    )}>
                                        "A visionary mentor providing strategic guidance and academic excellence to shape the future of educational intelligence."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {[
                            { name: "Boopathi Pandiyan", role: "Team Lead", bio: "Architecting the technical core and orchestrating systemic growth.", special: true },
                            { name: "Alwin Nishanth", role: "Developer", bio: "Crafting seamless full-stack interactions and user-centric architecture." },
                            { name: "Karthik M", role: "Developer", bio: "Optimizing data lifecycles and building high-performance API structures." },
                            { name: "Abinesh K", role: "Developer", bio: "Pioneering AI integrations and creating hyper-responsive interfaces." }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -12 }}
                                className={cn(
                                    "relative p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 overflow-hidden",
                                    member.special
                                        ? isNaruto
                                            ? "bg-gradient-to-b from-red-600/20 via-red-900/5 to-transparent border border-red-500/30 shadow-[0_0_50px_-15px_rgba(220,38,38,0.4)]"
                                            : "bg-gradient-to-b from-primary/20 via-primary/5 to-transparent border border-primary/30 shadow-[0_0_50px_-15px_rgba(59,130,246,0.4)]"
                                        : isNaruto
                                            ? "bg-red-950/10 border-red-900/20 hover:border-red-500/40 hover:bg-red-900/10"
                                            : "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                                )}
                            >
                                {member.special && (
                                    <>
                                        <div className={cn(
                                            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent",
                                            isNaruto ? "via-red-500" : "via-primary"
                                        )} />
                                        <motion.div
                                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className={cn(
                                                "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl",
                                                isNaruto ? "bg-red-600/20" : "bg-primary/20"
                                            )}
                                        />
                                    </>
                                )}

                                <div className={cn(
                                    "w-20 h-20 rounded-2xl flex items-center justify-center mb-8 relative transition-all duration-500",
                                    member.special
                                        ? isNaruto ? "bg-red-600 text-white scale-110 shadow-2xl shadow-red-600/20" : "bg-primary text-white scale-110 shadow-2xl shadow-primary/20"
                                        : isNaruto ? "bg-red-950/30 text-red-500" : "bg-white/5 text-primary"
                                )}>
                                    {member.special ? <Shield className="w-10 h-10" /> : <Users className="w-10 h-10" />}
                                    {member.special && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={cn(
                                                "absolute inset-0 rounded-2xl border-2",
                                                isNaruto ? "border-red-500/50" : "border-primary/50"
                                            )}
                                        />
                                    )}
                                </div>

                                <motion.div className="space-y-2">
                                    <h3 className={cn("text-2xl font-bold tracking-tight transition-colors", isNaruto && "text-red-100")}>{member.name}</h3>
                                    <div className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full inline-block transition-colors",
                                        member.special
                                            ? isNaruto ? "bg-red-600 text-white" : "bg-primary text-white"
                                            : isNaruto ? "bg-red-950/40 text-red-500" : "bg-white/10 text-primary"
                                    )}>
                                        {member.role}
                                    </div>
                                </motion.div>

                                <p className={cn(
                                    "mt-6 text-sm leading-relaxed transition-colors",
                                    isNaruto ? "text-red-100/30 font-medium" : "text-white/40"
                                )}>
                                    {member.bio}
                                </p>

                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="container mx-auto px-4 py-32 text-center">
                    <div className={cn(
                        "p-16 rounded-[3rem] relative overflow-hidden group transition-all duration-1000",
                        isNaruto ? "bg-red-900 shadow-[0_0_100px_rgba(220,38,38,0.3)]" : "bg-primary"
                    )}>
                        <div className={cn(
                            "absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] transition-all duration-700",
                            isNaruto ? "bg-black/40 group-hover:bg-black/60" : "bg-white/10 group-hover:bg-white/20"
                        )} />
                        <div className={cn(
                            "absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]",
                            isNaruto ? "bg-black/20" : "bg-black/10"
                        )} />

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to find your future?</h2>
                            <p className={cn(
                                "text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium transition-colors",
                                isNaruto ? "text-red-100/80" : "text-white/80"
                            )}>
                                Join 10,000+ students making smarter, data-driven college decisions today.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                className={cn(
                                    "rounded-full px-12 h-16 text-xl font-bold transition-all shadow-2xl hover:scale-110",
                                    isNaruto
                                        ? "bg-black text-white hover:bg-black/80 hover:-rotate-2 border border-red-500/30"
                                        : "bg-white text-primary hover:bg-white/90 hover:rotate-2"
                                )}
                                onClick={() => navigate("/auth")}
                            >
                                Create your free account
                            </Button>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className={cn(
                "border-t pt-20 pb-10 relative z-10 transition-colors duration-1000",
                isNaruto ? "bg-[#050505] border-red-900/20" : "bg-black border-white/5"
            )}>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="font-bold text-xl tracking-tight">EmergentIQ</span>
                            </Link>
                            <p className={cn(
                                "text-sm leading-relaxed mb-8 transition-colors",
                                isNaruto ? "text-red-100/30" : "text-white/40"
                            )}>
                                Empowering students worldwide with AI-driven insights to navigate their educational future.
                            </p>
                            <div className="flex gap-4">

                                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className={cn(
                                "font-bold mb-6 uppercase text-xs tracking-widest transition-colors",
                                isNaruto ? "text-red-500" : "text-white"
                            )}>Platform</h4>
                            <ul className={cn("space-y-4 text-sm transition-colors", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                <li><Link to="/chat" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>College Advisor</Link></li>
                                <li><Link to="/compare" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Compare Tool</Link></li>
                                <li><Link to="/saved" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Saved List</Link></li>
                                <li><Link to="/rankings" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Global Rankings</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={cn(
                                "font-bold mb-6 uppercase text-xs tracking-widest transition-colors",
                                isNaruto ? "text-red-500" : "text-white"
                            )}>Company</h4>
                            <ul className={cn("space-y-4 text-sm transition-colors", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                <li><Link to="/about" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>About Us</Link></li>
                                <li><Link to="/careers" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Careers</Link></li>
                                <li><Link to="/guide" className={cn("transition-colors font-bold", isNaruto ? "text-red-500 hover:text-red-400" : "text-primary hover:text-primary/80")}>Guide Appreciation</Link></li>
                                <li><Link to="/privacy" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={cn(
                                "font-bold mb-6 uppercase text-xs tracking-widest transition-colors",
                                isNaruto ? "text-red-500" : "text-white"
                            )}>Legal</h4>
                            <ul className={cn("space-y-4 text-sm transition-colors", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                <li><Link to="/terms" className={cn("transition-colors", isNaruto ? "hover:text-red-500" : "hover:text-primary")}>Terms of Service</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
                            <p className="text-sm text-white/40 mb-4">Stay updated with the latest in EDU-tech.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-primary transition-colors"
                                />
                                <Button size="sm" className="rounded-lg">Join</Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-white/20">
                        <p>© 2026 EmergentIQ Inc. All rights reserved.</p>
                        <p className="mt-4 md:mt-0">Designed for the futuristic student.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
