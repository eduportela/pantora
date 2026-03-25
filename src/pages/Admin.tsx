import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, FileText, AlertTriangle, HelpCircle, Shield, Trash2, Ban, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (adminLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse w-16 h-16 rounded-full gradient-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">Du har ikke tilgang til denne siden</p>
        <Button onClick={() => navigate("/feed")}>Tilbake</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <StatsOverview />

        <Tabs defaultValue="reports" className="mt-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="reports"><AlertTriangle className="w-4 h-4 mr-1" />Rapporter</TabsTrigger>
            <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-1" />Hjelp</TabsTrigger>
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-1" />Brukere</TabsTrigger>
            <TabsTrigger value="content"><FileText className="w-4 h-4 mr-1" />Innhold</TabsTrigger>
          </TabsList>

          <TabsContent value="reports"><ReportsTab /></TabsContent>
          <TabsContent value="help"><HelpTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="content"><ContentTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, listings, reports, help] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("help_requests").select("id", { count: "exact", head: true }).eq("status", "open"),
      ]);
      return {
        users: users.count ?? 0,
        listings: listings.count ?? 0,
        pendingReports: reports.count ?? 0,
        openHelp: help.count ?? 0,
      };
    },
  });

  const items = [
    { label: "Brukere", value: stats?.users ?? 0, icon: Users, color: "text-primary" },
    { label: "Annonser", value: stats?.listings ?? 0, icon: FileText, color: "text-primary" },
    { label: "Ventende rapporter", value: stats?.pendingReports ?? 0, icon: AlertTriangle, color: "text-destructive" },
    { label: "Åpne hjelpeforespørsler", value: stats?.openHelp ?? 0, icon: HelpCircle, color: "text-warning" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-card rounded-xl border border-border p-4">
          <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function ReportsTab() {
  const queryClient = useQueryClient();
  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { error } = await supabase.from("reports").update({ status, admin_notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Rapport oppdatert");
    },
  });

  const reasonLabels: Record<string, string> = {
    inappropriate: "Upassende",
    scam: "Svindel",
    harmful: "Skadelig",
    spam: "Spam",
    fake: "Falsk info",
    other: "Annet",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-warning text-warning-foreground",
    reviewed: "bg-primary text-primary-foreground",
    resolved: "bg-success text-success-foreground",
    dismissed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-3 mt-4">
      {reports.length === 0 && <p className="text-center text-muted-foreground py-8">Ingen rapporter</p>}
      {reports.map((r: any) => (
        <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColors[r.status] || ""}>{r.status}</Badge>
                <Badge variant="outline">{r.report_type}</Badge>
                <Badge variant="secondary">{reasonLabels[r.reason] || r.reason}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: nb })}
              </p>
            </div>
          </div>
          {r.description && <p className="text-sm text-foreground">{r.description}</p>}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "reviewed" })}>Gjennomgått</Button>
            <Button size="sm" variant="default" onClick={() => updateReport.mutate({ id: r.id, status: "resolved" })}>Løst</Button>
            <Button size="sm" variant="ghost" onClick={() => updateReport.mutate({ id: r.id, status: "dismissed" })}>Avvis</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function HelpTab() {
  const queryClient = useQueryClient();
  const { data: requests = [] } = useQuery({
    queryKey: ["admin-help"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateHelp = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("help_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-help"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Status oppdatert");
    },
  });

  const categoryLabels: Record<string, string> = {
    account: "Konto",
    listing: "Annonser",
    payment: "Betaling",
    safety: "Sikkerhet",
    bug: "Feil",
    other: "Annet",
  };

  return (
    <div className="space-y-3 mt-4">
      {requests.length === 0 && <p className="text-center text-muted-foreground py-8">Ingen hjelpeforespørsler</p>}
      {requests.map((r: any) => (
        <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={r.status === "open" ? "default" : "secondary"}>{r.status}</Badge>
            <Badge variant="outline">{categoryLabels[r.category] || r.category}</Badge>
          </div>
          <p className="text-sm font-medium text-foreground">{r.name} — <span className="text-muted-foreground">{r.email}</span></p>
          <p className="text-sm text-foreground">{r.message}</p>
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: nb })}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => updateHelp.mutate({ id: r.id, status: "in_progress" })}>Under behandling</Button>
            <Button size="sm" variant="default" onClick={() => updateHelp.mutate({ id: r.id, status: "resolved" })}>Løst</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      if (error) return [];
      return data;
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isCurrentlyAdmin }: { userId: string; isCurrentlyAdmin: boolean }) => {
      if (isCurrentlyAdmin) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Rolle oppdatert");
    },
    onError: () => toast.error("Kunne ikke oppdatere rollen"),
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Delete profile - cascades handle the rest
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Bruker slettet");
    },
  });

  const isUserAdmin = (userId: string) => roles.some((r: any) => r.user_id === userId && r.role === "admin");

  return (
    <div className="space-y-3 mt-4">
      {profiles.map((p: any) => (
        <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            {p.avatar_url ? (
              <img src={p.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />
            ) : (
              <span className="text-sm font-bold text-accent-foreground">{(p.display_name || "?")[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{p.display_name || "Anonym"}</p>
            <p className="text-xs text-muted-foreground truncate">{p.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isUserAdmin(p.user_id) && <Badge className="bg-primary text-primary-foreground">Admin</Badge>}
            <Button
              size="sm"
              variant={isUserAdmin(p.user_id) ? "secondary" : "outline"}
              onClick={() => toggleAdmin.mutate({ userId: p.user_id, isCurrentlyAdmin: isUserAdmin(p.user_id) })}
            >
              <Shield className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                if (confirm("Er du sikker på at du vil slette denne brukeren?")) {
                  deleteUser.mutate(p.user_id);
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentTab() {
  const queryClient = useQueryClient();

  const { data: listings = [] } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(display_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteListing = useMutation({
    mutationFn: async ({ id, userId, reason }: { id: string; userId: string; reason: string }) => {
      // Notify user
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "moderation",
        title: "Annonsen din ble fjernet",
        body: `Grunn: ${reason}`,
        listing_id: id,
      });
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Annonse slettet og bruker varslet");
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const handleDelete = () => {
    if (!selectedItem || !deleteReason) return;
    deleteListing.mutate({ id: selectedItem.id, userId: selectedItem.user_id, reason: deleteReason });
    setDeleteDialogOpen(false);
    setDeleteReason("");
    setSelectedItem(null);
  };

  return (
    <div className="space-y-3 mt-4">
      {listings.map((l: any) => (
        <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          {l.images?.[0] && (
            <img src={l.images[0]} className="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{l.title}</p>
            <p className="text-xs text-muted-foreground">{(l.profiles as any)?.display_name || "Anonym"} · {l.location}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive shrink-0"
            onClick={() => { setSelectedItem(l); setDeleteDialogOpen(true); }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Slett annonse</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Brukeren vil bli varslet om grunnen til slettingen.</p>
          <Select value={deleteReason} onValueChange={setDeleteReason}>
            <SelectTrigger>
              <SelectValue placeholder="Velg grunn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upassende innhold">Upassende innhold</SelectItem>
              <SelectItem value="Svindel">Svindel</SelectItem>
              <SelectItem value="Brudd på vilkår">Brudd på vilkår</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Farlig innhold">Farlig innhold</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={!deleteReason}>
            Slett og varsle bruker
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
