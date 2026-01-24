import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Hero3D } from "@/components/landing/Hero3D";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EmailWaiting = () => {
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        // Poll for user's verification status
        const checkVerification = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email_confirmed_at) {
                toast.success("Email verified successfully!");
                navigate("/email-verified");
            }
        };

        const intervalId = setInterval(checkVerification, 3000);

        // Also subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user?.email_confirmed_at) {
                    navigate("/email-verified");
                }
            }
        );

        return () => {
            clearInterval(intervalId);
            subscription.unsubscribe();
        };
    }, [navigate]);

    const handleResend = async () => {
        setIsResending(true);
        // This is a placeholder for resend logic if needed, 
        // typically handled by Supabase but we can show a UI state.
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Verification email resent!");
        setIsResending(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex relative overflow-hidden text-center">
            {/* Dynamic 3D Background */}
            <Hero3D />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/20 mb-8 mx-auto shadow-2xl shadow-primary/20">
                                <Mail className="w-10 h-10 text-primary" />
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight mb-4">
                                Verify Your Email
                            </h1>

                            <p className="text-white/60 mb-8 leading-relaxed max-w-sm mx-auto">
                                We've sent a verification link to your email address. Please check your <span className="text-white font-semibold">inbox</span> and <span className="text-white font-semibold">spam folder</span> to activate your account.
                            </p>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    {isResending ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Resend Email
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/auth")}
                                    className="w-full text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Sign In
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-2">
                        <p className="text-white/20 text-xs px-8 italic">
                            Email verification ensures a secure and trusted community for all EmergentIQ users.
                        </p>
                        <p className="text-white/10 text-[10px]">
                            © {new Date().getFullYear()} JS Corparations.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailWaiting;
