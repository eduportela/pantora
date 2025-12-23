import { Calendar, MapPin, Package, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

const statusConfig = {
  planlagt: {
    label: "Planlagt",
    className: "bg-warning/10 text-warning",
  },
  fullført: {
    label: "Fullført",
    className: "bg-primary/10 text-primary",
  },
  utbetalt: {
    label: "Utbetalt",
    className: "bg-success/10 text-success",
  },
};

export function PickupCard({
  id,
  date,
  time,
  address,
  status,
  amount,
  estimatedAmount,
  onClick,
}: PickupCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Henting</p>
            <p className="font-semibold text-foreground">#{id}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            statusInfo.className
          )}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>

      {(amount || estimatedAmount) && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {status === "planlagt" ? "Estimert verdi" : "Beløp"}
            </span>
            <span className="font-semibold text-foreground">
              {amount
                ? `${amount.toLocaleString("nb-NO")} kr`
                : estimatedAmount}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
