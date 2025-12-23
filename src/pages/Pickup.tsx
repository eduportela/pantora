import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MapPin, Calendar, Clock, Package, Check, Home, Building2 } from "lucide-react";
import { toast } from "sonner";

const timeSlots = [
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
];

const dates = [
  { day: "Man", date: "23", full: "23. des" },
  { day: "Tir", date: "24", full: "24. des" },
  { day: "Ons", date: "25", full: "25. des" },
  { day: "Tor", date: "26", full: "26. des" },
  { day: "Fre", date: "27", full: "27. des" },
];

type PickupType = "home" | "dropoff";

export default function Pickup() {
  const navigate = useNavigate();
  const [pickupType, setPickupType] = useState<PickupType>("home");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!address || selectedDate === null || !selectedTime) {
      toast.error("Vennligst fyll ut alle felt");
      return;
    }

    toast.success("Henting bestilt!", {
      description: `${dates[selectedDate].full}, ${selectedTime}`,
    });
    navigate("/home");
  };

  const isFormValid = address && selectedDate !== null && selectedTime;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Bestill henting" subtitle="Velg tid og sted som passer deg" />

      <main className="px-4 space-y-6">
        {/* Pickup Type */}
        <section className="animate-fade-in">
          <label className="block text-sm font-medium text-foreground mb-3">
            Type henting
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPickupType("home")}
              className={`p-4 rounded-xl border-2 transition-all ${
                pickupType === "home"
                  ? "border-primary bg-accent"
                  : "border-border bg-card"
              }`}
            >
              <Home
                className={`w-6 h-6 mx-auto mb-2 ${
                  pickupType === "home" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <p
                className={`font-medium text-sm ${
                  pickupType === "home" ? "text-primary" : "text-foreground"
                }`}
              >
                Henting hjemme
              </p>
            </button>

            <button
              onClick={() => setPickupType("dropoff")}
              className={`p-4 rounded-xl border-2 transition-all ${
                pickupType === "dropoff"
                  ? "border-primary bg-accent"
                  : "border-border bg-card"
              }`}
            >
              <Building2
                className={`w-6 h-6 mx-auto mb-2 ${
                  pickupType === "dropoff" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <p
                className={`font-medium text-sm ${
                  pickupType === "dropoff" ? "text-primary" : "text-foreground"
                }`}
              >
                Leveringspunkt
              </p>
            </button>
          </div>
        </section>

        {/* Address */}
        <section className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <label className="block text-sm font-medium text-foreground mb-2">
            {pickupType === "home" ? "Din adresse" : "Velg leveringspunkt"}
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                pickupType === "home"
                  ? "F.eks. Storgata 15, Oslo"
                  : "Søk etter leveringspunkt"
              }
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </section>

        {/* Date Selection */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">Velg dato</label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex-shrink-0 w-16 py-3 rounded-xl border-2 transition-all ${
                  selectedDate === index
                    ? "border-primary bg-accent"
                    : "border-border bg-card"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    selectedDate === index ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {date.day}
                </p>
                <p
                  className={`text-lg font-bold mt-1 ${
                    selectedDate === index ? "text-primary" : "text-foreground"
                  }`}
                >
                  {date.date}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Time Selection */}
        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">Velg tidspunkt</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  selectedTime === time
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Estimate */}
        <section
          className="animate-slide-up bg-secondary rounded-xl p-4"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Estimert verdi</p>
              <p className="font-semibold text-foreground">ca. 85–120 kr</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Endelig beløp beregnes etter at flaskene er talt.
          </p>
        </section>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          variant="hero"
          size="xl"
          className="w-full animate-slide-up"
          style={{ animationDelay: "250ms" }}
          disabled={!isFormValid}
        >
          <Check className="w-5 h-5" />
          Bekreft henting
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
