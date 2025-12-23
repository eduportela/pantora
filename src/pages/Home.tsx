import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { PickupCard } from "@/components/PickupCard";
import { BottomNav } from "@/components/BottomNav";
import { CalendarPlus, HelpCircle, ChevronRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Mock data
  const balance = 124.0;
  const pendingAmount = 85;
  const upcomingPickup = {
    id: "1042",
    date: "24. des 2025",
    time: "10:00–12:00",
    address: "Storgata 15, 0184 Oslo",
    status: "planlagt" as const,
    estimatedAmount: "ca. 85–120 kr",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showLogo />

      <main className="px-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard balance={balance} pendingAmount={pendingAmount} />

        {/* Primary CTA */}
        <Button
          onClick={() => navigate("/pickup")}
          variant="hero"
          size="xl"
          className="w-full"
        >
          <CalendarPlus className="w-5 h-5" />
          Bestill henting
        </Button>

        {/* Upcoming Pickup */}
        {upcomingPickup && (
          <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Neste henting</h2>
              <button
                onClick={() => navigate("/history")}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                Se alle
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <PickupCard {...upcomingPickup} onClick={() => navigate("/history")} />
          </section>
        )}

        {/* Quick Actions */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-foreground text-sm">Historikk</span>
            </button>

            <button
              onClick={() => {}}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground text-sm">Hvordan fungerer det?</span>
            </button>
          </div>
        </section>

        {/* Info Banner */}
        <section
          className="animate-slide-up bg-secondary rounded-xl p-4 border border-primary/10"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                Pant når det passer deg
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Vi henter. Du tjener. Enklere resirkulering for alle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
