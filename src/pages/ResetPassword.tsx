import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import pantoraLogo from "@/assets/pantora-logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase auto-parses the recovery token in the URL hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error(t("auth.passwordTooShort")); return; }
    if (password !== confirm) { toast.error(t("auth.passwordMismatch")); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("auth.passwordUpdated"));
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <img src={pantoraLogo} alt="Pantora" className="w-16 h-16 mb-6" />
      <h1 className="text-2xl font-bold text-foreground mb-2">{t("auth.resetTitle")}</h1>
      <p className="text-muted-foreground text-center mb-8 text-sm">{t("auth.resetSubtitle")}</p>

      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label>{t("auth.newPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-12 pr-12" required minLength={6} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t("auth.confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-12 pl-12" required minLength={6} />
          </div>
        </div>
        <Button type="submit" size="xl" className="w-full" disabled={loading || !ready}>
          {loading ? t("auth.loading") : t("auth.updatePassword")}
        </Button>
        {!ready && <p className="text-xs text-center text-muted-foreground">{t("auth.openFromEmail")}</p>}
      </form>
    </div>
  );
}
