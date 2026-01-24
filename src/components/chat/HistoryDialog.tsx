import { useNavigate, useSearchParams } from "react-router-dom";
import { useChatHistory } from "@/hooks/useChatHistory";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Search,
    Trash2,
    Calendar,
    ArrowLeft,
    MoreVertical,
    Pencil,
    ExternalLink,
    X,
    Clock,
    RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const HistoryDialog = ({ open, onOpenChange }: HistoryDialogProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentSessionId = searchParams.get("session");
    const { sessions, isLoading, refreshSessions, deleteSession, renameSession } = useChatHistory();
    const [searchQuery, setSearchQuery] = useState("");

    // Rename state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const filteredSessions = useMemo(() =>
        sessions.filter(session =>
            (session.session_name || session.last_message || "").toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [sessions, searchQuery]);

    const handleRename = async (sessionId: string) => {
        if (!editValue.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await renameSession(sessionId, editValue.trim());
            setEditingId(null);
            toast.success("Archive identified with new signature");
        } catch (e) {
            toast.error("Renaming failed");
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("ARE YOU SURE YOU WANT TO ERASE THIS ARCHIVE?")) {
            try {
                await deleteSession(id);
                toast.success("Archive purged from core memory");
            } catch (err) {
                toast.error("Standard deletion failed");
            }
        }
    };

    const handleRestore = (id: string) => {
        if (editingId) return; // Don't navigate while editing
        navigate(`/chat?session=${id}`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent hideClose className="max-w-4xl bg-[#080808] border-none backdrop-blur-3xl p-0 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-primary/10 h-[92vh] md:h-[85vh]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,180,0.05),transparent)] pointer-events-none" />

                {/* Prominent Custom Close Button - NOW THE ONLY ONE */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-6 top-6 md:right-8 md:top-8 z-50 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white/40 hover:text-white transition-all active:scale-95 group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="p-6 md:p-12 h-full flex flex-col relative z-10">
                    <DialogHeader className="mb-6 md:mb-8 shrink-0 pr-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">History Hub</DialogTitle>
                                <DialogDescription className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate text-left">Academic Discovery Archive</DialogDescription>
                            </div>
                            <div className="ml-auto md:ml-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        refreshSessions();
                                    }}
                                    className="rounded-xl hover:bg-white/5 text-white/40 hover:text-primary transition-all h-8 w-8 md:h-10 md:w-10"
                                >
                                    <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin text-primary")} />
                                </Button>
                            </div>
                        </div>

                        <div className="relative mt-4 md:mt-8 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-all" />
                            <Input
                                placeholder="IDENTIFY PAST EXPEDITION..."
                                className="bg-white/5 border-white/10 pl-14 h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] text-[10px] md:text-[11px] font-black tracking-widest focus-visible:ring-primary/50 transition-all uppercase placeholder:text-white/10 border-none shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                        {isLoading && sessions.length === 0 ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                                ))}
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
                                <MessageSquare className="w-10 h-10 text-white/5 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">No matching archives identified</p>
                            </div>
                        ) : (
                            <div className="space-y-3 animate-fade-in">
                                {filteredSessions.map((session, i) => (
                                    <motion.div
                                        key={session.session_id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                    >
                                        <div
                                            onClick={() => handleRestore(session.session_id)}
                                            className={cn(
                                                "group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 px-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden gap-4",
                                                currentSessionId === session.session_id
                                                    ? "bg-primary/5 border-primary/20"
                                                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                                                    currentSessionId === session.session_id
                                                        ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,180,0.3)]"
                                                        : "bg-white/5 text-white/40 border-white/5 group-hover:border-primary/50 group-hover:text-primary"
                                                )}>
                                                    <MessageSquare className="w-5 h-5" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {editingId === session.session_id ? (
                                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                            <Input
                                                                autoFocus
                                                                value={editValue}
                                                                onChange={e => setEditValue(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === "Enter") handleRename(session.session_id);
                                                                    if (e.key === "Escape") setEditingId(null);
                                                                }}
                                                                className="h-9 bg-black/40 border-primary/30 text-xs font-bold uppercase tracking-widest text-white rounded-lg px-3 focus-visible:ring-primary/50"
                                                            />
                                                            <div className="flex gap-1">
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => handleRename(session.session_id)}>
                                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                                </Button>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => setEditingId(null)}>
                                                                    <X className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="text-sm md:text-base font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors line-clamp-1">
                                                                {session.session_name || "Untitled Voyage"}
                                                            </h4>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1.5 shrink-0">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {session.created_at ? format(new Date(session.created_at), 'MMM dd, yyyy') : 'UNKNOWN'}
                                                                </span>
                                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 truncate hidden md:block">
                                                                    {session.last_message || "Awaiting transmission..."}
                                                                </span>
                                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 line-clamp-1 md:hidden">
                                                                    {session.last_message || "Awaiting transmission..."}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 justify-end shrink-0" onClick={e => e.stopPropagation()}>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all opacity-100 md:opacity-40 md:group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(session.session_id);
                                                        setEditValue(session.session_name || session.last_message || "");
                                                    }}
                                                    title="Rename Archive"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 md:text-white/20 md:hover:text-red-500 transition-all opacity-100 md:opacity-40 md:group-hover:opacity-100"
                                                    onClick={(e) => handleDelete(e, session.session_id)}
                                                    title="Delete Archive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {currentSessionId === session.session_id && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(0,255,180,0.5)]" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 italic text-center md:text-left">Secure data synchronization active</p>
                        <Button
                            variant="outline"
                            className="w-full md:w-auto bg-primary hover:bg-white hover:text-black text-black border-none rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 h-10 px-8"
                            onClick={() => {
                                navigate("/chat");
                                onOpenChange(false);
                            }}
                        >
                            <RefreshCcw className="w-3 h-3 mr-2" /> Start New Hub
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
