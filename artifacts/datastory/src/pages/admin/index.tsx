import { AdminLayout } from "@/components/layout";
import { useGetOverviewStats, useHealthCheck } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, LayoutDashboard, Activity, CheckCircle2, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminOverview() {
  const { data: stats, isLoading } = useGetOverviewStats();
  const { data: health } = useHealthCheck();

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">Overview</h1>
          <p className="text-muted-foreground">Datastory administration and metrics.</p>
        </div>
        {health && (
          <Badge variant="outline" className="rounded-none bg-card border-border gap-2 text-xs">
            <Server className="h-3 w-3" /> API: {health.status}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-none border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalClients || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats?.activeClients || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Dashboards
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalDashboards || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Dashboards
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats?.activeDashboards || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}