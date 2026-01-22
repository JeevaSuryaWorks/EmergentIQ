import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Zap, Globe, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Careers = () => {
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
                    className="text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter">
                        Join the Vision
                    </h1>
                    <p className="text-xl text-white/50 mb-16 max-w-2xl mx-auto">
                        We're looking for the boldest minds to help us build the next generation of educational intelligence.
                    </p>

                    <div className="grid gap-6 text-left">
                        {[
                            { title: "Senior AI Engineer", type: "Remote", dept: "Engineering" },
                            { title: "Full Stack Developer", type: "Hybrid", dept: "Engineering" },
                            { title: "Product Designer", type: "Remote", dept: "Design" },
                            { title: "Data Scientist", type: "Remote", dept: "Data" },
                        ].map((job, i) => (
                            <motion.div
                                key={job.title}
                                whileHover={{ scale: 1.01 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex gap-4 text-sm text-white/30 uppercase tracking-widest font-black">
                                        <span>{job.type}</span>
                                        <span className="text-white/10">•</span>
                                        <span>{job.dept}</span>
                                    </div>
                                </div>
                                <Zap className="w-6 h-6 text-white/20 group-hover:text-primary transition-all group-hover:rotate-12" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 rounded-[3rem] bg-primary/5 border border-primary/20">
                        <h2 className="text-4xl font-bold mb-4">Don't see a perfect fit?</h2>
                        <p className="text-white/50 mb-8">We're always looking for talent. Send us your resume and we'll be in touch.</p>
                        <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 h-14 font-bold text-lg">
                            General Application
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Careers;
