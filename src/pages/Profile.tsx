import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  HelpCircle,
  ChevronRight,
  LogOut,
  Recycle,
} from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  {
    icon: User,
    label: "Personlig informasjon",
    description: "Navn og kontaktinfo",
    action: () => {},
  },
  {
    icon: Phone,
    label: "Telefonnummer",
    description: "+47 123 45 678",
    action: () => {},
  },
  {
    icon: MapPin,
    label: "Adresser",
    description: "1 lagret adresse",
    action: () => {},
  },
  {
    icon: CreditCard,
    label: "Betalingsmetoder",
    description: "Vipps, Bankkonto",
    action: () => {},
  },
  {
    icon: HelpCircle,
    label: "Hjelp og FAQ",
    description: "Vanlige spørsmål",
    action: () => {},
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("pantora_user");
    toast.success("Du er nå logget ut");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Profil" subtitle="Din konto og innstillinger" />

      <main className="px-4 space-y-6">
        {/* User Info Card */}
        <section className="animate-scale-in bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Ola Nordmann</h2>
              <p className="text-muted-foreground">+47 123 45 678</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        {showStats && (
          <section
            className="animate-slide-up bg-secondary rounded-xl p-4"
            style={{ animationDelay: "50ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Din miljøpåvirkning</p>
                <p className="text-xs text-muted-foreground">Takk for at du resirkulerer!</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">142</p>
                <p className="text-xs text-muted-foreground">Flasker</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">Hentinger</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">12 kg</p>
                <p className="text-xs text-muted-foreground">CO₂ spart</p>
              </div>
            </div>
          </section>
        )}

        {/* Menu Items */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-5 h-5" />
            Logg ut
          </Button>
        </section>

        {/* App Info */}
        <section
          className="text-center py-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-xs text-muted-foreground">
            Pantora versjon 1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Laget med ♥ i Norge
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
