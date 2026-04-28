import { useRoute, Link } from "wouter";
import { getDashboard } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListCompanies } from "@workspace/api-client-react";
import { storageUrl } from "@/lib/api-url";

export default function DashboardViewer() {
  const [, params] = useRoute("/dashboards/:id");
  const id = params?.id ?? null;

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["/api/dashboards", id],
    queryFn: () => getDashboard(id!),
    enabled: !!id,
  });

  const { data: companies } = useListCompanies();
  const company = companies?.find((c) => c.id === dashboard?.companyId);
  const logoSrc = storageUrl(company?.logoUrl);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold mb-4">Dashboard introuvable</h1>
        <p className="text-muted-foreground mb-8">
          Ce dashboard n'existe pas ou vous n'avez pas accès.
        </p>
        <Link href="/dashboards">
          <Button className="rounded-none">Retour aux dashboards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <header className="h-14 border-b border-border flex items-center px-4 justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboards">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={company?.name ?? ""}
                className="h-7 w-auto max-w-[120px] object-contain"
              />
            )}
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold leading-none">{dashboard.name}</h1>
              {company && !logoSrc && (
                <span className="text-xs text-muted-foreground mt-0.5">{company.name}</span>
              )}
            </div>
          </div>
        </div>

        <span className="font-serif font-bold text-sm tracking-tight opacity-40">
          DATA<span className="text-primary">STORY</span>
        </span>
      </header>

      <main className="flex-1 w-full bg-black">
        <iframe
          src={dashboard.lookerUrl}
          title={dashboard.name}
          className="w-full h-full border-none"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </main>
    </div>
  );
}
