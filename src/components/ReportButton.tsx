import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportButtonProps {
  reportType: "listing" | "comment" | "profile" | "conversation" | "user" | "message";
  targetId: string;
  variant?: "icon" | "text";
  trigger?: React.ReactNode;
}

export function ReportButton({ reportType, targetId, variant = "icon" }: ReportButtonProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!reason) { toast.error(t("report.selectError")); return; }
    setLoading(true);
    const { error } = await supabase.from("reports").insert({ reporter_id: user.id, report_type: reportType, target_id: targetId, reason, description: description.trim() || null });
    setLoading(false);
    if (error) { toast.error(t("report.error")); return; }
    toast.success(t("report.sent"));
    setReason(""); setDescription(""); setOpen(false);
  };

  const typeLabels: Record<string, string> = {
    listing: t("report.listing"),
    comment: t("report.comment"),
    profile: t("report.profile"),
  };

  return (
    <>
      {variant === "icon" ? (
        <button onClick={() => setOpen(true)} className="text-muted-foreground hover:text-destructive transition-colors" title={t("report.btn")}>
          <Flag className="w-4 h-4" />
        </button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-muted-foreground hover:text-destructive">
          <Flag className="w-4 h-4 mr-1" />{t("report.btn")}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{t("report.title")} {typeLabels[reportType]}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("report.reason")}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder={t("report.selectReason")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">{t("report.inappropriate")}</SelectItem>
                  <SelectItem value="scam">{t("report.scam")}</SelectItem>
                  <SelectItem value="harmful">{t("report.harmful")}</SelectItem>
                  <SelectItem value="spam">{t("report.spam")}</SelectItem>
                  <SelectItem value="fake">{t("report.fake")}</SelectItem>
                  <SelectItem value="other">{t("report.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("report.description")}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("report.descPlaceholder")} rows={3} className="resize-none" />
            </div>
            <Button className="w-full" variant="destructive" onClick={handleSubmit} disabled={loading}>
              {loading ? t("report.sending") : t("report.send")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
