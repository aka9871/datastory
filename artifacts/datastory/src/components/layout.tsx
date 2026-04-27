import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, BarChart3, LogOut, Building2 } from "lucide-react";
import bbdoLogo from "/bbdo-logo.png";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/dashboards" className="flex flex-col items-start leading-none gap-0.5">
            <span className="font-serif font-bold text-lg tracking-tight">
              DATA<span className="text-primary">STORY</span>
            </span>
            <img src={bbdoLogo} alt="BBDO Paris" className="h-3.5 w-auto opacity-70" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboards" className={`text-sm font-medium transition-colors hover:text-foreground ${location === "/dashboards" ? "text-foreground" : "text-muted-foreground"}`}>
              Mes Dashboards
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className={`text-sm font-medium transition-colors hover:text-foreground ${location.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"}`}>
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Se déconnecter">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin", label: "Vue d'ensemble", icon: BarChart3 },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/companies", label: "Entreprises", icon: Building2 },
    { href: "/admin/dashboards", label: "Dashboards", icon: LayoutDashboard },
  ];

  return (
    <AppLayout>
      <div className="flex h-full">
        <aside className="w-64 border-r border-border bg-card shrink-0 hidden md:block">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Administration
            </h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location === item.href ||
                  (item.href !== "/admin" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <span className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent"}`}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </AppLayout>
  );
}
