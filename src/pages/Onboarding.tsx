import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Truck, Banknote, ArrowRight } from "lucide-react";
import pantoraLogo from "@/assets/pantora-logo.png";

const steps = [
  {
    icon: Recycle,
    title: "Samle flasker",
    description: "Samle tomflasker og bokser hjemme hos deg.",
  },
  {
    icon: Truck,
    title: "Henting hjemme hos deg",
    description: "Velg ønsket tidspunkt",
  },
  {
    icon: Banknote,
    title: "Få betalt – og gjør en forskjell",
    description: "Motta pengene direkte, eller velg å donere",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 lg:px-32 py-12">
        <div className="animate-fade-in flex flex-col items-center mb-8">
          <img
            alt="Pantora"
            className="w-20 h-20 md:w-16 md:h-16 mb-6"
            src="/lovable-uploads/60469bc2-0b08-4b21-9304-884a5ee9b507.png"
          />
          <h1 className="text-3xl font-bold text-foreground leading-tight text-center">
            En liten handling for deg.
            <br />
            En stor forskjell for miljøet.
          </h1>
          <p className="text-muted-foreground mt-3 text-center text-sm my-[13px]">
            Resirkuler flasker uten å forlate hjemmet.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`animate-slide-up flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                index === currentStep
                  ? "bg-accent shadow-card scale-[1.02]"
                  : index < currentStep
                  ? "opacity-60"
                  : "opacity-40"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  index === currentStep
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-sm">
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} variant="hero" size="xl" className="w-full">
            {currentStep < steps.length - 1 ? "Neste" : "Kom i gang"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
