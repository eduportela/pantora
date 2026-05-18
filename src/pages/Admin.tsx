import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Users, FileText, AlertTriangle, HelpCircle, Shield, Trash2, Ban, Eye, Settings, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { COUNTRIES, Country } from "@/hooks/useCountry";
import { useAppSetting, useUpdateAppSetting } from "@/hooks/useAppSettings";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { t, lang } = useLanguage();
  const [adminCountry, setAdminCountry] = useState<Country>("NO");

  if (adminLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse w-16 h-16 rounded-full gradient-primary" /></div>;

  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Shield className="w-16 h-16 text-muted-foreground" />
      <p className="text-muted-foreground">{t("admin.noAccess")}</p>
      <Button onClick={() => navigate("/feed")}>{t("admin.back")}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground flex-1">{t("admin.title")}</h1>
          <Select value={adminCountry} onValueChange={(v) => setAdminCountry(v as Country)}>
            <SelectTrigger className="w-auto min-w-[110px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2"><span>{c.flag}</span><span>{c.name}</span></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <StatsOverview country={adminCountry} />
        <Tabs defaultValue="reports" className="mt-6">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="reports"><AlertTriangle className="w-4 h-4 mr-1" />{t("admin.reports")}</TabsTrigger>
            <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-1" />{t("admin.help")}</TabsTrigger>
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-1" />{t("admin.users")}</TabsTrigger>
            <TabsTrigger value="content"><FileText className="w-4 h-4 mr-1" />{t("admin.content")}</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" />{t("admin.settings")}</TabsTrigger>
          </TabsList>
          <TabsContent value="reports"><ReportsTab country={adminCountry} /></TabsContent>
          <TabsContent value="help"><HelpTab country={adminCountry} /></TabsContent>
          <TabsContent value="users"><UsersTab country={adminCountry} /></TabsContent>
          <TabsContent value="content"><ContentTab country={adminCountry} /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsOverview({ country }: { country: Country }) {
  const { t } = useLanguage();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats", country],
    queryFn: async () => {
      const [users, listings, reports, help] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("country", country),
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("country", country),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending").eq("country", country),
        supabase.from("help_requests").select("id", { count: "exact", head: true }).eq("status", "open").eq("country", country),
      ]);
      return { users: users.count ?? 0, listings: listings.count ?? 0, pendingReports: reports.count ?? 0, openHelp: help.count ?? 0 };
    },
  });

  const items = [
    { label: t("admin.users"), value: stats?.users ?? 0, icon: Users, color: "text-primary" },
    { label: t("feed.title"), value: stats?.listings ?? 0, icon: FileText, color: "text-primary" },
    { label: t("admin.pendingReports"), value: stats?.pendingReports ?? 0, icon: AlertTriangle, color: "text-destructive" },
    { label: t("admin.openHelp"), value: stats?.openHelp ?? 0, icon: HelpCircle, color: "text-warning" },
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
  const { t, lang } = useLanguage();
  const dateLocale = lang === "no" ? nb : enUS;

  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => { const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => { const { error } = await supabase.from("reports").update({ status, admin_notes }).eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-reports"] }); queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success(t("admin.reportUpdated")); },
  });

  const reasonLabels: Record<string, string> = { inappropriate: t("report.inappropriate"), scam: t("report.scam"), harmful: t("report.harmful"), spam: t("report.spam"), fake: t("report.fake"), other: t("report.other") };
  const statusColors: Record<string, string> = { pending: "bg-warning text-warning-foreground", reviewed: "bg-primary text-primary-foreground", resolved: "bg-success text-success-foreground", dismissed: "bg-muted text-muted-foreground" };

  return (
    <div className="space-y-3 mt-4">
      {reports.length === 0 && <p className="text-center text-muted-foreground py-8">{t("admin.noReports")}</p>}
      {reports.map((r: any) => (
        <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColors[r.status] || ""}>{r.status}</Badge>
                <Badge variant="outline">{r.report_type}</Badge>
                <Badge variant="secondary">{reasonLabels[r.reason] || r.reason}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: dateLocale })}</p>
            </div>
          </div>
          {r.description && <p className="text-sm text-foreground">{r.description}</p>}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "reviewed" })}>{t("admin.reviewed")}</Button>
            <Button size="sm" variant="default" onClick={() => updateReport.mutate({ id: r.id, status: "resolved" })}>{t("admin.resolved")}</Button>
            <Button size="sm" variant="ghost" onClick={() => updateReport.mutate({ id: r.id, status: "dismissed" })}>{t("admin.dismiss")}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function HelpTab() {
  const queryClient = useQueryClient();
  const { t, lang } = useLanguage();
  const dateLocale = lang === "no" ? nb : enUS;

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-help"],
    queryFn: async () => { const { data, error } = await supabase.from("help_requests").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const updateHelp = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("help_requests").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-help"] }); queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success(t("admin.statusUpdated")); },
  });

  const categoryLabels: Record<string, string> = { account: t("help.account"), listing: t("help.listings"), payment: t("help.payment"), safety: t("help.safety"), bug: t("help.bug"), other: t("help.other") };

  return (
    <div className="space-y-3 mt-4">
      {requests.length === 0 && <p className="text-center text-muted-foreground py-8">{t("admin.noHelp")}</p>}
      {requests.map((r: any) => (
        <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={r.status === "open" ? "default" : "secondary"}>{r.status}</Badge>
            <Badge variant="outline">{categoryLabels[r.category] || r.category}</Badge>
          </div>
          <p className="text-sm font-medium text-foreground">{r.name} — <span className="text-muted-foreground">{r.email}</span></p>
          <p className="text-sm text-foreground">{r.message}</p>
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: dateLocale })}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => updateHelp.mutate({ id: r.id, status: "in_progress" })}>{t("admin.inProgress")}</Button>
            <Button size="sm" variant="default" onClick={() => updateHelp.mutate({ id: r.id, status: "resolved" })}>{t("admin.resolved")}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => { const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => { const { data, error } = await supabase.from("user_roles").select("*"); if (error) return []; return data; },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isCurrentlyAdmin }: { userId: string; isCurrentlyAdmin: boolean }) => {
      if (isCurrentlyAdmin) { const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin"); if (error) throw error; }
      else { const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" }); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-roles"] }); toast.success(t("admin.roleUpdated")); },
    onError: () => toast.error(t("admin.roleError")),
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => { const { error } = await supabase.from("profiles").delete().eq("user_id", userId); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-users"] }); queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success(t("admin.userDeleted")); },
  });

  const isUserAdmin = (userId: string) => roles.some((r: any) => r.user_id === userId && r.role === "admin");

  return (
    <div className="space-y-3 mt-4">
      {profiles.map((p: any) => (
        <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            {p.avatar_url ? <img src={p.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" /> : <span className="text-sm font-bold text-accent-foreground">{(p.display_name || "?")[0].toUpperCase()}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{p.display_name || t("listing.anonymous")}</p>
            <p className="text-xs text-muted-foreground truncate">{p.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isUserAdmin(p.user_id) && <Badge className="bg-primary text-primary-foreground">Admin</Badge>}
            <Button size="sm" variant={isUserAdmin(p.user_id) ? "secondary" : "outline"} onClick={() => toggleAdmin.mutate({ userId: p.user_id, isCurrentlyAdmin: isUserAdmin(p.user_id) })}><Shield className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm(t("admin.deleteUserConfirm"))) deleteUser.mutate(p.user_id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentTab() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: listings = [] } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const userIds = [...new Set(data.map((l) => l.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return data.map((l) => ({ ...l, profiles: profileMap.get(l.user_id) || null }));
    },
  });

  const deleteListing = useMutation({
    mutationFn: async ({ id, userId, reason }: { id: string; userId: string; reason: string }) => {
      await supabase.from("notifications").insert({ user_id: userId, type: "moderation", title: t("listing.deleted"), body: reason, listing_id: id });
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-listings"] }); queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success(t("admin.listingDeleted")); },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const handleDelete = () => {
    if (!selectedItem || !deleteReason) return;
    deleteListing.mutate({ id: selectedItem.id, userId: selectedItem.user_id, reason: deleteReason });
    setDeleteDialogOpen(false); setDeleteReason(""); setSelectedItem(null);
  };

  return (
    <div className="space-y-3 mt-4">
      {listings.map((l: any) => (
        <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          {l.images?.[0] && <img src={l.images[0]} className="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{l.title}</p>
            <p className="text-xs text-muted-foreground">{(l.profiles as any)?.display_name || t("listing.anonymous")} · {l.location}</p>
          </div>
          <Button size="sm" variant="ghost" className="text-destructive shrink-0" onClick={() => { setSelectedItem(l); setDeleteDialogOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{t("admin.deleteListing")}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{t("admin.deleteNotify")}</p>
          <Select value={deleteReason} onValueChange={setDeleteReason}>
            <SelectTrigger><SelectValue placeholder={t("admin.selectReason")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Inappropriate content">{t("report.inappropriate")}</SelectItem>
              <SelectItem value="Scam">{t("report.scam")}</SelectItem>
              <SelectItem value="Terms violation">{t("terms.title")}</SelectItem>
              <SelectItem value="Spam">{t("report.spam")}</SelectItem>
              <SelectItem value="Dangerous content">{t("report.harmful")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={!deleteReason}>{t("admin.deleteAndNotify")}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
