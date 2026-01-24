import React from "react";
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

    // 4. Force Onboarding for non-admins
    const isOnboardingCompleted = user.user_metadata?.onboarding_completed === true;
    if (!isAdmin && !isOnboardingCompleted && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // 5. Prevent returning to onboarding if already completed
    if (!isAdmin && isOnboardingCompleted && location.pathname === "/onboarding") {
        return <Navigate to="/chat" replace />;
    }

    return <>{children}</>;
};
