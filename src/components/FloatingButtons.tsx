import { useEffect, useState } from "react";
import { Mail, HelpCircle, Send, User, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useChatEnabled } from "@/hooks/useAppSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function FloatingButtons() {
  const [contactOpen, setContactOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { user } = useAuth();
  const chatEnabled = useChatEnabled();
  const navigate = useNavigate();
  const location = useLocation();
  const [tick, setTick] = useState(0);

  const hideChatRoutes = ["/auth", "/onboarding", "/"];
  const onChatPage = location.pathname.startsWith("/chat") || location.pathname === "/inbox";
  const showChat = !!user && chatEnabled && !onChatPage && !hideChatRoutes.includes(location.pathname);

  const { data: unread = 0 } = useQuery({
    queryKey: ["fab-unread", user?.id, tick],
    enabled: showChat,
    queryFn: async () => {
      const { data: convs } = await supabase
        .from("conversations").select("id").or(`user_a.eq.${user!.id},user_b.eq.${user!.id}`);
      if (!convs?.length) return 0;
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("conversation_id", convs.map((c) => c.id))
        .neq("sender_id", user!.id)
        .is("read_at", null);
      return count ?? 0;
    },
  });

  useEffect(() => {
    if (!showChat) return;
    const ch = supabase
      .channel("fab-unread")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => setTick((v) => v + 1))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [showChat]);

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 items-end">
        {showChat && (
          <button
            onClick={() => navigate("/inbox")}
            className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Chat"
          >
            <MessageCircle className="w-6 h-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        )}
        <button onClick={() => setContactOpen(true)} className="w-12 h-12 rounded-full bg-card text-foreground border border-border shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label="Contact">
          <Mail className="w-5 h-5" />
        </button>
        <button onClick={() => setHelpOpen(true)} className="w-12 h-12 rounded-full bg-card text-foreground border border-border shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label="Help">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}

function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{t("contact.title")}</DialogTitle></DialogHeader>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><User className="w-7 h-7 text-primary" /></div>
          <div>
            <p className="font-semibold text-foreground">Maria Figueiredo</p>
            <a href="mailto:mariafigueiredo233@gmail.com" className="text-sm text-primary font-medium hover:underline break-all">mariafigueiredo233@gmail.com</a>
          </div>
        </div>
        <Button variant="default" className="w-full" onClick={() => window.location.href = "mailto:mariafigueiredo233@gmail.com"}>
          <Mail className="w-4 h-4 mr-2" />{t("contact.sendEmail")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function HelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !category || !message.trim()) {
      toast.error(t("help.fillAll"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("help_requests").insert({ user_id: user?.id || null, name: name.trim(), email: email.trim(), category, message: message.trim() });
    setLoading(false);
    if (error) { toast.error(t("help.error")); return; }
    toast.success(t("help.sent"));
    setName(""); setEmail(""); setCategory(""); setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{t("help.title")}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("help.name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("help.namePlaceholder")} />
          </div>
          <div className="space-y-2">
            <Label>{t("help.email")}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("help.emailPlaceholder")} />
          </div>
          <div className="space-y-2">
            <Label>{t("help.category")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder={t("help.selectCategory")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="account">{t("help.account")}</SelectItem>
                <SelectItem value="listing">{t("help.listings")}</SelectItem>
                <SelectItem value="payment">{t("help.payment")}</SelectItem>
                <SelectItem value="safety">{t("help.safety")}</SelectItem>
                <SelectItem value="bug">{t("help.bug")}</SelectItem>
                <SelectItem value="other">{t("help.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("help.message")}</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("help.messagePlaceholder")} rows={4} className="resize-none" />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />{loading ? t("help.sending") : t("help.send")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
