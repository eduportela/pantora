import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { BottomNav } from "@/components/BottomNav";
import { ArrowUpRight, CreditCard, Smartphone, Check } from "lucide-react";
import { toast } from "sonner";

const transactions = [
  {
    id: "1041",
    date: "20. des 2025",
    amount: 87.0,
    status: "utbetalt",
  },
  {
    id: "1040",
    date: "15. des 2025",
    amount: 124.5,
    status: "utbetalt",
  },
  {
    id: "1039",
    date: "8. des 2025",
    amount: 56.0,
    status: "utbetalt",
  },
  {
    id: "1038",
    date: "1. des 2025",
    amount: 203.0,
    status: "utbetalt",
  },
];

type WithdrawMethod = "vipps" | "bank" | null;

export default function Earnings() {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const balance = 124.0;
  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0) + balance;

  const handleWithdraw = () => {
    if (!selectedMethod) {
      toast.error("Velg en utbetalingsmetode");
      return;
    }
    toast.success("Utbetaling startet!", {
      description: `${balance.toLocaleString("nb-NO")} kr sendes til ${
        selectedMethod === "vipps" ? "Vipps" : "bankkonto"
      }`,
    });
    setShowWithdraw(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Inntekter" subtitle="Oversikt over dine inntekter" />

      <main className="px-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard balance={balance} />

        {/* Withdraw Button */}
        {!showWithdraw ? (
          <Button
            onClick={() => setShowWithdraw(true)}
            variant="hero"
            size="lg"
            className="w-full"
          >
            <ArrowUpRight className="w-5 h-5" />
            Ta ut penger
          </Button>
        ) : (
          <section className="animate-scale-in bg-card rounded-xl p-4 border border-border shadow-card">
            <h3 className="font-semibold text-foreground mb-4">Velg utbetalingsmetode</h3>

            <div className="space-y-3 mb-4">
              <button
                onClick={() => setSelectedMethod("vipps")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === "vipps"
                    ? "border-primary bg-accent"
                    : "border-border"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF5B24] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Vipps</p>
                  <p className="text-sm text-muted-foreground">Rask overføring</p>
                </div>
                {selectedMethod === "vipps" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>

              <button
                onClick={() => setSelectedMethod("bank")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === "bank"
                    ? "border-primary bg-accent"
                    : "border-border"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Bankkonto</p>
                  <p className="text-sm text-muted-foreground">1–2 virkedager</p>
                </div>
                {selectedMethod === "bank" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowWithdraw(false)}
                variant="outline"
                className="flex-1"
              >
                Avbryt
              </Button>
              <Button onClick={handleWithdraw} variant="hero" className="flex-1">
                Ta ut {balance.toLocaleString("nb-NO")} kr
              </Button>
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="bg-secondary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totalt tjent</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalEarnings.toLocaleString("nb-NO", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  kr
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h2 className="font-semibold text-foreground mb-3">Transaksjoner</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Henting #{tx.id}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <p className="font-semibold text-success">
                  +{tx.amount.toLocaleString("nb-NO")} kr
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
