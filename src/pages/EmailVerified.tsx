import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Hero3D } from "@/components/landing/Hero3D";

const EmailVerified = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/chat");
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
            {/* Dynamic 3D Background */}
            <Hero3D />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight mb-4">
                            Verification Successful
                        </h1>

                        <p className="text-white/60 mb-8 leading-relaxed max-w-sm mx-auto">
                            Thank you for joining **EmergentIQ**. Your account is now active and you can explore 10,000+ global institutions with AI-driven precision.
                        </p>

                        <div className="space-y-6 text-left mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Platform Access</h3>
                            <ul className="text-xs text-white/40 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    AI-Powered College Consultation
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    Interactive University Comparison
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    Global Academic Rankings (2025/26)
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => navigate("/chat")}
                            className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/20 text-xs px-8">
                            © {new Date().getFullYear()} EmergentIQ. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailVerified;
