import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Mail, Camera, LogOut, ChevronRight, ArrowLeft, HelpCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: isAdmin } = useIsAdmin();
  const updateProfile = useUpdateProfile();
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: "", phone: "", email: "", address: "", phone_public: false, email_public: false, address_public: false });

  const startEditing = () => {
    if (profile) {
      setForm({ display_name: profile.display_name || "", phone: profile.phone || "", email: profile.email || "", address: profile.address || "", phone_public: profile.phone_public, email_public: profile.email_public, address_public: profile.address_public });
    }
    setEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => { toast.success(t("profile.updated")); setEditing(false); },
      onError: () => toast.error(t("profile.updateError")),
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { toast.error(t("profile.avatarError")); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    updateProfile.mutate({ avatar_url: publicUrl }, { onSuccess: () => toast.success(t("profile.avatarUpdated")) });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success(t("profile.loggedOut"));
    navigate("/");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse w-16 h-16 rounded-full gradient-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={t("profile.title")} subtitle={t("profile.subtitle")} />
      <main className="px-4 space-y-6">
        <section className="animate-scale-in bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center"><User className="w-8 h-8 text-accent-foreground" /></div>
              )}
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md">
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile?.display_name || t("profile.user")}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
        </section>

        {editing ? (
          <section className="animate-slide-up bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="space-y-2">
              <Label>{t("profile.name")}</Label>
              <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("profile.phone")}</Label>
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{t("profile.public")}</span><Switch checked={form.phone_public} onCheckedChange={(v) => setForm({ ...form, phone_public: v })} /></div>
              </div>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+47 000 00 000" className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("profile.email")}</Label>
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{t("profile.public")}</span><Switch checked={form.email_public} onCheckedChange={(v) => setForm({ ...form, email_public: v })} /></div>
              </div>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("profile.address")}</Label>
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{t("profile.public")}</span><Switch checked={form.address_public} onCheckedChange={(v) => setForm({ ...form, address_public: v })} /></div>
              </div>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("profile.address")} className="h-12" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>{t("earnings.cancel")}</Button>
              <Button variant="hero" className="flex-1" onClick={handleSave} disabled={updateProfile.isPending}>{updateProfile.isPending ? t("profile.saving") : t("profile.save")}</Button>
            </div>
          </section>
        ) : (
          <section className="animate-slide-up">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button onClick={startEditing} className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{t("profile.personalInfo")}</p>
                  <p className="text-sm text-muted-foreground">{t("profile.personalInfoDesc")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              {profile?.phone && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{t("profile.phone")}</p>
                    <p className="text-sm text-muted-foreground">{profile.phone} {profile.phone_public ? t("profile.publicLabel") : t("profile.privateLabel")}</p>
                  </div>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{t("profile.email")}</p>
                    <p className="text-sm text-muted-foreground">{profile.email} {profile.email_public ? t("profile.publicLabel") : t("profile.privateLabel")}</p>
                  </div>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{t("profile.address")}</p>
                    <p className="text-sm text-muted-foreground">{profile.address} {profile.address_public ? t("profile.publicLabel") : t("profile.privateLabel")}</p>
                  </div>
                </div>
              )}
              <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><HelpCircle className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{t("profile.helpFaq")}</p>
                  <p className="text-sm text-muted-foreground">{t("profile.faqDesc")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </section>
        )}

        {isAdmin && (
          <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Button onClick={() => navigate("/admin0108fima")} variant="outline" size="lg" className="w-full text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground">
              <Shield className="w-5 h-5" />Admin Panel
            </Button>
          </section>
        )}

        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Button onClick={handleLogout} variant="outline" size="lg" className="w-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="w-5 h-5" />{t("profile.logout")}
          </Button>
        </section>

        <section className="text-center py-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <p className="text-xs text-muted-foreground">{t("profile.version")}</p>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
