import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, User, LogOut, Settings, Scale, Menu, Bookmark, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";


export const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {


    await signOut();
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">
              EmergentIQ
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {user && (
              <>
                <Link to="/chat">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Chat
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Compare
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Saved
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-white/10 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>

            {user ? (

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-colors">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/10 backdrop-blur-xl">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate text-white/90">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild>
                    <Link to="/saved" className="cursor-pointer text-white/70 hover:text-white hover:bg-white/10">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Saved Colleges
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-white/70 hover:text-white hover:bg-white/10">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="rounded-full bg-white text-black hover:bg-white/90 px-6 font-medium"
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};
