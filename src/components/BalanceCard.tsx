import { Wallet, TrendingUp } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  pendingAmount?: number;
}

export function BalanceCard({ balance, pendingAmount = 0 }: BalanceCardProps) {
  return (
    <div className="gradient-balance rounded-2xl p-6 text-primary-foreground shadow-lg animate-scale-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Din saldo</p>
          <p className="text-4xl font-bold tracking-tight">
            {balance.toLocaleString("nb-NO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span className="text-2xl font-semibold">kr</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
      </div>
      
      {pendingAmount > 0 && (
        <div className="mt-4 pt-4 border-t border-primary-foreground/20 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 opacity-80" />
          <span className="text-sm opacity-90">
            +{pendingAmount.toLocaleString("nb-NO")} kr venter
          </span>
        </div>
      )}
    </div>
  );
}
