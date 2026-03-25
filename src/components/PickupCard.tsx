import { Calendar, MapPin, Package, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

type PickupStatus = "planlagt" | "fullført" | "utbetalt";

interface PickupCardProps {
  id: string;
  date: string;
  time: string;
  address: string;
  status: PickupStatus;
  amount?: number;
  estimatedAmount?: string;
  onClick?: () => void;
}

export function PickupCard({ id, date, time, address, status, amount, estimatedAmount, onClick }: PickupCardProps) {
  const { t } = useLanguage();

  const statusConfig = {
    planlagt: { label: t("pickup.planned"), className: "bg-warning/10 text-warning" },
    fullført: { label: t("pickup.completed"), className: "bg-primary/10 text-primary" },
    utbetalt: { label: t("pickup.paidOut"), className: "bg-success/10 text-success" },
  };

  const statusInfo = statusConfig[status];

  return (
    <button onClick={onClick} className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("pickup.pickup")}</p>
            <p className="font-semibold text-foreground">#{id}</p>
          </div>
        </div>
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusInfo.className)}>{statusInfo.label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" /><span>{date}</span>
          <Clock className="w-4 h-4 ml-2" /><span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" /><span className="truncate">{address}</span>
        </div>
      </div>
      {(amount || estimatedAmount) && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{status === "planlagt" ? t("pickup.estimatedValue") : t("pickup.amount")}</span>
            <span className="font-semibold text-foreground">{amount ? `${amount.toLocaleString("nb-NO")} kr` : estimatedAmount}</span>
          </div>
        </div>
      )}
    </button>
  );
}
