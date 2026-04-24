import { useRoute, Link } from "wouter";
import { useGetDashboard, useGetClient } from "@workspace/api-client-react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardViewer() {
  const [, params] = useRoute("/dashboards/:id");
  const id = params?.id ? parseInt(params.id) : null;

  const { data: dashboard, isLoading: isLoadingDashboard } = useGetDashboard(id as number, { 
    query: { enabled: !!id } 
  });

  const { data: client } = useGetClient(dashboard?.clientId as number, {
    query: { enabled: !!dashboard?.clientId }
  });

  if (isLoadingDashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold mb-4">Dashboard not found</h1>
        <p className="text-muted-foreground mb-8">The dashboard you are looking for does not exist or you don't have access to it.</p>
        <Link href="/dashboards">
          <Button>Return to Dashboards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <header className="h-14 border-b border-border flex items-center px-4 justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboards">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-none">{dashboard.title}</h1>
            {client && <span className="text-xs text-muted-foreground">{client.name}</span>}
          </div>
        </div>
        <div className="font-serif font-bold text-lg tracking-tight text-muted-foreground/30">
          DATA<span className="text-primary/50">STORY</span>
        </div>
      </header>
      
      <main className="flex-1 w-full bg-black">
        <iframe
          src={dashboard.lookerstudioUrl}
          title={dashboard.title}
          className="w-full h-full border-none"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </main>
    </div>
  );
}