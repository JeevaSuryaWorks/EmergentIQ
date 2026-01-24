import { useAppLock } from "@/hooks/useAppLock";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

const CashControl = () => {
    const { isUnlocked, isLoading, toggleLock } = useAppLock();

    const handleToggle = async (checked: boolean) => {
        try {
            await toggleLock(checked);
            toast.success(checked ? "Application Unlocked Globally" : "Application Locked (Payment Mode)");
        } catch (e) {
            toast.error("Failed to update settings");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto space-y-12">
                <div>
                    <h1 className="text-3xl font-playfair font-bold mb-2">Global Access Control</h1>
                    <p className="text-white/50">Manage application visibility and payment gating.</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 flex items-start justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {isUnlocked ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-red-500" />}
                            </div>
                            <h2 className="text-xl font-bold">Application Gate</h2>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                            When <strong>OFF</strong>, all public users will see the "Payment Required" block screen.
                            When <strong>ON</strong>, the application is open to everyone.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <Switch
                            checked={isUnlocked === true}
                            onCheckedChange={handleToggle}
                            className="data-[state=checked]:bg-green-500"
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isUnlocked ? 'text-green-500' : 'text-red-500'}`}>
                            {isUnlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3 text-sm text-blue-200">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <p>This control is persistent and updates in real-time for all connected clients. Changes here are immediate.</p>
                </div>
            </div>
        </div>
    );
};

export default CashControl;
