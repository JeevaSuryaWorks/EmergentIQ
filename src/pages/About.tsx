import { motion } from "framer-motion";
import { GraduationCap, Users, Target, Rocket, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
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

            <main className="pt-32 pb-20 px-6 container max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-12 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter text-center">
                        Our Mission
                    </h1>

                    <div className="space-y-12 text-lg text-white/60 leading-relaxed">
                        <p>
                            EmergentIQ was born out of a simple realization: the path to higher education is more complex than ever. Founded by a team of visionary developers and data scientists, we set out to build the world's most advanced educational intelligence platform.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-20">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                <Users className="w-8 h-8 text-primary mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Community Focused</h3>
                                <p className="text-sm">We believe that every student, regardless of their background, deserves access to high-quality institutional data.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                <Target className="w-8 h-8 text-primary mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Data Driven</h3>
                                <p className="text-sm">Our platform leverages the latest in AI and machine learning to provide real-time updates and accurate forecasting.</p>
                            </div>
                        </div>

                        <p>
                            Today, we serve thousands of students worldwide, helping them navigate the complexities of admissions, fees, and rankings with confidence. Our journey is just beginning, and we remain dedicated to our core belief: that intelligence should empower discovery.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default About;
