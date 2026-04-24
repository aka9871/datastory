import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import {
  useListUsers,
  useListClients,
  useCreateUser,
  useDeleteUser,
  useAssignClientToUser,
  useRemoveClientFromUser,
  getListUsersQueryKey,
} from "@workspace/api-client-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, UserCheck, UserX, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users, isLoading: loadingUsers } = useListUsers();
  const { data: clients } = useListClients();

  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const assignClient = useAssignClientToUser();
  const removeClient = useRemoveClientFromUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });

  const handleCreate = () => {
    if (!form.email || !form.password) {
      toast({ title: "Email and password are required", variant: "destructive" });
      return;
    }
    createUser.mutate(
      { data: { email: form.email, password: form.password, firstName: form.firstName || null, lastName: form.lastName || null } },
      {
        onSuccess: () => {
          toast({ title: "User created successfully" });
          setForm({ email: "", password: "", firstName: "", lastName: "" });
          setCreateOpen(false);
          invalidateUsers();
        },
        onError: (err: any) => {
          toast({
            title: "Failed to create user",
            description: err?.message ?? "Unknown error",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleDelete = (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    deleteUser.mutate(
      { userId },
      {
        onSuccess: () => {
          toast({ title: "User deleted" });
          invalidateUsers();
        },
        onError: () => toast({ title: "Failed to delete user", variant: "destructive" }),
      },
    );
  };

  const handleAssignClient = (userId: string, clientId: string) => {
    assignClient.mutate(
      { userId, data: { clientId: Number(clientId) } },
      {
        onSuccess: () => {
          toast({ title: "Client assigned" });
          invalidateUsers();
        },
        onError: () => toast({ title: "Failed to assign client", variant: "destructive" }),
      },
    );
  };

  const handleRemoveClient = (userId: string, clientId: number) => {
    removeClient.mutate(
      { userId, clientId },
      {
        onSuccess: () => {
          toast({ title: "Access removed" });
          invalidateUsers();
        },
        onError: () => toast({ title: "Failed to remove client", variant: "destructive" }),
      },
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Create user accounts and control which clients they can access.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none border-border bg-card text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Create User Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">First name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Jean"
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Last name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Dupont"
                    className="rounded-none mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@client.com"
                  className="rounded-none mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  className="rounded-none mt-1"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createUser.isPending}>
                  {createUser.isPending ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loadingUsers ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border p-4">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border bg-card/50">
          <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No users yet</h3>
          <p className="text-muted-foreground">Create a user account to grant client access.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const assignedClients = (clients ?? []).filter((c) =>
              user.assignedClientIds.includes(c.id),
            );
            const unassignedClients = (clients ?? []).filter(
              (c) => !user.assignedClientIds.includes(c.id),
            );
            return (
              <div key={user.id} className="border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {user.firstName || user.lastName
                          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                          : user.email}
                      </span>
                      {(user.firstName || user.lastName) && (
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {assignedClients.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No clients assigned</span>
                      ) : (
                        assignedClients.map((c) => (
                          <Badge
                            key={c.id}
                            variant="secondary"
                            className="rounded-none pr-1 flex items-center gap-1"
                          >
                            <UserCheck className="h-3 w-3 text-primary" />
                            {c.name}
                            <button
                              onClick={() => handleRemoveClient(user.id, c.id)}
                              className="ml-1 hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}

                      {unassignedClients.length > 0 && (
                        <Select onValueChange={(val) => handleAssignClient(user.id, val)}>
                          <SelectTrigger className="h-6 text-xs rounded-none border-dashed w-auto min-w-[120px]">
                            <SelectValue placeholder="+ Add client" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            {unassignedClients.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id, user.email)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
