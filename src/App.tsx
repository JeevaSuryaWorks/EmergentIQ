import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { ProductionLoader } from "@/components/ui/ProductionLoader";


// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Landing"));
const Chat = lazy(() => import("@/pages/Chat"));
const Compare = lazy(() => import("@/pages/Compare"));
const Admin = lazy(() => import("@/pages/Admin"));
const Saved = lazy(() => import("@/pages/Saved"));
const Auth = lazy(() => import("@/pages/Auth"));
const EmailVerified = lazy(() => import("@/pages/EmailVerified"));
const EmailWaiting = lazy(() => import("@/pages/EmailWaiting"));
const Rankings = lazy(() => import("@/pages/Rankings"));
const About = lazy(() => import("@/pages/About"));
const Careers = lazy(() => import("@/pages/Careers"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Guide = lazy(() => import("@/pages/Guide"));
const Settings = lazy(() => import("@/pages/Settings"));
const Profile = lazy(() => import("@/pages/Profile"));
const Team = lazy(() => import("@/pages/Team"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const CashControl = lazy(() => import("@/pages/admin/CashControl"));

import { useAppLock } from "@/hooks/useAppLock";
import { PaymentBlocker } from "@/components/access/PaymentBlocker";

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isUnlocked, isLoading } = useAppLock();

  return (
    <Suspense fallback={<ProductionLoader />}>
      {/* Global Access Gate - Blocks everything except /cash if locked */}
      {isUnlocked === false && !isLoading && location.pathname !== "/cash" && (
        <PaymentBlocker />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/email-waiting" element={<EmailWaiting />} />

          {/* Public Control Rule */}
          <Route
            path="/cash"
            element={<CashControl />}
          />

          {/* Dashboard Area with Sidebar Persistence */}
          <Route
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                </SidebarProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/chat" element={<Chat />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/rankings" element={<Rankings />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
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

const queryClient = new QueryClient();

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
