import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, GraduationCap, ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero3D } from "@/components/landing/Hero3D";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp, user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate("/admin", { replace: true });
            } else {
                const from = (location.state as any)?.from?.pathname || "/chat";
                navigate(from, { replace: true });
            }
        }
    }, [user, isAdmin, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("Welcome back!");
                }
            } else {
                const { error } = await signUp(email, password, fullName, {
                    emailRedirectTo: `${window.location.origin}/email-verified`
                });
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("Verification email sent!");
                    navigate("/email-waiting");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
            {/* Dynamic 3D Background */}
            <Hero3D />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center p-6 md:p-8">
                {/* Logo/Back Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-6 md:top-8 md:left-8"
                >
                    <Button
                        variant="ghost"
                        className="text-white/60 hover:text-white hover:bg-white/10 px-3 md:px-4"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-6 md:mb-8 mt-12 md:mt-0">
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary mb-4 md:mb-6 shadow-2xl shadow-primary/20">
                            <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            {isLogin ? "Welcome Back" : "Join EmergentIQ"}
                        </h1>
                        <p className="text-sm md:text-base text-white/50 px-4">
                            {isLogin
                                ? "Experience the future of college discovery."
                                : "Your journey towards the perfect education starts here."}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl shadow-2xl mx-1 md:mx-0">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        key="signup-fields"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="fullName" className="text-white/70">Full Name</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                            <Input
                                                id="fullName"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                placeholder="John Doe"
                                                className="bg-white/5 border-white/10 pl-10 h-12 focus:ring-primary/50"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/70">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        className="bg-white/5 border-white/10 pl-10 h-12 focus:ring-primary/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/70">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 pl-10 pr-10 h-12 focus:ring-primary/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : isLogin ? (
                                    "Sign In"
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-white/40 hover:text-primary transition-colors text-sm font-medium"
                                disabled={isLoading}
                            >
                                {isLogin
                                    ? "Don't have an account? Sign up for free"
                                    : "Already using EmergentIQ? Sign in here"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/20 text-xs px-8">
                            By continuing, you agree to EmergentIQ's Terms of Service and Privacy Policy. Verified data provided by global institutions.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
