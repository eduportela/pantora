import { Header } from "@/components/Header";
import { PickupCard } from "@/components/PickupCard";
import { BottomNav } from "@/components/BottomNav";
import { Package } from "lucide-react";

const pickups = [
  {
    id: "1042",
    date: "24. des 2025",
    time: "10:00–12:00",
    address: "Storgata 15, 0184 Oslo",
    status: "planlagt" as const,
    estimatedAmount: "ca. 85–120 kr",
  },
  {
    id: "1041",
    date: "20. des 2025",
    time: "14:00–16:00",
    address: "Storgata 15, 0184 Oslo",
    status: "utbetalt" as const,
    amount: 87,
  },
  {
    id: "1040",
    date: "15. des 2025",
    time: "10:00–12:00",
    address: "Storgata 15, 0184 Oslo",
    status: "utbetalt" as const,
    amount: 124.5,
  },
  {
    id: "1039",
    date: "8. des 2025",
    time: "12:00–14:00",
    address: "Storgata 15, 0184 Oslo",
    status: "utbetalt" as const,
    amount: 56,
  },
  {
    id: "1038",
    date: "1. des 2025",
    time: "16:00–18:00",
    address: "Storgata 15, 0184 Oslo",
    status: "utbetalt" as const,
    amount: 203,
  },
];

export default function History() {
  const planned = pickups.filter((p) => p.status === "planlagt");
  const completed = pickups.filter((p) => p.status !== "planlagt");

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Historikk" subtitle="Dine hentinger" />

      <main className="px-4 space-y-6">
        {/* Planned Pickups */}
        {planned.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              Planlagte hentinger
            </h2>
            <div className="space-y-3">
              {planned.map((pickup) => (
                <PickupCard key={pickup.id} {...pickup} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Pickups */}
        {completed.length > 0 && (
          <section
            className="animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Fullførte hentinger
            </h2>
            <div className="space-y-3">
              {completed.map((pickup, index) => (
                <div
                  key={pickup.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <PickupCard {...pickup} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {pickups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Ingen hentinger ennå
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Bestill din første henting for å komme i gang med Pantora.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
