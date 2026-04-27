import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import {
  useListUsers,
  useListCompanies,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  getListUsersQueryKey,
} from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  brand_admin: "Brand Admin",
  viewer: "Viewer",
};

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  brand_admin: "secondary",
  viewer: "outline",
};

type FormState = {
  email: string;
  firstname: string;
  lastname: string;
  role: "admin" | "brand_admin" | "viewer";
  password: string;
  companyId: string;
};

const emptyForm: FormState = {
  email: "",
  firstname: "",
  lastname: "",
  role: "viewer",
  password: "",
  companyId: "",
};

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useListUsers();
  const { data: companies } = useListCompanies();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function openCreate() {
    setForm(emptyForm);
    setCreateOpen(true);
  }

  function openEdit(user: User) {
    setForm({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role as "admin" | "brand_admin" | "viewer",
      password: "",
      companyId: user.companyId ?? "",
    });
    setEditingUser(user);
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createUser.mutate(
      {
        data: {
          email: form.email,
          firstname: form.firstname,
          lastname: form.lastname,
          role: form.role,
          password: form.password || undefined,
          companyId: form.companyId || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Utilisateur créé" });
          setCreateOpen(false);
          invalidate();
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      },
    );
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    updateUser.mutate(
      {
        id: editingUser.id,
        data: {
          email: form.email,
          firstname: form.firstname,
          lastname: form.lastname,
          role: form.role,
          password: form.password || undefined,
          companyId: form.companyId || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Utilisateur mis à jour" });
          setEditingUser(null);
          invalidate();
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast({ title: "Utilisateur supprimé" });
          setDeleteTarget(null);
          invalidate();
        },
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      },
    );
  }

  const UserForm = ({
    onSubmit,
    isPending,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prénom</Label>
          <Input
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            required
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            required
            className="rounded-none"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label>Mot de passe {editingUser && "(laisser vide pour ne pas changer)"}</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-none"
          required={!editingUser}
        />
      </div>
      <div className="space-y-2">
        <Label>Rôle</Label>
        <Select
          value={form.role}
          onValueChange={(v) => setForm({ ...form, role: v as FormState["role"] })}
        >
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="brand_admin">Brand Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Entreprise</Label>
        <Select
          value={form.companyId || "none"}
          onValueChange={(v) => setForm({ ...form, companyId: v === "none" ? "" : v })}
        >
          <SelectTrigger className="rounded-none">
            <SelectValue placeholder="Aucune" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            {companies?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending} className="rounded-none">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {editingUser ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
            Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gestion des comptes utilisateurs.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
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
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => {
                  const company = companies?.find((c) => c.id === user.companyId);
                  return (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="font-medium">
                        {user.firstname} {user.lastname}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ROLE_VARIANTS[user.role] ?? "outline"}
                          className="rounded-none text-xs"
                        >
                          {ROLE_LABELS[user.role] ?? user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {company?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                          className="rounded-none text-xs"
                        >
                          {user.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(user)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(user)}
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
            <DialogTitle>Nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleCreate} isPending={createUser.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleUpdate} isPending={updateUser.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>
              {deleteTarget?.firstname} {deleteTarget?.lastname}
            </strong>{" "}
            ? Cette action est irréversible.
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
              disabled={deleteUser.isPending}
              className="rounded-none"
            >
              {deleteUser.isPending && (
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
