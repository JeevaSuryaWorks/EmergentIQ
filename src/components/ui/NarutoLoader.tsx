import { motion } from "framer-motion";

export const NarutoLoader = () => {
    return (
        <div className="fixed inset-0 bg-[#020202] z-[100] flex items-center justify-center overflow-hidden">
            {/* Dynamic Background: Akatsuki Clouds Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='60' viewBox='0 0 100 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c-10 0-15 5-15 15s5 15 15 15h40c10 0 15-5 15-15s-5-15-15-15h-40z' fill='%23ff0000' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 120px'
                }} />
            </div>

            {/* Atmospheric Blood Rain / Particles */}
            <div className="absolute inset-0 z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 100 + "vw", opacity: 0 }}
                        animate={{
                            y: "100vh",
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        className="absolute w-[1px] h-10 bg-red-600/30"
                    />
                ))}
            </div>

            {/* Parallax Crows */}
            <div className="absolute inset-0 z-10">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: i % 2 === 0 ? "-20vw" : "120vw",
                            y: Math.random() * 100 + "vh",
                            scale: 0.5 + Math.random()
                        }}
                        animate={{
                            x: i % 2 === 0 ? "120vw" : "-20vw",
                            y: (Math.random() * 100 - 10) + "vh",
                            rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 3
                        }}
                        className="absolute"
                    >
                        <div className="w-12 h-12 text-black/80 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21,12C21,12 19,10 16,10C13,10 11,12 11,12C11,12 9,14 6,14C3,14 1,12 1,12C1,12 3,10 6,10C9,10 11,12 11,12C11,12 13,14 16,14C19,14 21,12 21,12Z" />
                                <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" opacity="0.3" />
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="relative z-20 flex flex-col items-center">
                {/* Itachi Mangekyou Sharingan Eye */}
                <div className="relative">
                    {/* External Outer Ring (Red Pulse) */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-8 border border-red-600 rounded-full blur-md"
                    />

                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 rounded-full bg-red-600 border-[6px] border-black flex items-center justify-center relative shadow-[0_0_80px_rgba(220,38,38,0.6)] group overflow-hidden"
                    >
                        {/* Pupil */}
                        <div className="w-12 h-12 bg-black rounded-full shadow-inner z-10" />

                        {/* Mangekyou Blades (Triquetra look) */}
                        <svg className="absolute inset-0 w-full h-full text-black pointer-events-none" viewBox="0 0 100 100">
                            <path
                                d="M50 20 C60 35 60 45 50 50 C40 45 40 35 50 20 Z"
                                fill="currentColor"
                                transform="rotate(0 50 50)"
                            />
                            <path
                                d="M50 20 C60 35 60 45 50 50 C40 45 40 35 50 20 Z"
                                fill="currentColor"
                                transform="rotate(120 50 50)"
                            />
                            <path
                                d="M50 20 C60 35 60 45 50 50 C40 45 40 35 50 20 Z"
                                fill="currentColor"
                                transform="rotate(240 50 50)"
                            />
                            <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </div>

                {/* Loading Text */}
                <div className="mt-16 text-center space-y-2">
                    <motion.h2
                        animate={{ opacity: [0.5, 1, 0.5], letterSpacing: ["0.2em", "0.4em", "0.2em"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-white font-black text-2xl tracking-[0.3em] uppercase"
                    >
                        Itachi <span className="text-red-600">Bloodline</span>
                    </motion.h2>
                    <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="text-white/40 text-xs font-mono tracking-widest uppercase italic"
                    >
                        "Reality is a Genjutsu"
                    </motion.p>
                </div>
            </div>

            {/* Red vignette overlay */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(127, 29, 29, 0.2) 100%)' }} />
        </div>
    );
};
