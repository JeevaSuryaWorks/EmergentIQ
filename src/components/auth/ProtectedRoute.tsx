import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading, isAdmin } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!user) {
        // Redirect to landing page but save the attempted location
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Redirect admin to /admin if they are on a standard user route
    const userRoutes = ["/chat", "/compare", "/saved"];
    if (isAdmin && userRoutes.includes(location.pathname)) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};
