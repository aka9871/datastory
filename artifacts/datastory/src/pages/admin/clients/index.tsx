import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { useListClients, useCreateClient, useUpdateClient, useDeleteClient, getListClientsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, LayoutDashboard, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminClients() {
  const { data: clients, isLoading } = useListClients();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    industry: "",
    description: "",
    active: true,
  });

  const handleCreateOpen = () => {
    setFormData({ name: "", slug: "", industry: "", description: "", active: true });
    setIsCreateOpen(true);
  };

  const handleEditOpen = (client: any) => {
    setFormData({
      name: client.name,
      slug: client.slug,
      industry: client.industry || "",
      description: client.description || "",
      active: client.active,
    });
    setEditingClient(client);
  };

  const handleDeleteOpen = (client: any) => {
    setClientToDelete(client);
    setIsDeleteOpen(true);
  };

  const onSave = async () => {
    if (!formData.name || !formData.slug) {
      toast({ title: "Validation Error", description: "Name and slug are required", variant: "destructive" });
      return;
    }

    try {
      if (editingClient) {
        await updateClient.mutateAsync({
          id: editingClient.id,
          data: formData
        });
        toast({ title: "Client updated successfully" });
        setEditingClient(null);
      } else {
        await createClient.mutateAsync({
          data: formData
        });
        toast({ title: "Client created successfully" });
        setIsCreateOpen(false);
      }
      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save client", variant: "destructive" });
    }
  };

  const onDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient.mutateAsync({ id: clientToDelete.id });
      toast({ title: "Client deleted successfully" });
      setIsDeleteOpen(false);
      setClientToDelete(null);
      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete client", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">Clients</h1>
          <p className="text-muted-foreground">Manage your agency's clients.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateOpen}>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif">Create Client</DialogTitle>
              <DialogDescription>Add a new client to Datastory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (URL friendly)</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none resize-none" />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onSave} disabled={createClient.isPending}>
                {createClient.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif">Edit Client</DialogTitle>
              <DialogDescription>Make changes to client details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input id="edit-slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Input id="edit-industry" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none resize-none" />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="edit-active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onSave} disabled={updateClient.isPending}>
                {updateClient.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-destructive">Delete Client</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{clientToDelete?.name}</strong>? This will also remove all associated dashboards. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={onDelete} disabled={deleteClient.isPending}>
                {deleteClient.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : clients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No clients found. Create your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              clients?.map((client) => (
                <TableRow key={client.id} className="border-border">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.industry || "—"}</TableCell>
                  <TableCell>
                    {client.active ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 rounded-none">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 rounded-none">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/clients/${client.id}/dashboards`}>
                        <Button variant="outline" size="sm" className="h-8 rounded-none">
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboards
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => handleEditOpen(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none" onClick={() => handleDeleteOpen(client)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}