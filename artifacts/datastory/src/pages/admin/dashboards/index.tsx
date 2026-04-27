import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import {
  useListDashboards,
  useListCompanies,
  useCreateDashboard,
  useUpdateDashboard,
  useDeleteDashboard,
  getListDashboardsQueryKey,
} from "@workspace/api-client-react";
import type { Dashboard, Company } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

type FormState = {
  name: string;
  companyId: string;
  lookerUrl: string;
  active: boolean;
};

const emptyForm: FormState = {
  name: "",
  companyId: "",
  lookerUrl: "",
  active: true,
};

type DashboardFormProps = {
  formData: FormState;
  setFormData: (f: FormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isEditing: boolean;
  companies: Company[] | undefined;
};

function DashboardForm({ formData, setFormData, onSubmit, isPending, isEditing, companies }: DashboardFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label>Entreprise</Label>
        <Select
          value={formData.companyId}
          onValueChange={(v) => setFormData({ ...formData, companyId: v })}
        >
          <SelectTrigger className="rounded-none">
            <SelectValue placeholder="Sélectionner une entreprise" />
          </SelectTrigger>
          <SelectContent>
            {companies?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>URL Looker Studio</Label>
        <Input
          value={formData.lookerUrl}
          onChange={(e) => setFormData({ ...formData, lookerUrl: e.target.value })}
          placeholder="https://lookerstudio.google.com/embed/..."
          required
          className="rounded-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={formData.active}
          onCheckedChange={(v) => setFormData({ ...formData, active: v })}
          id="active"
        />
        <Label htmlFor="active">Actif</Label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending} className="rounded-none">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditing ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AdminDashboards() {
  const { data: dashboards, isLoading: isLoadingDashboards } = useListDashboards();
  const { data: companies, isLoading: isLoadingCompanies } = useListCompanies();
  const isLoading = isLoadingDashboards || isLoadingCompanies;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDashboard = useCreateDashboard();
  const updateDashboard = useUpdateDashboard();
  const deleteDashboard = useDeleteDashboard();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dashboard | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListDashboardsQueryKey() });
  }

  function openCreate() {
    setFormData(emptyForm);
    setIsCreateOpen(true);
  }

  function openEdit(dashboard: Dashboard) {
    setFormData({
      name: dashboard.name,
      companyId: dashboard.companyId,
      lookerUrl: dashboard.lookerUrl,
      active: dashboard.active,
    });
    setEditingDashboard(dashboard);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createDashboard.mutate(
      {
        data: {
          name: formData.name,
          companyId: formData.companyId,
          lookerUrl: formData.lookerUrl,
          active: formData.active,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Dashboard créé" });
          setIsCreateOpen(false);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la création", variant: "destructive" }),
      },
    );
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDashboard) return;
    updateDashboard.mutate(
      {
        id: editingDashboard.id,
        data: {
          name: formData.name,
          companyId: formData.companyId,
          lookerUrl: formData.lookerUrl,
          active: formData.active,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Dashboard mis à jour" });
          setEditingDashboard(null);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteDashboard.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast({ title: "Dashboard supprimé" });
          setDeleteTarget(null);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la suppression", variant: "destructive" }),
      },
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
            Dashboards
          </h1>
          <p className="text-muted-foreground">
            Gestion de tous les dashboards Looker Studio.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau dashboard
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nom</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Aperçu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboards?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Aucun dashboard
                  </TableCell>
                </TableRow>
              ) : (
                dashboards?.map((dashboard) => {
                  const company = companies?.find((c) => c.id === dashboard.companyId);
                  return (
                    <TableRow key={dashboard.id} className="border-border">
                      <TableCell className="font-medium">{dashboard.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {company?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboards/${dashboard.id}`}>
                          <span className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                            <Eye className="h-3 w-3" />
                            Voir
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={dashboard.active ? "default" : "secondary"}
                          className="rounded-none text-xs"
                        >
                          {dashboard.active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(dashboard)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(dashboard)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Nouveau dashboard</DialogTitle>
          </DialogHeader>
          <DashboardForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreate}
            isPending={createDashboard.isPending}
            isEditing={false}
            companies={companies}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDashboard} onOpenChange={(o) => !o && setEditingDashboard(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Modifier le dashboard</DialogTitle>
          </DialogHeader>
          <DashboardForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            isPending={updateDashboard.isPending}
            isEditing={true}
            companies={companies}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Supprimer le dashboard</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>{deleteTarget?.name}</strong> ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="rounded-none">
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDashboard.isPending}
              className="rounded-none"
            >
              {deleteDashboard.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
