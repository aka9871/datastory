import { useState, useRef } from "react";
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
import { Plus, Trash2, Pencil, Loader2, LayoutDashboard, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

import { storageUrl } from "@/lib/api-url";

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

async function uploadLogo(file: File): Promise<string> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const token = localStorage.getItem("datastory_token");
  const urlRes = await fetch(`${base}/api/storage/uploads/request-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!urlRes.ok) throw new Error("Impossible d'obtenir l'URL d'upload");
  const { uploadURL, objectPath } = await urlRes.json();
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!putRes.ok) throw new Error("Échec de l'upload du logo");
  return objectPath as string;
}

type CompanyFormProps = {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isEditing: boolean;
  logoPreview: string | null;
  clearLogo: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CompanyForm({
  form,
  setForm,
  onSubmit,
  isPending,
  isEditing,
  logoPreview,
  clearLogo,
  fileInputRef,
  handleFileChange,
}: CompanyFormProps) {
  return (
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
        <Label>Logo</Label>
        {logoPreview ? (
          <div className="flex items-center gap-3 p-3 border border-border bg-muted/30">
            <img src={logoPreview} alt="Logo" className="h-10 w-auto max-w-[140px] object-contain" />
            <button type="button" onClick={clearLogo} className="ml-auto text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className="border border-dashed border-border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Cliquer pour uploader un PNG/JPG</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {!logoPreview && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Ou entrer une URL</span>
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="rounded-none"
              placeholder="https://..."
            />
          </div>
        )}
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
          {isEditing ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );
}

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
  }

  function openCreate() {
    setForm(emptyForm);
    setLogoFile(null);
    setLogoPreview(null);
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
    setLogoFile(null);
    setLogoPreview(storageUrl(company.logoUrl));
    setEditingCompany(company);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Sélectionnez une image (PNG, JPG…)", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function clearLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setForm((f) => ({ ...f, logoUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function resolveLogoUrl(): Promise<string | null> {
    if (logoFile) {
      setIsUploading(true);
      try {
        const path = await uploadLogo(logoFile);
        setIsUploading(false);
        return path;
      } catch (err) {
        setIsUploading(false);
        toast({ title: "Erreur lors de l'upload du logo", variant: "destructive" });
        throw err;
      }
    }
    return form.logoUrl || null;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    let logoUrl: string | null;
    try {
      logoUrl = await resolveLogoUrl();
    } catch {
      return;
    }
    createCompany.mutate(
      {
        data: {
          name: form.name,
          slug: form.slug,
          domain: form.domain,
          hasFranchise: form.hasFranchise,
          logoUrl,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Entreprise créée" });
          setCreateOpen(false);
          setLogoFile(null);
          setLogoPreview(null);
          invalidate();
        },
        onError: () =>
          toast({ title: "Erreur lors de la création", variant: "destructive" }),
      },
    );
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCompany) return;
    let logoUrl: string | null;
    try {
      logoUrl = await resolveLogoUrl();
    } catch {
      return;
    }
    updateCompany.mutate(
      {
        id: editingCompany.id,
        data: {
          name: form.name,
          slug: form.slug,
          domain: form.domain,
          hasFranchise: form.hasFranchise,
          logoUrl,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Entreprise mise à jour" });
          setEditingCompany(null);
          setLogoFile(null);
          setLogoPreview(null);
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
          toast({ title: "Erreur lors de la suppression", variant: "destructive" }),
      },
    );
  }

  const isPendingForm =
    createCompany.isPending || updateCompany.isPending || isUploading;

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
                <TableHead>Logo</TableHead>
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
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucune entreprise
                  </TableCell>
                </TableRow>
              ) : (
                companies?.map((company) => {
                  const logoSrc = storageUrl(company.logoUrl);
                  return (
                    <TableRow key={company.id} className="border-border">
                      <TableCell>
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={company.name}
                            className="h-7 w-auto max-w-[80px] object-contain"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
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
                  );
                })
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
          <CompanyForm
            form={form}
            setForm={setForm}
            onSubmit={handleCreate}
            isPending={isPendingForm}
            isEditing={false}
            logoPreview={logoPreview}
            clearLogo={clearLogo}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
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
            form={form}
            setForm={setForm}
            onSubmit={handleUpdate}
            isPending={isPendingForm}
            isEditing={true}
            logoPreview={logoPreview}
            clearLogo={clearLogo}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
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
