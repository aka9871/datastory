import { AppLayout } from "@/components/layout";
import { useListDashboards, useListCompanies } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { BarChart3, ArrowRight } from "lucide-react";

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
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-10">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
            Tableau de bord
          </p>
          <h1 className="text-4xl font-serif font-bold tracking-tight">
            Mes Dashboards
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : activeDashboards.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium mb-1">Aucun dashboard disponible</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Votre compte n'a pas encore été associé à des dashboards. Contactez votre administrateur BBDO Paris.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {activeDashboards.map((dashboard, idx) => {
              const company = companies?.find((c) => c.id === dashboard.companyId);
              const logoSrc = getLogoSrc(company?.logoUrl);
              return (
                <Link key={dashboard.id} href={`/dashboards/${dashboard.id}`}>
                  <div className="group flex items-center gap-6 py-6 px-1 cursor-pointer hover:bg-card transition-colors relative">
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-200" />

                    <div className="w-7 text-right shrink-0">
                      <span className="text-xs text-muted-foreground/40 font-mono tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="w-28 shrink-0 flex items-center">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={company?.name ?? ""}
                          className="h-7 w-auto max-w-[100px] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : company ? (
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                          {company.name}
                        </span>
                      ) : (
                        <div className="h-7 w-7 bg-border/50 flex items-center justify-center">
                          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-serif font-semibold leading-tight group-hover:text-foreground transition-colors truncate">
                        {dashboard.name}
                      </h2>
                      {company && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {company.name}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
