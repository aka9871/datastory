import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import {
  useListCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  getListCompaniesQueryKey,
} from "@workspace/api-client-react";
import type { Company } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Loader2, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type FormState = {
  name: string;
  slug: string;
  domain: string;
  hasFranchise: boolean;
  logoUrl: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  domain: "",
  hasFranchise: false,
  logoUrl: "",
};

export default function AdminCompanies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: companies, isLoading } = useListCompanies();

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
  }

  function openCreate() {
    setForm(emptyForm);
    setCreateOpen(true);
  }

  function openEdit(company: Company) {
    setForm({
      name: company.name,
      slug: company.slug,
      domain: company.domain,
      hasFranchise: company.hasFranchise,
      logoUrl: company.logoUrl ?? "",
    });
    setEditingCompany(company);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createCompany.mutate(
      {
        data: {
          name: form.name,
          slug: form.slug,
          domain: form.domain,
          hasFranchise: form.hasFranchise,
          logoUrl: form.logoUrl || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Entreprise créée" });
          setCreateOpen(false);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la création", variant: "destructive" }),
      },
    );
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCompany) return;
    updateCompany.mutate(
      {
        id: editingCompany.id,
        data: {
          name: form.name,
          slug: form.slug,
          domain: form.domain,
          hasFranchise: form.hasFranchise,
          logoUrl: form.logoUrl || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Entreprise mise à jour" });
          setEditingCompany(null);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCompany.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast({ title: "Entreprise supprimée" });
          setDeleteTarget(null);
          invalidate();
        },
        onError: () =>
          toast({
            title: "Erreur lors de la suppression",
            variant: "destructive",
          }),
      },
    );
  }

  const CompanyForm = ({
    onSubmit,
    isPending,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            const slug = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            setForm({ ...form, name, slug: form.slug || slug });
          }}
          required
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
          className="rounded-none"
          placeholder="ex: mcdonalds-france"
        />
      </div>
      <div className="space-y-2">
        <Label>Domaine email</Label>
        <Input
          value={form.domain}
          onChange={(e) => setForm({ ...form, domain: e.target.value })}
          required
          className="rounded-none"
          placeholder="ex: mcdonalds.fr"
        />
      </div>
      <div className="space-y-2">
        <Label>URL Logo</Label>
        <Input
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          className="rounded-none"
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.hasFranchise}
          onCheckedChange={(v) => setForm({ ...form, hasFranchise: v })}
          id="hasFranchise"
        />
        <Label htmlFor="hasFranchise">Réseau de franchise</Label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending} className="rounded-none">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {editingCompany ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
            Entreprises
          </h1>
          <p className="text-muted-foreground">
            Gestion des entreprises clientes.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle entreprise
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Domaine</TableHead>
                <TableHead>Franchise</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucune entreprise
                  </TableCell>
                </TableRow>
              ) : (
                companies?.map((company) => (
                  <TableRow key={company.id} className="border-border">
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {company.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {company.domain}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {company.hasFranchise ? "Oui" : "Non"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Link href={`/admin/companies/${company.id}/dashboards`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Dashboards"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(company)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(company)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Nouvelle entreprise</DialogTitle>
          </DialogHeader>
          <CompanyForm onSubmit={handleCreate} isPending={createCompany.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingCompany}
        onOpenChange={(o) => !o && setEditingCompany(null)}
      >
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Modifier l'entreprise</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleUpdate}
            isPending={updateCompany.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Supprimer l'entreprise</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>{deleteTarget?.name}</strong> ? Tous les dashboards associés
            seront supprimés.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="rounded-none"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCompany.isPending}
              className="rounded-none"
            >
              {deleteCompany.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
