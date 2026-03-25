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
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: isAdmin } = useIsAdmin();
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    email: "",
    address: "",
    phone_public: false,
    email_public: false,
    address_public: false,
  });

  const startEditing = () => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        address: profile.address || "",
        phone_public: profile.phone_public,
        email_public: profile.email_public,
        address_public: profile.address_public,
      });
    }
    setEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => {
        toast.success("Profilen er oppdatert");
        setEditing(false);
      },
      onError: () => toast.error("Kunne ikke oppdatere profilen"),
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Kunne ikke laste opp bilde");
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    updateProfile.mutate({ avatar_url: publicUrl }, {
      onSuccess: () => toast.success("Profilbilde oppdatert"),
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Du er nå logget ut");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full gradient-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Profil" subtitle="Din konto" />

      <main className="px-4 space-y-6">
        {/* Avatar & Name */}
        <section className="animate-scale-in bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-8 h-8 text-accent-foreground" />
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md">
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {profile?.display_name || "Bruker"}
              </h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Profile Info */}
        {editing ? (
          <section className="animate-slide-up bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="space-y-2">
              <Label>Navn</Label>
              <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Telefon</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Offentlig</span>
                  <Switch checked={form.phone_public} onCheckedChange={(v) => setForm({ ...form, phone_public: v })} />
                </div>
              </div>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+47 000 00 000" className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>E-post</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Offentlig</span>
                  <Switch checked={form.email_public} onCheckedChange={(v) => setForm({ ...form, email_public: v })} />
                </div>
              </div>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Adresse</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Offentlig</span>
                  <Switch checked={form.address_public} onCheckedChange={(v) => setForm({ ...form, address_public: v })} />
                </div>
              </div>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="h-12" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Avbryt</Button>
              <Button variant="hero" className="flex-1" onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Lagrer..." : "Lagre"}
              </Button>
            </div>
          </section>
        ) : (
          <section className="animate-slide-up">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button onClick={startEditing} className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Personlig informasjon</p>
                  <p className="text-sm text-muted-foreground">Navn, kontakt og personvern</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              {profile?.phone && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Telefon</p>
                    <p className="text-sm text-muted-foreground">{profile.phone} {profile.phone_public ? "(offentlig)" : "(privat)"}</p>
                  </div>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">E-post</p>
                    <p className="text-sm text-muted-foreground">{profile.email} {profile.email_public ? "(offentlig)" : "(privat)"}</p>
                  </div>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground">{profile.address} {profile.address_public ? "(offentlig)" : "(privat)"}</p>
                  </div>
                </div>
              )}
              <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Hjelp og FAQ</p>
                  <p className="text-sm text-muted-foreground">Vanlige spørsmål</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </section>
        )}

        {/* Admin Panel Link */}
        {isAdmin && (
          <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Button
              onClick={() => navigate("/admin0108fima")}
              variant="outline"
              size="lg"
              className="w-full text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </Button>
          </section>
        )}

        {/* Logout */}
        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-5 h-5" />
            Logg ut
          </Button>
        </section>

        <section className="text-center py-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <p className="text-xs text-muted-foreground">Pantora versjon 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Laget med ♥ i Norge</p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
