import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboards from "@/pages/dashboards";
import DashboardViewer from "@/pages/dashboards/viewer";
import AdminOverview from "@/pages/admin";
import AdminCompanies from "@/pages/admin/companies";
import AdminCompanyDashboards from "@/pages/admin/companies/dashboards";
import AdminDashboards from "@/pages/admin/dashboards";
import AdminUsers from "@/pages/admin/users";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30_000,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user.role !== "admin") return <Redirect to="/dashboards" />;

  return <Component />;
}

function HomeRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Redirect to="/dashboards" />;
  return <Home />;
}

function AppRoutes() {
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/login" component={Login} />
        <Route path="/sign-in"><Redirect to="/login" /></Route>
        <Route path="/sign-up"><Redirect to="/login" /></Route>
        
        <Route path="/dashboards">
          <ProtectedRoute component={Dashboards} />
        </Route>
        <Route path="/dashboards/:id">
          <ProtectedRoute component={DashboardViewer} />
        </Route>
        
        <Route path="/admin">
          <ProtectedRoute component={AdminOverview} adminOnly />
        </Route>
        <Route path="/admin/companies">
          <ProtectedRoute component={AdminCompanies} adminOnly />
        </Route>
        <Route path="/admin/companies/:id/dashboards">
          <ProtectedRoute component={AdminCompanyDashboards} adminOnly />
        </Route>
        <Route path="/admin/dashboards">
          <ProtectedRoute component={AdminDashboards} adminOnly />
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute component={AdminUsers} adminOnly />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={basePath}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
