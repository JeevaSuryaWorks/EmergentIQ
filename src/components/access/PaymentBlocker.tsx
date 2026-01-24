import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const PaymentBlocker = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 text-center shadow-2xl overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                    <Lock className="w-8 h-8 text-primary" />
                </div>

                <h2 className="text-3xl font-playfair font-bold text-white mb-4">
                    Access Restricted
                </h2>
                
                <p className="text-white/60 mb-8 leading-relaxed">
                    This application is currently in a restricted viewing mode. <br/>
                    Please complete the required one-time access fee to unlock the full platform.
                </p>

                <div className="space-y-4">
                    <Button className="w-full h-12 text-base font-bold rounded-xl bg-primary text-black hover:bg-primary/90">
                        Unlock Access
                    </Button>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        Global Access Key Required
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
