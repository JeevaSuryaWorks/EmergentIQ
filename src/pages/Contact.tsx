import { motion } from "framer-motion";
import { GraduationCap, Mail, MessageCircle, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Contact = () => {
    const navigate = useNavigate();

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            detail: "hello@emergent-iq.com",
            description: "For general inquiries and academic partnership requests."
        },
        {
            icon: MessageCircle,
            title: "Direct Chat",
            detail: "Available in Dashboard",
            description: "Instant assistance via our AI advisor for registered members."
        },
        {
            icon: MapPin,
            title: "Global Headquarters",
            detail: "Bengaluru, India",
            description: "Our core intelligence hub and development center."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,200,255,0.1),transparent)] pointer-events-none" />

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
                    <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter text-center">
                        Contact Us
                    </h1>
                    <p className="text-xl text-center text-white/60 mb-20 max-w-2xl mx-auto uppercase tracking-tighter font-black italic">
                        Let's navigate the future together.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {contactMethods.map((method, i) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="p-8 rounded-[3rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                                    <method.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{method.title}</h3>
                                <p className="text-primary font-black mb-4 tracking-tighter">{method.detail}</p>
                                <p className="text-sm text-white/40 leading-relaxed">{method.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 rounded-[4rem] bg-primary/5 border border-primary/10 text-center">
                        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter italic">Support Hours</h2>
                        <p className="text-white/40 font-medium">Monday — Friday: 9:00 AM - 6:00 PM (IST)</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Contact;
