import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportButtonProps {
  reportType: "listing" | "comment" | "profile";
  targetId: string;
  variant?: "icon" | "text";
}

export function ReportButton({ reportType, targetId, variant = "icon" }: ReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Velg en grunn for rapporten");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      report_type: reportType,
      target_id: targetId,
      reason,
      description: description.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Kunne ikke sende rapporten");
      return;
    }
    toast.success("Rapport sendt. Takk for at du hjelper oss!");
    setReason("");
    setDescription("");
    setOpen(false);
  };

  const typeLabels = {
    listing: "annonsen",
    comment: "kommentaren",
    profile: "profilen",
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Rapporter"
        >
          <Flag className="w-4 h-4" />
        </button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-muted-foreground hover:text-destructive">
          <Flag className="w-4 h-4 mr-1" />
          Rapporter
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rapporter {typeLabels[reportType]}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Grunn</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg grunn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Upassende innhold</SelectItem>
                  <SelectItem value="scam">Svindel</SelectItem>
                  <SelectItem value="harmful">Skadelig eller truende</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="fake">Falsk informasjon</SelectItem>
                  <SelectItem value="other">Annet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Beskrivelse (valgfritt)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Gi oss mer detaljer..."
                rows={3}
                className="resize-none"
              />
            </div>
            <Button className="w-full" variant="destructive" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sender..." : "Send rapport"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
