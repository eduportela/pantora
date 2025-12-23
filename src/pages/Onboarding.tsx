import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Truck, Banknote, ArrowRight, Phone } from "lucide-react";
import pantoraLogo from "@/assets/pantora-logo.png";
const steps = [{
  icon: Recycle,
  title: "Samle flasker",
  description: "Samle tomflasker og bokser hjemme. Ingen sortering nødvendig."
}, {
  icon: Truck,
  title: "Bestill henting",
  description: "Velg dag og tid som passer deg. Vi kommer til døren din."
}, {
  icon: Banknote,
  title: "Få betalt",
  description: "Motta pengene rett på konto. Raskt og enkelt."
}];
export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLogin(true);
    }
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 8) {
      localStorage.setItem("pantora_user", JSON.stringify({
        phone
      }));
      navigate("/home");
    }
  };
  if (showLogin) {
    return <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="animate-fade-in flex flex-col items-center mb-12">
            <img src={pantoraLogo} alt="Pantora" className="w-24 h-24 mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Velkommen til Pantora</h1>
            <p className="text-muted-foreground mt-2 text-center">
              Logg inn for å komme i gang
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefonnummer
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+47 000 00 000" className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full">
              Fortsett
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">eller</span>
              </div>
            </div>

            <Button type="button" variant="outline" size="xl" className="w-full" disabled>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Vipps (kommer snart)
            </Button>
          </form>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="animate-fade-in flex flex-col items-center mb-8">
          <img alt="Pantora" className="w-20 h-20 mb-6" src="/lovable-uploads/60469bc2-0b08-4b21-9304-884a5ee9b507.png" />
          <h1 className="text-3xl font-bold text-foreground leading-tight text-left">      En liten handling for                        deg
      En stor forskjell for                       miljøet<br />
            Tjen penger.
          </h1>
          <p className="text-muted-foreground mt-3 text-center text-sm my-[13px]"> Tjen penger uten å forlate hjemmet.</p>
        </div>

        <div className="w-full max-w-sm space-y-4 mb-12">
          {steps.map((step, index) => <div key={index} className={`animate-slide-up flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${index === currentStep ? "bg-accent shadow-card scale-[1.02]" : index < currentStep ? "opacity-60" : "opacity-40"}`} style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${index === currentStep ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>)}
        </div>

        <div className="w-full max-w-sm">
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => <div key={index} className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? "w-8 bg-primary" : index < currentStep ? "w-2 bg-primary/50" : "w-2 bg-border"}`} />)}
          </div>

          <Button onClick={handleNext} variant="hero" size="xl" className="w-full">
            {currentStep < steps.length - 1 ? "Neste" : "Kom i gang"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>;
}