import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductionLoaderProps {
    className?: string;
    variant?: "full" | "inline";
    message?: string;
}

export const ProductionLoader = ({
    className,
    variant = "full",
    message = "Loading experience..."
}: ProductionLoaderProps) => {
    const isFull = variant === "full";

    return (
        <div className={cn(
            "flex flex-col items-center justify-center transition-all duration-500",
            isFull ? "fixed inset-0 bg-black/95 z-[100] backdrop-blur-sm" : "w-full py-12",
            className
        )}>
            <div className="relative flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-16 h-16 rounded-full bg-primary/20 blur-xl"
                />

                {/* Main Spinner */}
                <svg
                    className="w-12 h-12 text-primary"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.circle
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.1, rotate: 0 }}
                        animate={{
                            pathLength: [0.1, 0.8, 0.1],
                            rotate: 360
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.circle
                        cx="25"
                        cy="25"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </div>

            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-xs font-medium tracking-[0.3em] uppercase text-white/40 animate-pulse"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};
