import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/layout";
import {
  useListDashboards,
  useListCompanies,
} from "@workspace/api-client-react";
import { ArrowLeft, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCompanyDashboards() {
  const [, params] = useRoute("/admin/companies/:id/dashboards");
  const companyId = params?.id ?? null;

  const { data: allDashboards, isLoading: isLoadingDashboards } =
    useListDashboards();
  const { data: companies, isLoading: isLoadingCompanies } = useListCompanies();

  const isLoading = isLoadingDashboards || isLoadingCompanies;

  const company = companies?.find((c) => c.id === companyId);
  const dashboards =
    allDashboards?.filter((d) => d.companyId === companyId) ?? [];

  return (
    <AdminLayout>
      <div className="mb-8">
        <Link href="/admin/companies">
          <Button variant="ghost" className="mb-4 rounded-none -ml-3 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux entreprises
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
            {isLoadingCompanies ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              company?.name ?? "Entreprise"
            )}
          </h1>
          <p className="text-muted-foreground">
            Dashboards associés à cette entreprise.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : dashboards.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border bg-card/50">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Aucun dashboard</h3>
          <p className="text-muted-foreground text-sm">
            Cette entreprise n'a pas encore de dashboards.
          </p>
          <Link href="/admin/dashboards">
            <Button className="mt-4 rounded-none" variant="outline">
              Gérer les dashboards
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nom</TableHead>
                <TableHead>URL Looker Studio</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboards.map((dashboard) => (
                <TableRow key={dashboard.id} className="border-border">
                  <TableCell className="font-medium">{dashboard.name}</TableCell>
                  <TableCell>
                    <a
                      href={dashboard.lookerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ouvrir
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={dashboard.active ? "default" : "secondary"}
                      className="rounded-none text-xs"
                    >
                      {dashboard.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
