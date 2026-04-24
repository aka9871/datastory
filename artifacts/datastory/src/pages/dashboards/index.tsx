import { AppLayout } from "@/components/layout";
import { useListDashboards, useListClients } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { BarChart3, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboards() {
  const { data: dashboards, isLoading: isLoadingDashboards } = useListDashboards();
  const { data: clients, isLoading: isLoadingClients } = useListClients();

  const isLoading = isLoadingDashboards || isLoadingClients;

  const activeDashboards = dashboards?.filter(d => d.active).sort((a, b) => a.order - b.order) || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">My Dashboards</h1>
          <p className="text-muted-foreground">Select a dashboard to view your insights and analytics.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="rounded-none border-border bg-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeDashboards.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border bg-card/50">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No dashboards available</h3>
            <p className="text-muted-foreground">You don't have access to any dashboards yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDashboards.map(dashboard => {
              const client = clients?.find(c => c.id === dashboard.clientId);
              return (
                <Link key={dashboard.id} href={`/dashboards/${dashboard.id}`}>
                  <Card className="rounded-none border-border bg-card hover:border-primary transition-colors cursor-pointer group h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        {dashboard.category && (
                          <Badge variant="secondary" className="rounded-none text-xs bg-secondary/50">
                            {dashboard.category}
                          </Badge>
                        )}
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardTitle className="font-serif text-xl line-clamp-2">{dashboard.title}</CardTitle>
                      {client && (
                        <CardDescription className="text-primary font-medium">{client.name}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto pt-4">
                      {dashboard.thumbnailUrl ? (
                        <div className="aspect-video w-full overflow-hidden bg-muted mb-4 relative">
                          <img 
                            src={dashboard.thumbnailUrl} 
                            alt={dashboard.title} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-muted/50 mb-4 flex items-center justify-center border border-border">
                          <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      {dashboard.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{dashboard.description}</p>
                      )}
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