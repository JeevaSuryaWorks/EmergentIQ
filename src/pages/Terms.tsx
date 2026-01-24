import { motion } from "framer-motion";
import { GraduationCap, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(100,200,255,0.03),transparent)] pointer-events-none" />

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

            <main className="pt-32 pb-20 px-6 container max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <FileText className="w-10 h-10 text-primary" />
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter">
                            Terms of Service
                        </h1>
                    </div>

                    <div className="space-y-12 text-white/50 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using EmergentIQ, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
                            <p>Permission is granted to temporarily access the materials on EmergentIQ for personal, non-commercial educational guidance only. You may not modify, copy, or attempt to decompile any software contained on the platform.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. AI Limitations</h2>
                            <p>The information provided by our AI models is for general guidance only. While we strive for accuracy, users are responsible for verifying critical data (like fees and deadlines) directly with the respective institutions.</p>
                        </section>

                        <section className="pt-10 border-t border-white/5">
                            <p className="text-sm">Last Updated: January 2026. For questions regarding these terms, please contact js@emergentiq.com</p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Terms;
