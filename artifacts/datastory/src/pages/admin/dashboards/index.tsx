import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { useListDashboards, useListClients, useCreateDashboard, useUpdateDashboard, useDeleteDashboard, getListDashboardsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function AdminDashboards() {
  const { data: dashboards, isLoading: isLoadingDashboards } = useListDashboards();
  const { data: clients, isLoading: isLoadingClients } = useListClients();
  const isLoading = isLoadingDashboards || isLoadingClients;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDashboard = useCreateDashboard();
  const updateDashboard = useUpdateDashboard();
  const deleteDashboard = useDeleteDashboard();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    lookerstudioUrl: "",
    thumbnailUrl: "",
    category: "",
    order: 0,
    active: true,
  });

  const handleCreateOpen = () => {
    setFormData({ 
      clientId: "", 
      title: "", 
      description: "", 
      lookerstudioUrl: "", 
      thumbnailUrl: "", 
      category: "", 
      order: 0, 
      active: true 
    });
    setIsCreateOpen(true);
  };

  const handleEditOpen = (dashboard: any) => {
    setFormData({
      clientId: dashboard.clientId.toString(),
      title: dashboard.title,
      description: dashboard.description || "",
      lookerstudioUrl: dashboard.lookerstudioUrl,
      thumbnailUrl: dashboard.thumbnailUrl || "",
      category: dashboard.category || "",
      order: dashboard.order,
      active: dashboard.active,
    });
    setEditingDashboard(dashboard);
  };

  const handleDeleteOpen = (dashboard: any) => {
    setDashboardToDelete(dashboard);
    setIsDeleteOpen(true);
  };

  const onSave = async () => {
    if (!formData.title || !formData.lookerstudioUrl || !formData.clientId) {
      toast({ title: "Validation Error", description: "Client, Title and Looker Studio URL are required", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        ...formData,
        clientId: parseInt(formData.clientId),
        order: parseInt(formData.order.toString() || "0")
      };

      if (editingDashboard) {
        await updateDashboard.mutateAsync({
          id: editingDashboard.id,
          data: payload
        });
        toast({ title: "Dashboard updated successfully" });
        setEditingDashboard(null);
      } else {
        await createDashboard.mutateAsync({
          data: payload
        });
        toast({ title: "Dashboard created successfully" });
        setIsCreateOpen(false);
      }
      queryClient.invalidateQueries({ queryKey: getListDashboardsQueryKey() });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save dashboard", variant: "destructive" });
    }
  };

  const onDelete = async () => {
    if (!dashboardToDelete) return;
    try {
      await deleteDashboard.mutateAsync({ id: dashboardToDelete.id });
      toast({ title: "Dashboard deleted successfully" });
      setIsDeleteOpen(false);
      setDashboardToDelete(null);
      queryClient.invalidateQueries({ queryKey: getListDashboardsQueryKey() });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete dashboard", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">All Dashboards</h1>
          <p className="text-muted-foreground">Manage all dashboards across all clients.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateOpen}>
              <Plus className="mr-2 h-4 w-4" /> Add Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Create Dashboard</DialogTitle>
              <DialogDescription>Add a new dashboard to a client.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData({...formData, clientId: v})}>
                  <SelectTrigger id="client" className="rounded-none">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {clients?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Looker Studio URL</Label>
                <Input id="url" value={formData.lookerstudioUrl} onChange={(e) => setFormData({...formData, lookerstudioUrl: e.target.value})} className="rounded-none" placeholder="https://lookerstudio.google.com/embed/..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="rounded-none" placeholder="e.g. Performance, Media..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input id="thumbnail" value={formData.thumbnailUrl} onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="order">Order Index</Label>
                  <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="rounded-none" />
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Switch id="active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onSave} disabled={createDashboard.isPending}>
                {createDashboard.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingDashboard} onOpenChange={(open) => !open && setEditingDashboard(null)}>
          <DialogContent className="sm:max-w-[500px] rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Edit Dashboard</DialogTitle>
              <DialogDescription>Update dashboard settings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-client">Client</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData({...formData, clientId: v})}>
                  <SelectTrigger id="edit-client" className="rounded-none">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {clients?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">Looker Studio URL</Label>
                <Input id="edit-url" value={formData.lookerstudioUrl} onChange={(e) => setFormData({...formData, lookerstudioUrl: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input id="edit-category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                <Input id="edit-thumbnail" value={formData.thumbnailUrl} onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})} className="rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-order">Order Index</Label>
                  <Input id="edit-order" type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="rounded-none" />
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Switch id="edit-active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onSave} disabled={updateDashboard.isPending}>
                {updateDashboard.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-destructive">Delete Dashboard</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{dashboardToDelete?.title}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={onDelete} disabled={deleteDashboard.isPending}>
                {deleteDashboard.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              <TableHead className="w-[300px]">Dashboard</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : dashboards?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No dashboards found. Create your first dashboard to get started.
                </TableCell>
              </TableRow>
            ) : (
              dashboards?.sort((a, b) => {
                const c1 = clients?.find(c => c.id === a.clientId)?.name || "";
                const c2 = clients?.find(c => c.id === b.clientId)?.name || "";
                return c1.localeCompare(c2) || a.order - b.order;
              }).map((dashboard) => {
                const client = clients?.find(c => c.id === dashboard.clientId);
                return (
                  <TableRow key={dashboard.id} className="border-border">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{dashboard.title}</span>
                        {dashboard.thumbnailUrl && <span className="text-xs text-muted-foreground">Has thumbnail</span>}
                      </div>
                    </TableCell>
                    <TableCell>{client?.name || "Unknown"}</TableCell>
                    <TableCell>{dashboard.category || "—"}</TableCell>
                    <TableCell>
                      {dashboard.active ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 rounded-none">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 rounded-none">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboards/${dashboard.id}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-none">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => handleEditOpen(dashboard)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none" onClick={() => handleDeleteOpen(dashboard)}>
                          <Trash2 className="h-4 w-4" />
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
    </AdminLayout>
  );
}