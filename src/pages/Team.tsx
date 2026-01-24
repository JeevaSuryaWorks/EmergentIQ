import { motion } from "framer-motion";
import { GraduationCap, Users, Heart, Lightbulb, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Team = () => {
    const navigate = useNavigate();

    const values = [
        {
            icon: Heart,
            title: "Passion for Education",
            description: "We are driven by the belief that quality education is the cornerstone of societal progress."
        },
        {
            icon: Lightbulb,
            title: "Innovative Spirit",
            description: "We constantly push the boundaries of what's possible with AI and data to simplify the student journey."
        },
        {
            icon: Users,
            title: "Student-First",
            description: "Every decision we make is guided by how it helps students discover their potential."
        }
    ];

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
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter text-center italic">
                        The Visionaries
                    </h1>
                    <p className="text-xl text-center text-white/60 mb-16 max-w-2xl mx-auto uppercase tracking-widest font-bold">
                        Building the future of educational intelligence
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-primary/20 transition-all group"
                            >
                                <v.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{v.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32" />
                        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic">Our Collective Strength</h2>
                        <p className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto">
                            EmergentIQ is composed of a diverse team of educators, engineers, and designers who believe that technology should serve curiosity. We are united by our goal to democratize access to global educational data and empower students to make life-changing decisions with clarity.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Team;
