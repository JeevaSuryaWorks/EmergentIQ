import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { NarutoLoader } from "@/components/ui/NarutoLoader";


// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Landing"));
const Chat = lazy(() => import("@/pages/Chat"));
const Compare = lazy(() => import("@/pages/Compare"));
const Admin = lazy(() => import("@/pages/Admin"));
const Saved = lazy(() => import("@/pages/Saved"));
const Auth = lazy(() => import("@/pages/Auth"));
const EmailVerified = lazy(() => import("@/pages/EmailVerified"));
const Rankings = lazy(() => import("@/pages/Rankings"));
const About = lazy(() => import("@/pages/About"));
const Careers = lazy(() => import("@/pages/Careers"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Guide = lazy(() => import("@/pages/Guide"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<NarutoLoader />}>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Chat />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Compare />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Admin />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Saved />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/guide" element={<Guide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

import ScrollToTop from "@/components/layout/ScrollToTop";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
