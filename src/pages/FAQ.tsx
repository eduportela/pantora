import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Hva er Pantora?",
    answer:
      "Pantora er en app som gjør det enkelt å resirkulere flasker og bokser. Du kan legge ut en annonse for å få hentet pant hjemme hos deg, eller tilby deg å hente for andre.",
  },
  {
    question: "Hvordan fungerer det?",
    answer:
      "1. Opprett en konto.\n2. Legg ut en annonse med hvor mange flasker/bokser du har.\n3. En annen bruker ser annonsen og tilbyr seg å hente.\n4. Dere avtaler tidspunkt via kommentarfeltet.\n5. Panteren henter, panter og dere fordeler inntektene som avtalt.",
  },
  {
    question: "Er det gratis å bruke?",
    answer:
      "Ja, det er helt gratis å opprette konto, legge ut annonser og kommentere. Pantora tar ingen provisjon.",
  },
  {
    question: "Hvordan kommuniserer jeg med andre brukere?",
    answer:
      "Du kan bruke kommentarfeltet på en annonse for å kommunisere. Du kan også velge å gjøre e-post, telefonnummer eller adresse synlig i profilen din.",
  },
  {
    question: "Er informasjonen min trygg?",
    answer:
      "E-post, telefonnummer og adresse er skjult som standard. Du velger selv hva som er synlig for andre via profilinnstillingene. Vi anbefaler å være forsiktig med å dele personlig informasjon.",
  },
  {
    question: "Kan jeg slette kontoen min?",
    answer:
      "Ja, du kan når som helst slette kontoen din via profilinnstillingene. Alle dine data vil bli fjernet.",
  },
  {
    question: "Hva gjør jeg hvis noen misbruker plattformen?",
    answer:
      "Kontakt oss via appen, så vil vi undersøke saken. Vi tar misbruk svært alvorlig og kan stenge kontoer som bryter med brukervilkårene.",
  },
  {
    question: "Hvilke områder dekker Pantora?",
    answer:
      "Pantora er tilgjengelig i hele Norge. Du kan legge ut annonser uansett hvor du befinner deg.",
  },
];

export default function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Tilbake
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Ofte stilte spørsmål</h1>
        <p className="text-muted-foreground mb-8">
          Her finner du svar på de vanligste spørsmålene om Pantora.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
