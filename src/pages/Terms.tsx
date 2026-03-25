import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Tilbake
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Brukervilkår</h1>

        <div className="prose prose-sm text-muted-foreground space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Generelt</h2>
            <p>
              Ved å opprette en konto på Pantora aksepterer du disse brukervilkårene. 
              Pantora er en plattform som kobler sammen personer som ønsker å pante 
              flasker og bokser med personer som tilbyr henting.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Ansvar for innhold</h2>
            <p>
              Du er selv ansvarlig for innholdet du publiserer, inkludert annonser, 
              bilder og kommentarer. Pantora er ikke ansvarlig for innhold lastet opp 
              av brukere.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Personlig sikkerhet</h2>
            <p>
              Din sikkerhet er ditt eget ansvar. Vær forsiktig med å dele personlig 
              informasjon som adresse og telefonnummer. Vi anbefaler å bruke appens 
              kommentarfunksjon for å kommunisere med andre brukere før du deler 
              kontaktinformasjon.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Personvern</h2>
            <p>
              Du bestemmer selv hvilken kontaktinformasjon som er synlig for andre 
              brukere via innstillingene i profilen din. E-post, telefonnummer og 
              adresse er som standard skjult.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Transaksjoner mellom brukere</h2>
            <p>
              Pantora er kun en formidlingsplattform. Vi er ikke part i avtaler 
              mellom brukere og tar ikke ansvar for kvaliteten på tjenester, 
              betalinger eller eventuelle tvister mellom brukere.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Misbruk og utestengelse</h2>
            <p>
              Vi forbeholder oss retten til å fjerne innhold eller stenge kontoer 
              som bryter med disse vilkårene, inkludert spam, svindel, trakassering 
              eller annet misbruk av plattformen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Endringer i vilkårene</h2>
            <p>
              Vi kan oppdatere disse vilkårene fra tid til annen. Ved vesentlige 
              endringer vil du bli varslet via appen eller e-post.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Kontakt</h2>
            <p>
              Har du spørsmål om brukervilkårene? Ta kontakt med oss via appen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
