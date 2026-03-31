import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SafetyTipsDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
  continueLabel?: string;
}

export function SafetyTipsDialog({ open, onClose, onContinue, continueLabel }: SafetyTipsDialogProps) {
  const { t } = useLanguage();

  const tips = [
    { title: t("safety.t1"), desc: t("safety.d1") },
    { title: t("safety.t2"), desc: t("safety.d2") },
    { title: t("safety.t3"), desc: t("safety.d3") },
    { title: t("safety.t4"), desc: t("safety.d4") },
    { title: t("safety.t5"), desc: t("safety.d5") },
    { title: t("safety.t6"), desc: t("safety.d6") },
    { title: t("safety.t7"), desc: t("safety.d7") },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle>{t("safety.title")}</DialogTitle>
          </div>
          <DialogDescription className="text-left">{t("safety.intro")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 max-h-[55vh]">
          <div className="space-y-4 pb-2">
            {tips.map((tip, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">{i + 1}. {tip.title}</h4>
                <p className="text-muted-foreground text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic border-t border-border pt-3 mt-4 mb-4">{t("safety.footer")}</p>
        </ScrollArea>
        <div className="px-6 pb-6 pt-2">
          <Button variant="hero" className="w-full" onClick={() => { onClose(); onContinue?.(); }}>
            {continueLabel || t("safety.understood")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}