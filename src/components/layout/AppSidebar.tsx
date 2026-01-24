import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    MessageSquare,
    BarChart2,
    Bookmark,
    LogOut,
    User,
    Settings,
    GraduationCap,
    Shield,
    Sun,
    Moon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatHistory } from "@/hooks/useChatHistory";

import { Pencil, Trash2, Check, X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ChatHistoryItems = () => {
    const { sessions, isLoading, renameSession, deleteSession } = useChatHistory();
    const { setOpenMobile } = useSidebar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentSessionId = searchParams.get("session");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleRename = async (sessionId: string) => {
        if (!editValue.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await renameSession(sessionId, editValue.trim());
            setEditingId(null);
            toast.success("Chat renamed");
        } catch (e) {
            toast.error("Failed to rename chat");
        }
    };

    const handleDelete = async (sessionId: string) => {
        try {
            await deleteSession(sessionId);
            setDeleteConfirmId(null);
            toast.success("Chat deleted");
            if (currentSessionId === sessionId) {
                navigate("/chat");
            }
        } catch (e) {
            toast.error("Failed to delete chat");
        }
    };

    if (isLoading) {
        return <div className="px-6 py-2 text-[10px] text-white/20 animate-pulse">Loading history...</div>;
    }

    if (sessions.length === 0) {
        return <div className="px-6 py-2 text-[10px] text-white/20">No recent chats</div>;
    }

    return (
        <>
            {sessions.map((session) => (
                <SidebarMenuItem key={session.session_id} className="group/item relative">
                    {editingId === session.session_id ? (
                        <div className="w-full flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-primary/30">
                            <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRename(session.session_id);
                                    if (e.key === "Escape") setEditingId(null);
                                }}
                                className="bg-transparent text-xs text-white border-none outline-none flex-1 min-w-0"
                            />
                            <button onClick={() => handleRename(session.session_id)} className="text-green-500 hover:text-green-400">
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <SidebarMenuButton
                                onClick={() => {
                                    navigate(`/chat?session=${session.session_id}`);
                                    setOpenMobile(false);
                                }}
                                isActive={currentSessionId === session.session_id}
                                className={cn(
                                    "w-full h-10 rounded-xl px-4 flex items-center gap-3 transition-all truncate pr-14",
                                    currentSessionId === session.session_id
                                        ? "bg-primary/20 text-white border-l-2 border-primary"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-xs truncate font-medium">
                                    {session.session_name || session.last_message}
                                </span>
                            </SidebarMenuButton>

                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(session.session_id);
                                        setEditValue(session.session_name || session.last_message);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                >
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmId(session.session_id);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </>
                    )}
                </SidebarMenuItem>
            ))}

            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            This will permanently delete all messages in this conversation. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            className="bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                        >
                            Delete Conversation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const AppSidebar = () => {
    const { user, signOut, isAdmin } = useAuth();
    const { setOpenMobile } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { title: "Chat Advisor", icon: MessageSquare, path: "/chat" },
        { title: "Compare Tool", icon: BarChart2, path: "/compare" },
        { title: "Saved Colleges", icon: Bookmark, path: "/saved" },
    ];

    const { theme, toggleTheme } = useTheme();
    const isNaruto = theme === "light";

    return (
        <Sidebar className={cn(
            "border-r transition-colors duration-700",
            isNaruto ? "border-red-900/20 bg-[#080808]/80 backdrop-blur-xl shadow-[20px_0_50px_rgba(0,0,0,0.5)]" : "border-white/5 bg-black/50 backdrop-blur-xl"
        )}>
            <SidebarHeader className="p-4 md:p-6">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                    navigate("/");
                    setOpenMobile(false);
                }}>
                    <div className={cn(
                        "w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110",
                        isNaruto ? "bg-red-600 shadow-red-600/30" : "bg-primary shadow-primary/20"
                    )}>
                        <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className={cn(
                        "font-bold text-lg md:text-xl tracking-tight transition-colors duration-500",
                        "text-white"
                    )}>EmergentIQ</span>
                </div>
            </SidebarHeader>

            <SidebarContent className={isNaruto ? "bg-transparent" : "bg-black/20"}>
                <SidebarGroup>
                    <SidebarGroupLabel className={cn(
                        "px-6 text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-colors",
                        "text-white/40"
                    )}>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent className="px-3">
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.path} className="mb-1">
                                    <SidebarMenuButton
                                        onClick={() => {
                                            navigate(item.path);
                                            setOpenMobile(false);
                                        }}
                                        isActive={location.pathname === item.path}
                                        className={cn(
                                            "w-full h-11 md:h-12 rounded-xl px-4 flex items-center gap-3 transition-all duration-300",
                                            location.pathname === item.path
                                                ? isNaruto
                                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                    : "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-white/60 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            location.pathname === item.path
                                                ? "text-white"
                                                : isNaruto ? "text-zinc-400" : "text-white/40"
                                        )} />
                                        <span className="font-semibold">{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className={cn(
                        "px-6 text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-colors",
                        "text-white/40"
                    )}>Recent Chats</SidebarGroupLabel>
                    <SidebarGroupContent className="px-3">
                        <SidebarMenu>
                            <SidebarMenuItem key="new-chat" className="mb-2">
                                <SidebarMenuButton
                                    onClick={() => {
                                        navigate("/chat");
                                        setOpenMobile(false);
                                    }}
                                    className="w-full h-9 md:h-10 rounded-xl px-4 border border-white/5 bg-white/5 text-white hover:bg-white/10 flex items-center gap-3"
                                >
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-xs">New Chat</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <ChatHistoryItems />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


            <SidebarFooter className={cn(
                "p-3 md:p-4 border-t flex flex-col gap-2 transition-colors",
                "border-white/5 bg-black/40"
            )}>
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
                            isNaruto ? "hover:bg-zinc-100" : "hover:bg-white/5"
                        )}>
                            <Avatar className={cn(
                                "h-9 w-9 md:h-10 md:w-10 border transition-colors",
                                isNaruto ? "border-zinc-200" : "border-white/20 group-hover:border-primary/50"
                            )}>
                                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs md:text-sm">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className={cn("text-xs md:text-sm font-bold truncate", "text-white")}>{user?.email?.split('@')[0]}</p>
                                <p className={cn("text-[9px] md:text-[10px] truncate font-medium", "text-white/40")}>Verified Member</p>
                            </div>
                            <Settings className={cn("w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors", isNaruto ? "text-zinc-400 group-hover:text-zinc-900" : "text-white/40 group-hover:text-white")} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 backdrop-blur-3xl mb-4 shadow-2xl">
                        <div className="px-3 py-2 border-b border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Account</p>
                            <p className="text-sm text-white/90 truncate font-semibold">{user?.email}</p>
                        </div>

                        <DropdownMenuItem onClick={() => navigate("/profile")} className="text-white/70 hover:text-white hover:bg-white/10 py-2.5 mt-1 cursor-pointer">
                            <User className="w-4 h-4 mr-3 text-primary/70" />
                            <span className="text-xs font-medium">My Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate("/settings")} className="text-white/70 hover:text-white hover:bg-white/10 py-2.5 cursor-pointer">
                            <Settings className="w-4 h-4 mr-3 text-primary/70" />
                            <span className="text-xs font-medium">Settings</span>
                        </DropdownMenuItem>

                        {isAdmin && (
                            <DropdownMenuItem onClick={() => navigate("/admin")} className="text-white/70 hover:text-white hover:bg-white/10 py-2.5 cursor-pointer">
                                <Shield className="w-4 h-4 mr-3 text-purple-400/70" />
                                <span className="text-xs font-medium">Admin Panel</span>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-white/5" />

                        {/* Sign out removed from sidebar - moved to settings */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
};
