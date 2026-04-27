import { AppLayout } from "@/components/layout";
import { useListDashboards, useListCompanies } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { BarChart3, ExternalLink } from "lucide-react";

function getLogoSrc(logoUrl: string | null | undefined): string | null {
  if (!logoUrl) return null;
  if (logoUrl.startsWith("http")) return logoUrl;
  return `/api/storage${logoUrl}`;
}

export default function Dashboards() {
  const { data: dashboards, isLoading: isLoadingDashboards } = useListDashboards();
  const { data: companies, isLoading: isLoadingCompanies } = useListCompanies();

  const isLoading = isLoadingDashboards || isLoadingCompanies;

  const activeDashboards = dashboards?.filter((d) => d.active) ?? [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
            Mes Dashboards
          </h1>
          <p className="text-muted-foreground">
            Sélectionnez un dashboard pour consulter vos insights et analyses.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="rounded-none border-border bg-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeDashboards.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border bg-card/50">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Aucun dashboard disponible</h3>
            <p className="text-muted-foreground">
              Votre compte n'a pas encore été associé à des dashboards. Contactez
              votre administrateur BBDO Paris.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDashboards.map((dashboard) => {
              const company = companies?.find((c) => c.id === dashboard.companyId);
              const logoSrc = getLogoSrc(company?.logoUrl);
              return (
                <Link key={dashboard.id} href={`/dashboards/${dashboard.id}`}>
                  <Card className="rounded-none border-border bg-card hover:border-primary transition-colors cursor-pointer group h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center mb-3">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={company?.name ?? ""}
                            className="h-8 w-auto max-w-[140px] object-contain"
                          />
                        ) : company ? (
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {company.name}
                          </span>
                        ) : null}
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                      <CardTitle className="font-serif text-xl line-clamp-2">
                        {dashboard.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4">
                      <div className="aspect-video w-full bg-muted/30 flex items-center justify-center border border-border/50">
                        <BarChart3 className="h-8 w-8 text-muted-foreground/20" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
