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
                <section className="container mx-auto px-6 pt-16 md:pt-32 pb-16 md:pb-24 flex flex-col items-center text-center relative z-10">
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
                                className="mb-6 md:mb-8 inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-full bg-red-950/30 border border-red-500/30 text-red-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.15)]"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse outline outline-offset-4 outline-red-600/30" />
                                Project Itachi: Genjutsu Edition
                            </motion.div>
                        )}
                        <h1 className={cn(
                            "text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent leading-[0.9] md:leading-[0.8] py-2 transition-all duration-1000",
                            isNaruto
                                ? "bg-gradient-to-b from-red-600 via-red-500 to-[#1a1a1a] drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
                                : "bg-gradient-to-b from-white via-white to-white/20"
                        )}>
                            EmergentIQ
                        </h1>
                        <p className="text-2xl md:text-4xl font-medium text-white/80 mb-6 md:mb-8 tracking-tight">
                            Discover. Compare. <span className={cn("italic transition-colors duration-700", isNaruto ? "text-red-500" : "text-primary")}>Decide.</span>
                        </p>
                        <p className={cn(
                            "text-base md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-700 px-4 md:px-0",
                            isNaruto ? "text-red-100/40" : "text-white/40"
                        )}>
                            The world's most advanced AI-powered global college intelligence platform.
                            Turn data into your competitive advantage.
                        </p>


                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full max-w-sm sm:max-w-none px-6 sm:px-0">
                            <Button
                                size="lg"
                                className={cn(
                                    "rounded-full px-8 md:px-10 h-14 text-base md:text-lg font-bold transition-all w-full sm:w-auto",
                                    isNaruto
                                        ? "bg-red-700 text-white hover:bg-red-600 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
                                )}
                                onClick={() => navigate("/auth")}
                            >
                                <Zap className="mr-2 w-5 h-5 fill-current shrink-0" />
                                Get Started
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8 md:px-10 h-14 text-base md:text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white backdrop-blur-sm w-full sm:w-auto"
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
                    "container mx-auto px-6 py-20 md:py-32 transition-colors duration-1000",
                    isNaruto ? "bg-gradient-to-b from-transparent via-red-950/20 to-transparent" : "bg-gradient-to-b from-transparent to-primary/5"
                )}>
                    <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 px-4 md:px-0">
                        <h2 className={cn(
                            "text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight",
                            isNaruto && "text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                        )}>Why EmergentIQ?</h2>
                        <p className={cn(
                            "text-base md:text-xl transition-colors opacity-80",
                            isNaruto ? "text-red-100/30" : "text-white/60"
                        )}>
                            We combine local expertise with global data to give you the most accurate university insights.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-0">
                        <div className={cn(
                            "p-6 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-500 flex flex-col sm:flex-row gap-4 md:gap-6 items-start group",
                            isNaruto
                                ? "bg-red-950/10 border-red-900/20 hover:border-red-500/50 hover:bg-red-900/20"
                                : "bg-white/5 border-white/10 hover:border-primary/50"
                        )}>
                            <div className={cn(
                                "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                                isNaruto ? "bg-red-600/20 text-red-500" : "bg-primary/20 text-primary"
                            )}>
                                <Globe className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className={cn("text-lg md:text-xl font-semibold mb-2", isNaruto && "text-red-100")}>Global Data</h3>
                                <p className={cn("text-sm md:text-base leading-relaxed opacity-60", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                    Access information from over 10,000 universities across 150+ countries.
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "p-6 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-500 flex flex-col sm:flex-row gap-4 md:gap-6 items-start group",
                            isNaruto
                                ? "bg-red-950/10 border-red-900/20 hover:border-red-500/50 hover:bg-red-900/20"
                                : "bg-white/5 border-white/10 hover:border-primary/50"
                        )}>
                            <div className={cn(
                                "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                                isNaruto ? "bg-red-600/20 text-red-500" : "bg-primary/20 text-primary"
                            )}>
                                <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className={cn("text-lg md:text-xl font-semibold mb-2", isNaruto && "text-red-100")}>AI + Verified Sources</h3>
                                <p className={cn("text-sm md:text-base leading-relaxed opacity-60", isNaruto ? "text-red-100/30" : "text-white/40")}>
                                    Our AI cross-references data with official university records for maximum accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Team Section */}
                <section className="container mx-auto px-6 py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
                    {/* Background Accents */}
                    <div className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] rounded-full blur-[60px] md:blur-[120px] -z-10 transition-colors duration-1000",
                        isNaruto ? "bg-red-900/10" : "bg-primary/5"
                    )} />

                    <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 relative px-4 md:px-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6",
                                isNaruto ? "bg-red-950/30 border-red-500/30 text-red-500" : "bg-white/5 border-white/10 text-primary"
                            )}
                        >
                            <Trophy className="w-4 h-4" />
                            {isNaruto ? "The Akatsuki Council" : "Our Visionaries"}
                        </motion.div>
                        <h2 className={cn(
                            "text-3xl md:text-6xl font-black mb-6 tracking-tight transition-colors",
                            isNaruto ? "text-red-100" : "text-white"
                        )}>{isNaruto ? "Led by Legends" : "Built by Pioneers"}</h2>
                        <p className={cn(
                            "text-base md:text-xl max-w-2xl mx-auto transition-colors opacity-60",
                            isNaruto ? "text-red-100/30" : "text-white/40"
                        )}>The engineering minds pushing the boundaries of AI-driven education technology.</p>
                    </div>

                    {/* Project Guide Feature */}
                    <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-4 md:px-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                                "p-[1px] rounded-[2rem] md:rounded-[3rem] relative group shadow-2xl transition-all duration-1000",
                                isNaruto
                                    ? "bg-gradient-to-r from-transparent via-red-600/50 to-transparent"
                                    : "bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 blur-xl md:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                                isNaruto ? "bg-red-600/20" : "bg-primary/20"
                            )} />
                            <div className="relative bg-black/80 backdrop-blur-2xl p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className={cn(
                                    "w-24 h-24 md:w-40 md:h-40 rounded-full p-1 shrink-0 bg-gradient-to-br",
                                    isNaruto ? "from-red-600 to-black" : "from-primary to-purple-600"
                                )}>
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <GraduationCap className={cn(
                                            "w-12 h-12 md:w-20 md:h-20 animate-pulse transition-colors",
                                            isNaruto ? "text-red-600" : "text-primary"
                                        )} />
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className={cn(
                                        "font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs mb-3 transition-colors opacity-80",
                                        isNaruto ? "text-red-500" : "text-primary"
                                    )}>Project Guide</div>
                                    <h3 className={cn(
                                        "text-2xl md:text-4xl font-bold mb-4 tracking-tight text-white group-hover:transition-colors",
                                        isNaruto ? "group-hover:text-red-500" : "group-hover:text-primary"
                                    )}>Mrs. G. Mehala M.E.</h3>
                                    <p className={cn(
                                        "text-sm md:text-lg leading-relaxed max-w-xl transition-colors opacity-60",
                                        isNaruto ? "text-red-100/40" : "text-white/60"
                                    )}>
                                        "A visionary mentor providing strategic guidance and academic excellence to shape the future of educational intelligence."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto px-6 md:px-0">
                        {[
                            {
                                name: "Boopathi Pandiyan",
                                role: "Team Lead",
                                bio: "Architecting the technical core and orchestrating systemic growth.",
                                special: true,
                                theme: "itachi"
                            },
                            {
                                name: "Alwin Nishanth",
                                role: "Developer",
                                bio: "Crafting seamless full-stack interactions and user-centric architecture.",
                                theme: "professional"
                            },
                            {
                                name: "Karthik M",
                                role: "Developer",
                                bio: "Optimizing data lifecycles and building high-performance API structures.",
                                theme: "professional"
                            },
                            {
                                name: "Abinesh K",
                                role: "Developer",
                                bio: "Pioneering AI integrations and creating hyper-responsive interfaces.",
                                theme: "professional"
                            }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ y: -15, transition: { duration: 0.3 } }}
                                className={cn(
                                    "relative p-8 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center text-center transition-all duration-700 overflow-hidden group",
                                    member.special
                                        ? "bg-[#050505] border border-red-900/30 shadow-[0_0_80px_-20px_rgba(153,27,27,0.3)]"
                                        : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                                )}
                            >
                                {/* Special Lead Aura (Abstract Itachi) */}
                                {member.special && (
                                    <>
                                        {/* Deep Crimson Depth Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />

                                        {/* Abstract "Crows" / Feather Trails */}
                                        {[...Array(4)].map((_, feather) => (
                                            <motion.div
                                                key={feather}
                                                animate={{
                                                    y: [-20, 20],
                                                    x: [-10, 10],
                                                    opacity: [0, 0.4, 0],
                                                    scale: [0.8, 1.2, 0.8]
                                                }}
                                                transition={{
                                                    duration: 3 + feather,
                                                    repeat: Infinity,
                                                    delay: feather * 0.5,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute w-2 h-6 bg-red-600/10 blur-md rounded-full"
                                                style={{
                                                    top: `${20 + (feather * 15)}%`,
                                                    left: `${15 + (feather * 20)}%`
                                                }}
                                            />
                                        ))}

                                        {/* Mangekyou Pulse Border */}
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-px rounded-[2rem] md:rounded-[3rem] border border-red-600/10 pointer-events-none"
                                        />
                                    </>
                                )}

                                {/* Avatar Container */}
                                <div className={cn(
                                    "w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110",
                                    member.special
                                        ? "bg-gradient-to-br from-[#1a0000] to-black border border-red-600/40 shadow-[0_0_30px_rgba(153,27,27,0.4)]"
                                        : "bg-white/5 border border-white/10 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]"
                                )}>
                                    {member.special ? (
                                        <Shield className="w-10 h-10 md:w-12 md:h-12 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                                    ) : (
                                        <Users className="w-10 h-10 md:w-12 md:h-12 text-white/20 group-hover:text-primary transition-colors duration-500" />
                                    )}

                                    {/* Abstract Lead Orbitals */}
                                    {member.special && (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-2 border-t-2 border-l-2 border-red-600/20 rounded-full"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="relative z-10 space-y-3">
                                    <div className={cn(
                                        "text-[10px] md:text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full inline-block mb-2",
                                        member.special
                                            ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                            : "bg-white/5 text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500"
                                    )}>
                                        {member.role}
                                    </div>
                                    <h3 className={cn(
                                        "text-2xl md:text-3xl font-bold tracking-tighter transition-colors duration-500",
                                        member.special ? "text-white" : "text-white group-hover:text-primary"
                                    )}>
                                        {member.name}
                                    </h3>
                                    <p className={cn(
                                        "text-sm md:text-base leading-relaxed opacity-40 font-medium max-w-[200px] mx-auto transition-opacity duration-500 group-hover:opacity-80",
                                        member.special ? "text-red-100/40 group-hover:text-red-100/80" : "text-white/40 group-hover:text-white/80"
                                    )}>
                                        {member.bio}
                                    </p>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="container mx-auto px-6 py-20 md:py-32 text-center relative z-20">
                    <div className={cn(
                        "p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group transition-all duration-1000",
                        isNaruto ? "bg-red-900 shadow-[0_0_100px_rgba(220,38,38,0.3)]" : "bg-primary"
                    )}>
                        <div className={cn(
                            "absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] md:blur-[120px] transition-all duration-700",
                            isNaruto ? "bg-black/40 group-hover:bg-black/60" : "bg-white/10 group-hover:bg-white/20"
                        )} />
                        <div className={cn(
                            "absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px] md:blur-[80px]",
                            isNaruto ? "bg-black/20" : "bg-black/10"
                        )} />

                        <div className="relative z-10 px-4 md:px-0">
                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-tight">Ready to find your future?</h2>
                            <p className={cn(
                                "text-base md:text-xl md:text-2xl mb-10 md:mb-12 max-w-2xl mx-auto font-medium transition-colors opacity-90",
                                isNaruto ? "text-red-100/80" : "text-white/80"
                            )}>
                                Join 10,000+ students making smarter, data-driven college decisions today.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                className={cn(
                                    "rounded-full px-8 md:px-12 h-14 md:h-16 text-lg md:text-xl font-bold transition-all shadow-2xl hover:scale-110 w-full sm:w-auto",
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
