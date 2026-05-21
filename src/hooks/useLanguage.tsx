import { createContext, useContext, useState, ReactNode } from "react";
import { translationsExtra } from "./translationsExtra";

export type Lang = "no" | "en" | "sv" | "de" | "da";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "no", label: "Norsk" },
  { code: "sv", label: "Svenska" },
  { code: "de", label: "Deutsch" },
  { code: "da", label: "Dansk" },
];

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Partial<Record<Lang, string>>> = {
  // Onboarding
  "onboarding.heading1": { no: "En liten handling for deg.", en: "A small action for you." },
  "onboarding.heading2": { no: "En stor forskjell for miljøet.", en: "A big difference for the environment." },
  "onboarding.subtitle": { no: "Resirkuler flasker uten å forlate hjemmet.", en: "Recycle bottles without leaving home." },
  "onboarding.step1.title": { no: "Samle flasker", en: "Collect bottles" },
  "onboarding.step1.desc": { no: "Samle tomflasker og bokser hjemme hos deg.", en: "Collect empty bottles and cans at home." },
  "onboarding.step2.title": { no: "Henting hjemme hos deg", en: "Pickup at your door" },
  "onboarding.step2.desc": { no: "Velg ønsket tidspunkt", en: "Choose your preferred time" },
  "onboarding.step3.title": { no: "Få betalt – og gjør en forskjell", en: "Get paid – and make a difference" },
  "onboarding.step3.desc": { no: "Motta pengene direkte, eller velg å donere", en: "Receive money directly, or choose to donate" },
  "onboarding.next": { no: "Neste", en: "Next" },
  "onboarding.start": { no: "Kom i gang", en: "Get started" },

  // Auth
  "auth.createAccount": { no: "Opprett konto", en: "Create account" },
  "auth.welcomeBack": { no: "Velkommen tilbake", en: "Welcome back" },
  "auth.registerSubtitle": { no: "Registrer deg for å komme i gang", en: "Sign up to get started" },
  "auth.loginSubtitle": { no: "Logg inn for å fortsette", en: "Log in to continue" },
  "auth.name": { no: "Navn", en: "Name" },
  "auth.namePlaceholder": { no: "Ditt navn", en: "Your name" },
  "auth.email": { no: "E-post", en: "Email" },
  "auth.emailPlaceholder": { no: "din@epost.no", en: "your@email.com" },
  "auth.password": { no: "Passord", en: "Password" },
  "auth.acceptTerms": { no: "Jeg aksepterer", en: "I accept the" },
  "auth.terms": { no: "brukervilkårene", en: "terms of service" },
  "auth.loading": { no: "Vennligst vent...", en: "Please wait..." },
  "auth.login": { no: "Logg inn", en: "Log in" },
  "auth.or": { no: "eller", en: "or" },
  "auth.continueGoogle": { no: "Fortsett med Google", en: "Continue with Google" },
  "auth.continueApple": { no: "Fortsett med Apple", en: "Continue with Apple" },
  "auth.hasAccount": { no: "Har du allerede en konto?", en: "Already have an account?" },
  "auth.noAccount": { no: "Har du ikke en konto?", en: "Don't have an account?" },
  "auth.register": { no: "Registrer deg", en: "Sign up" },
  "auth.checkEmail": { no: "Sjekk e-posten din for å bekrefte kontoen!", en: "Check your email to confirm your account!" },
  "auth.acceptTermsError": { no: "Du må akseptere brukervilkårene for å registrere deg.", en: "You must accept the terms of service to sign up." },

  // Feed
  "feed.title": { no: "Annonser", en: "Listings" },
  "feed.subtitle": { no: "Finn flasker i nærheten", en: "Find bottles nearby" },
  "feed.all": { no: "Alle", en: "All" },
  "feed.forSale": { no: "Til salgs", en: "For sale" },
  "feed.donations": { no: "Donasjoner", en: "Donations" },
  "feed.noListings": { no: "Ingen annonser funnet", en: "No listings found" },
  "feed.allCities": { no: "Alle byer", en: "All cities" },

  // Listing
  "listing.donation": { no: "Donasjon", en: "Donation" },
  "listing.forSale": { no: "Til salgs", en: "For sale" },
  "listing.free": { no: "Gratis", en: "Free" },
  "listing.bottles": { no: "flasker", en: "bottles" },
  "listing.anonymous": { no: "Anonym", en: "Anonymous" },
  "listing.notFound": { no: "Annonsen ble ikke funnet", en: "Listing not found" },
  "listing.back": { no: "Tilbake", en: "Back" },
  "listing.call": { no: "Ring", en: "Call" },
  "listing.emailBtn": { no: "E-post", en: "Email" },
  "listing.deleteConfirm": { no: "Er du sikker på at du vil slette denne annonsen?", en: "Are you sure you want to delete this listing?" },
  "listing.deleted": { no: "Annonsen er slettet", en: "Listing deleted" },

  // Create listing
  "create.title": { no: "Ny annonse", en: "New listing" },
  "create.editTitle": { no: "Rediger annonse", en: "Edit listing" },
  "create.editSubtitle": { no: "Oppdater annonsen din", en: "Update your listing" },
  "create.subtitle": { no: "Legg ut flasker for salg eller donasjon", en: "Post bottles for sale or donation" },
  "create.images": { no: "Bilder", en: "Images" },
  "create.addImage": { no: "Legg til", en: "Add" },
  "create.titleLabel": { no: "Tittel", en: "Title" },
  "create.titlePlaceholder": { no: "f.eks. Stor pose med flasker", en: "e.g. Large bag of bottles" },
  "create.description": { no: "Beskrivelse", en: "Description" },
  "create.descPlaceholder": { no: "Beskriv hva du har å tilby...", en: "Describe what you have to offer..." },
  "create.bottleCount": { no: "Antall flasker (valgfritt)", en: "Bottle count (optional)" },
  "create.price": { no: "Pris (valgfritt)", en: "Price (optional)" },
  "create.priceDonation": { no: "La stå tom eller sett til 0 for donasjon", en: "Leave empty or set to 0 for donation" },
  "create.location": { no: "Lokasjon", en: "Location" },
  "create.locationPlaceholder": { no: "f.eks. Grünerløkka, Oslo", en: "e.g. Grünerløkka, Oslo" },
  "create.publish": { no: "Publiser annonse", en: "Publish listing" },
  "create.update": { no: "Oppdater annonse", en: "Update listing" },
  "create.publishing": { no: "Publiserer...", en: "Publishing..." },
  "create.maxImages": { no: "Du kan laste opp maks 4 bilder", en: "You can upload max 4 images" },
  "create.addImageError": { no: "Legg til minst ett bilde", en: "Add at least one image" },
  "create.addTitleError": { no: "Legg til en tittel", en: "Add a title" },
  "create.addLocationError": { no: "Legg til en lokasjon", en: "Add a location" },
  "create.published": { no: "Annonsen din er publisert!", en: "Your listing has been published!" },
  "create.updated": { no: "Annonsen er oppdatert!", en: "Listing updated!" },

  // Home
  "home.orderPickup": { no: "Bestill henting", en: "Order pickup" },
  "home.nextPickup": { no: "Neste henting", en: "Next pickup" },
  "home.seeAll": { no: "Se alle", en: "See all" },
  "home.history": { no: "Historikk", en: "History" },
  "home.howItWorks": { no: "Hvordan fungerer det?", en: "How does it work?" },
  "home.convenience": { no: "Pant når det passer deg", en: "Recycle at your convenience" },
  "home.convenienceDesc": { no: "Vi henter. Du tjener. Enklere resirkulering for alle.", en: "We pick up. You earn. Easier recycling for everyone." },

  // Balance
  "balance.title": { no: "Din saldo", en: "Your balance" },
  "balance.pending": { no: "kr venter", en: "kr pending" },

  // Pickup card
  "pickup.pickup": { no: "Henting", en: "Pickup" },
  "pickup.planned": { no: "Planlagt", en: "Planned" },
  "pickup.completed": { no: "Fullført", en: "Completed" },
  "pickup.paidOut": { no: "Utbetalt", en: "Paid out" },
  "pickup.estimatedValue": { no: "Estimert verdi", en: "Estimated value" },
  "pickup.amount": { no: "Beløp", en: "Amount" },

  // History
  "history.title": { no: "Historikk", en: "History" },
  "history.subtitle": { no: "Dine hentinger", en: "Your pickups" },
  "history.planned": { no: "Planlagte hentinger", en: "Planned pickups" },
  "history.completed": { no: "Fullførte hentinger", en: "Completed pickups" },
  "history.noPickups": { no: "Ingen hentinger ennå", en: "No pickups yet" },
  "history.noPickupsDesc": { no: "Bestill din første henting for å komme i gang med Pantora.", en: "Order your first pickup to get started with Pantora." },

  // Pickup page
  "pickupPage.title": { no: "Bestill henting", en: "Order pickup" },
  "pickupPage.subtitle": { no: "Velg tid og sted som passer deg", en: "Choose a time and place that suits you" },
  "pickupPage.type": { no: "Type henting", en: "Pickup type" },
  "pickupPage.home": { no: "Henting hjemme", en: "Home pickup" },
  "pickupPage.dropoff": { no: "Leveringspunkt", en: "Drop-off point" },
  "pickupPage.address": { no: "Din adresse", en: "Your address" },
  "pickupPage.selectDropoff": { no: "Velg leveringspunkt", en: "Select drop-off point" },
  "pickupPage.addressPlaceholder": { no: "F.eks. Storgata 15, Oslo", en: "E.g. Storgata 15, Oslo" },
  "pickupPage.dropoffPlaceholder": { no: "Søk etter leveringspunkt", en: "Search for drop-off point" },
  "pickupPage.selectDate": { no: "Velg dato", en: "Select date" },
  "pickupPage.selectTime": { no: "Velg tidspunkt", en: "Select time" },
  "pickupPage.estimatedValue": { no: "Estimert verdi", en: "Estimated value" },
  "pickupPage.finalNote": { no: "Endelig beløp beregnes etter at flaskene er talt.", en: "Final amount is calculated after bottles are counted." },
  "pickupPage.confirm": { no: "Bekreft henting", en: "Confirm pickup" },
  "pickupPage.fillAll": { no: "Vennligst fyll ut alle felt", en: "Please fill in all fields" },
  "pickupPage.booked": { no: "Henting bestilt!", en: "Pickup booked!" },

  // Earnings
  "earnings.title": { no: "Inntekter", en: "Earnings" },
  "earnings.subtitle": { no: "Oversikt over dine inntekter", en: "Overview of your earnings" },
  "earnings.withdraw": { no: "Ta ut penger", en: "Withdraw money" },
  "earnings.selectMethod": { no: "Velg utbetalingsmetode", en: "Select withdrawal method" },
  "earnings.vipps": { no: "Rask overføring", en: "Fast transfer" },
  "earnings.bank": { no: "1–2 virkedager", en: "1–2 business days" },
  "earnings.cancel": { no: "Avbryt", en: "Cancel" },
  "earnings.selectMethodError": { no: "Velg en utbetalingsmetode", en: "Select a withdrawal method" },
  "earnings.started": { no: "Utbetaling startet!", en: "Withdrawal started!" },
  "earnings.donateRedCross": { no: "Doner til Røde Kors", en: "Donate to Red Cross" },
  "earnings.thanksDonation": { no: "Takk for din donasjon til Røde Kors! ❤️", en: "Thank you for your donation to Red Cross! ❤️" },
  "earnings.totalEarned": { no: "Totalt tjent", en: "Total earned" },
  "earnings.transactions": { no: "Transaksjoner", en: "Transactions" },

  // Profile
  "profile.title": { no: "Profil", en: "Profile" },
  "profile.subtitle": { no: "Din konto", en: "Your account" },
  "profile.user": { no: "Bruker", en: "User" },
  "profile.personalInfo": { no: "Personlig informasjon", en: "Personal information" },
  "profile.personalInfoDesc": { no: "Navn, kontakt og personvern", en: "Name, contact and privacy" },
  "profile.phone": { no: "Telefon", en: "Phone" },
  "profile.email": { no: "E-post", en: "Email" },
  "profile.address": { no: "Adresse", en: "Address" },
  "profile.public": { no: "Offentlig", en: "Public" },
  "profile.publicLabel": { no: "(offentlig)", en: "(public)" },
  "profile.privateLabel": { no: "(privat)", en: "(private)" },
  "profile.helpFaq": { no: "Hjelp og FAQ", en: "Help and FAQ" },
  "profile.faqDesc": { no: "Vanlige spørsmål", en: "Frequently asked questions" },
  "profile.logout": { no: "Logg ut", en: "Log out" },
  "profile.loggedOut": { no: "Du er nå logget ut", en: "You are now logged out" },
  "profile.updated": { no: "Profilen er oppdatert", en: "Profile updated" },
  "profile.updateError": { no: "Kunne ikke oppdatere profilen", en: "Could not update profile" },
  "profile.avatarUpdated": { no: "Profilbilde oppdatert", en: "Profile picture updated" },
  "profile.avatarError": { no: "Kunne ikke laste opp bilde", en: "Could not upload image" },
  "profile.version": { no: "Pantora versjon 1.0.0", en: "Pantora version 1.0.0" },
  "profile.save": { no: "Lagre", en: "Save" },
  "profile.saving": { no: "Lagrer...", en: "Saving..." },
  "profile.name": { no: "Navn", en: "Name" },

  // Bottom nav
  "nav.listings": { no: "Annonser", en: "Listings" },
  "nav.profile": { no: "Profil", en: "Profile" },

  // Floating buttons
  "contact.title": { no: "Kontakt oss", en: "Contact us" },
  "contact.sendEmail": { no: "Send e-post", en: "Send email" },
  "help.title": { no: "Trenger du hjelp?", en: "Need help?" },
  "help.name": { no: "Navn", en: "Name" },
  "help.namePlaceholder": { no: "Ditt navn", en: "Your name" },
  "help.email": { no: "E-post", en: "Email" },
  "help.emailPlaceholder": { no: "din@epost.no", en: "your@email.com" },
  "help.category": { no: "Kategori", en: "Category" },
  "help.selectCategory": { no: "Velg kategori", en: "Select category" },
  "help.account": { no: "Konto og innlogging", en: "Account and login" },
  "help.listings": { no: "Annonser", en: "Listings" },
  "help.payment": { no: "Betaling", en: "Payment" },
  "help.safety": { no: "Sikkerhet", en: "Safety" },
  "help.bug": { no: "Feil i appen", en: "App bug" },
  "help.other": { no: "Annet", en: "Other" },
  "help.message": { no: "Melding", en: "Message" },
  "help.messagePlaceholder": { no: "Beskriv problemet ditt...", en: "Describe your issue..." },
  "help.send": { no: "Send forespørsel", en: "Send request" },
  "help.sending": { no: "Sender...", en: "Sending..." },
  "help.fillAll": { no: "Fyll ut alle feltene", en: "Fill in all fields" },
  "help.error": { no: "Kunne ikke sende forespørselen", en: "Could not send request" },
  "help.sent": { no: "Hjelpeforespørsel sendt!", en: "Help request sent!" },

  // Report
  "report.title": { no: "Rapporter", en: "Report" },
  "report.listing": { no: "annonsen", en: "the listing" },
  "report.comment": { no: "kommentaren", en: "the comment" },
  "report.profile": { no: "profilen", en: "the profile" },
  "report.reason": { no: "Grunn", en: "Reason" },
  "report.selectReason": { no: "Velg grunn", en: "Select reason" },
  "report.inappropriate": { no: "Upassende innhold", en: "Inappropriate content" },
  "report.scam": { no: "Svindel", en: "Scam" },
  "report.harmful": { no: "Skadelig eller truende", en: "Harmful or threatening" },
  "report.spam": { no: "Spam", en: "Spam" },
  "report.fake": { no: "Falsk informasjon", en: "False information" },
  "report.other": { no: "Annet", en: "Other" },
  "report.description": { no: "Beskrivelse (valgfritt)", en: "Description (optional)" },
  "report.descPlaceholder": { no: "Gi oss mer detaljer...", en: "Give us more details..." },
  "report.send": { no: "Send rapport", en: "Send report" },
  "report.sending": { no: "Sender...", en: "Sending..." },
  "report.selectError": { no: "Velg en grunn for rapporten", en: "Select a reason for the report" },
  "report.error": { no: "Kunne ikke sende rapporten", en: "Could not send report" },
  "report.sent": { no: "Rapport sendt. Takk for at du hjelper oss!", en: "Report sent. Thank you for helping us!" },
  "report.btn": { no: "Rapporter", en: "Report" },

  // Comments
  "comments.title": { no: "Kommentarer", en: "Comments" },
  "comments.placeholder": { no: "Skriv en kommentar...", en: "Write a comment..." },
  "comments.loginRequired": { no: "Logg inn for å kommentere", en: "Log in to comment" },
  "comments.error": { no: "Kunne ikke legge til kommentar", en: "Could not add comment" },

  // Notifications
  "notifications.title": { no: "Varsler", en: "Notifications" },
  "notifications.none": { no: "Ingen varsler ennå", en: "No notifications yet" },

  // FAQ
  "faq.title": { no: "Ofte stilte spørsmål", en: "Frequently Asked Questions" },
  "faq.subtitle": { no: "Her finner du svar på de vanligste spørsmålene om Pantora.", en: "Here you'll find answers to the most common questions about Pantora." },
  "faq.back": { no: "Tilbake", en: "Back" },
  "faq.q1": { no: "Hva er denne plattformen?", en: "What is this platform?" },
  "faq.a1": { no: "Pantora er en formidlingsplattform som kobler sammen personer som ønsker å resirkulere flasker og bokser. Vi tilbyr verktøyene – du styrer avtalen. Pantora er ikke part i noen avtale eller transaksjon mellom brukere.", en: "Pantora is a marketplace platform that connects people who want to recycle bottles and cans. We provide the tools — you manage the deal. Pantora is not a party to any agreement or transaction between users." },
  "faq.q2": { no: "Er plattformen gratis å bruke?", en: "Is the platform free to use?" },
  "faq.a2": { no: "Ja, det er helt gratis å opprette en konto, legge ut annonser og kommunisere med andre brukere. Pantora tar ingen provisjon eller avgifter.", en: "Yes, it's completely free to create an account, post listings and communicate with other users. Pantora takes no commission or fees." },
  "faq.q3": { no: "Hvordan fungerer det?", en: "How does it work?" },
  "faq.a3": { no: "1. Opprett en konto.\n2. Legg ut en annonse med bilder, lokasjon og pris (eller merk som donasjon).\n3. Andre brukere ser annonsen din og kan kontakte deg via kommentarfeltet eller kontaktinfo.\n4. Dere avtaler henting og betaling direkte seg imellom.\n\nPantora håndterer ikke betalinger – alle transaksjoner skjer direkte mellom brukere.", en: "1. Create an account.\n2. Post a listing with photos, location and price (or mark as donation).\n3. Other users see your listing and can reach out via comments or contact info.\n4. You agree on pickup and payment directly between yourselves.\n\nPantora does not handle payments — all transactions happen directly between users." },
  "faq.q4": { no: "Håndterer dere betalinger?", en: "Do you handle payments?" },
  "faq.a4": { no: "Nei. Pantora håndterer ingen betalinger. Alle pengetransaksjoner skjer direkte mellom brukere. Vi anbefaler å bruke trygge betalingsmetoder som Vipps eller bankoverføring, og å aldri sende penger til noen du ikke stoler på.", en: "No. Pantora does not handle any payments. All money transactions happen directly between users. We recommend using secure payment methods like Vipps or bank transfer, and never sending money to someone you don't trust." },
  "faq.q5": { no: "Hvem kan se annonsene mine?", en: "Who can see my posts?" },
  "faq.a5": { no: "Alle registrerte brukere kan se annonsene dine i feeden. Kontaktinformasjonen din (telefon, e-post, adresse) er skjult som standard. Du velger selv hva som skal være synlig via profilinnstillingene.", en: "All registered users can see your listings in the feed. Your contact information (phone, email, address) is hidden by default. You choose what's visible via your profile settings." },
  "faq.q6": { no: "Hvordan kontakter jeg noen?", en: "How do I contact someone?" },
  "faq.a6": { no: "Du kan skrive i kommentarfeltet under en annonse for å ta kontakt. Hvis brukeren har gjort kontaktinformasjon synlig (telefon eller e-post), kan du også kontakte dem direkte.", en: "You can write in the comment section under a listing to get in touch. If the user has made their contact info visible (phone or email), you can also reach them directly." },
  "faq.q7": { no: "Er personlig informasjon offentlig?", en: "Is my personal information public?" },
  "faq.a7": { no: "Nei. E-post, telefonnummer og adresse er skjult som standard. Du bestemmer selv hva som skal være synlig for andre via profilen din. Vi anbefaler forsiktighet med personlig informasjon.", en: "No. Email, phone number and address are hidden by default. You decide what's visible to others via your profile. We recommend caution with personal information." },
  "faq.q8": { no: "Hva kan føre til utestengelse?", en: "What can get me banned/flagged?" },
  "faq.a8": { no: "Misbruk av plattformen kan føre til utestengelse, inkludert:\n• Spam eller falske annonser\n• Svindel eller villedende informasjon\n• Trakassering eller truende oppførsel\n• Ulovlig innhold\n• Gjentatte brudd på brukervilkårene\n\nBrukere kan rapportere innhold, og vi gjennomgår alle rapporter.", en: "Misuse of the platform can lead to suspension, including:\n• Spam or fake listings\n• Scam or misleading information\n• Harassment or threatening behavior\n• Illegal content\n• Repeated violations of the terms of service\n\nUsers can report content, and we review all reports." },
  "faq.safetyTips": { no: "🛡 Tips for å være trygg", en: "🛡 Tips to stay safe" },

  // Safety Tips
  "safety.title": { no: "🛡 Sikkerhetstips", en: "🛡 Safety Tips" },
  "safety.intro": { no: "Selv om plattformen fremmer åpenhet og lik tilgang, håndteres avtaler og betalinger direkte mellom brukere. Derfor er det viktig å følge noen grunnleggende sikkerhetsrutiner.", en: "Although the platform promotes transparency and equal access, agreements and payments are handled directly between users. Therefore it's important to follow basic safety routines." },
  "safety.t1": { no: "Verifiser før du inngår en avtale", en: "Verify before making a deal" },
  "safety.d1": { no: "Sjekk profilen til personen du handler med. Se etter offentlig kontaktinformasjon og tidligere aktivitet. Vær skeptisk til profiler uten bilder eller informasjon.", en: "Check the profile of the person you're dealing with. Look for public contact information and previous activity. Be skeptical of profiles without photos or information." },
  "safety.t2": { no: "Definer forventninger tydelig", en: "Define expectations clearly" },
  "safety.d2": { no: "Avtal pris, tidspunkt og leveringsvilkår på forhånd. Unngå misforståelser ved å være spesifikk om hva som inkluderes.", en: "Agree on price, time and delivery terms in advance. Avoid misunderstandings by being specific about what's included." },
  "safety.t3": { no: "Ha alltid skriftlig bekreftelse", en: "Always have written confirmation" },
  "safety.d3": { no: "Bruk kommentarfeltet eller meldinger for å dokumentere avtaler. Skriftlige avtaler beskytter begge parter.", en: "Use the comment section or messages to document agreements. Written agreements protect both parties." },
  "safety.t4": { no: "Vær oppmerksom på betaling", en: "Be mindful about payment" },
  "safety.d4": { no: "Bruk trygge betalingsmetoder som Vipps eller bankoverføring. Unngå kontanter når mulig, og betal aldri på forhånd til noen du ikke kjenner.", en: "Use secure payment methods like Vipps or bank transfer. Avoid cash when possible, and never pay in advance to someone you don't know." },
  "safety.t5": { no: "Tenk sikkerhet ved fysiske møter", en: "Think safety for physical meetings" },
  "safety.d5": { no: "Møt helst på offentlige steder. Gi noen beskjed om hvor du skal. Unngå å gå alene til ukjente adresser, spesielt på kveldstid.", en: "Preferably meet in public places. Let someone know where you're going. Avoid going alone to unknown addresses, especially in the evening." },
  "safety.t6": { no: "Gjenkjenn varseltegn", en: "Recognize warning signs" },
  "safety.d6": { no: "Vær forsiktig med tilbud som virker for gode til å være sanne, brukere som presser på for rask betaling, eller som nekter å gi kontaktinformasjon.", en: "Be cautious of offers that seem too good to be true, users who push for quick payment, or who refuse to provide contact information." },
  "safety.t7": { no: "Rapporter mistenkelig aktivitet", en: "Report suspicious activity" },
  "safety.d7": { no: "Ser du noe mistenkelig? Bruk rapportfunksjonen på annonser, kommentarer eller profiler. Vi tar alle rapporter på alvor.", en: "See something suspicious? Use the report function on listings, comments or profiles. We take all reports seriously." },
  "safety.footer": { no: "Denne plattformen er bygget på åpenhet og lik synlighet for alle. Åpenhet skaper muligheter – men profesjonalitet og ansvar skaper trygghet. Ved å handle tydelig, respektfullt og bevisst, bidrar alle brukere til et sterkere fellesskap.", en: "This platform is built on transparency and equal visibility for all. Transparency creates opportunities — but professionalism and responsibility create safety. By acting clearly, respectfully and consciously, all users contribute to a stronger community." },
  "safety.understood": { no: "Jeg forstår", en: "I understand" },
  "safety.continuePost": { no: "Fortsett med annonsen", en: "Continue with listing" },

  // Terms
  "terms.title": { no: "Brukervilkår", en: "Terms of Use" },
  "terms.back": { no: "Tilbake", en: "Back" },
  "terms.lastUpdated": { no: "Sist oppdatert: 31. mars 2026", en: "Last updated: March 31, 2026" },
  "terms.s1.title": { no: "1. Aksept av vilkår", en: "1. Acceptance of Terms" },
  "terms.s1.text": { no: "Ved å opprette en konto på Pantora aksepterer du disse brukervilkårene i sin helhet. Dersom du ikke godtar vilkårene, ber vi deg om å ikke bruke plattformen. Pantora forbeholder seg retten til å endre disse vilkårene når som helst. Fortsatt bruk av plattformen etter endringer utgjør aksept av de oppdaterte vilkårene.", en: "By creating an account on Pantora, you accept these Terms of Use in their entirety. If you do not agree to these terms, please do not use the platform. Pantora reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms." },
  "terms.s2.title": { no: "2. Beskrivelse av tjenesten", en: "2. Description of Service" },
  "terms.s2.text": { no: "Pantora er en formidlingsplattform som kobler sammen brukere som ønsker å selge, kjøpe eller donere flasker og bokser til panting. Pantora er IKKE part i noen avtale, transaksjon eller utveksling mellom brukere. Vi tilbyr kun de teknologiske verktøyene for å koble brukere sammen.", en: "Pantora is a marketplace platform that connects users who want to sell, buy or donate bottles and cans for recycling. Pantora is NOT a party to any agreement, transaction or exchange between users. We only provide the technological tools to connect users." },
  "terms.s3.title": { no: "3. Ansvarsfraskrivelse – Transaksjoner og betalinger", en: "3. Disclaimer – Transactions and Payments" },
  "terms.s3.text": { no: "Pantora håndterer INGEN betalinger, pengeoverføringer eller økonomiske transaksjoner mellom brukere. Alle betalingsavtaler gjøres direkte mellom de involverte partene. Pantora er ikke ansvarlig for:\n• Tap av penger eller verdier som følge av avtaler mellom brukere\n• Svindel, bedrageri eller villedende oppførsel fra brukere\n• Manglende betaling, forsinket betaling eller feil beløp\n• Tvister knyttet til kvalitet, mengde eller tilstand på flasker/bokser\n\nBrukere er selv ansvarlige for å verifisere motparten og sikre trygge betalingsmetoder.", en: "Pantora does NOT handle any payments, money transfers or financial transactions between users. All payment agreements are made directly between the involved parties. Pantora is not responsible for:\n• Loss of money or value resulting from agreements between users\n• Fraud, deception or misleading behavior by users\n• Non-payment, delayed payment or incorrect amounts\n• Disputes related to quality, quantity or condition of bottles/cans\n\nUsers are responsible for verifying the other party and ensuring secure payment methods." },
  "terms.s4.title": { no: "4. Ansvarsfraskrivelse – Personlig sikkerhet", en: "4. Disclaimer – Personal Safety" },
  "terms.s4.text": { no: "Din personlige sikkerhet er ditt eget ansvar. Pantora organiserer, overvåker eller kontrollerer IKKE fysiske møter mellom brukere. Vi er ikke ansvarlige for:\n• Hendelser som oppstår under fysiske møter mellom brukere\n• Personskader, tyveri eller andre skader i forbindelse med utveksling\n• Brukeres oppførsel utenfor plattformen\n\nVi anbefaler sterkt å møtes på offentlige steder, informere noen om hvor du skal, og utvise sunn dømmekraft.", en: "Your personal safety is your own responsibility. Pantora does NOT organize, monitor or control physical meetings between users. We are not responsible for:\n• Incidents that occur during physical meetings between users\n• Personal injuries, theft or other damages in connection with exchanges\n• User behavior outside the platform\n\nWe strongly recommend meeting in public places, telling someone where you're going, and exercising good judgment." },
  "terms.s5.title": { no: "5. Brukerens ansvar for innhold", en: "5. User Content Responsibility" },
  "terms.s5.text": { no: "Du er fullt ansvarlig for alt innhold du publiserer på Pantora, inkludert annonser, bilder, kommentarer og profilinformasjon. Innhold som er ulovlig, krenkende, villedende eller i strid med norsk lov, kan fjernes uten forvarsel. Pantora er ikke ansvarlig for innhold lastet opp av brukere.", en: "You are fully responsible for all content you publish on Pantora, including listings, images, comments and profile information. Content that is illegal, offensive, misleading or in violation of Norwegian law may be removed without notice. Pantora is not responsible for content uploaded by users." },
  "terms.s6.title": { no: "6. Personvern og datainnsamling", en: "6. Privacy and Data Collection" },
  "terms.s6.text": { no: "Pantora samler inn og behandler personopplysninger i samsvar med personopplysningsloven og GDPR. Vi samler inn følgende data:\n• Kontoinformasjon (navn, e-post, passord)\n• Profilinformasjon du velger å dele (telefon, adresse)\n• Annonser, kommentarer og bilder du publiserer\n• Tekniske data (IP-adresse, enhetstype, bruksmønstre)\n\nDu bestemmer selv hvilken kontaktinformasjon som er synlig for andre brukere. E-post, telefonnummer og adresse er skjult som standard. Du kan når som helst be om innsyn i, retting av eller sletting av dine personopplysninger.", en: "Pantora collects and processes personal data in accordance with the Norwegian Personal Data Act and GDPR. We collect the following data:\n• Account information (name, email, password)\n• Profile information you choose to share (phone, address)\n• Listings, comments and images you publish\n• Technical data (IP address, device type, usage patterns)\n\nYou decide which contact information is visible to other users. Email, phone number and address are hidden by default. You may at any time request access to, correction of or deletion of your personal data." },
  "terms.s7.title": { no: "7. Immaterielle rettigheter", en: "7. Intellectual Property" },
  "terms.s7.text": { no: "Alt innhold, design, kode og merkevareidentitet tilknyttet Pantora er eid av Pantora og beskyttet av norsk og internasjonal opphavsrettslovgivning. Brukere beholder opphavsretten til eget innhold, men gir Pantora en begrenset lisens til å vise dette innholdet på plattformen.", en: "All content, design, code and brand identity associated with Pantora is owned by Pantora and protected by Norwegian and international copyright law. Users retain ownership of their own content but grant Pantora a limited license to display this content on the platform." },
  "terms.s8.title": { no: "8. Misbruk og utestengelse", en: "8. Abuse and Suspension" },
  "terms.s8.text": { no: "Pantora forbeholder seg retten til å fjerne innhold, suspendere eller permanent stenge kontoer som bryter med disse vilkårene, inkludert men ikke begrenset til:\n• Spam, svindel eller falske annonser\n• Trakassering, diskriminering eller truende oppførsel\n• Ulovlig innhold eller aktivitet\n• Forsøk på å omgå plattformens sikkerhetsfunksjoner\n\nAvgjørelser om utestengelse er endelige og etter Pantoras skjønn.", en: "Pantora reserves the right to remove content, suspend or permanently close accounts that violate these terms, including but not limited to:\n• Spam, fraud or fake listings\n• Harassment, discrimination or threatening behavior\n• Illegal content or activity\n• Attempts to circumvent the platform's security features\n\nSuspension decisions are final and at Pantora's discretion." },
  "terms.s9.title": { no: "9. Ansvarsbegrensning", en: "9. Limitation of Liability" },
  "terms.s9.text": { no: "Pantora leveres «som den er» uten garantier av noe slag. I den grad norsk lov tillater, fraskriver Pantora seg ethvert ansvar for direkte, indirekte, tilfeldige eller følgemessige skader som oppstår fra bruk av plattformen, inkludert men ikke begrenset til økonomisk tap, personskader eller tap av data.", en: "Pantora is provided \"as is\" without warranties of any kind. To the fullest extent permitted by Norwegian law, Pantora disclaims all liability for direct, indirect, incidental or consequential damages arising from use of the platform, including but not limited to financial losses, personal injuries or loss of data." },
  "terms.s10.title": { no: "10. Gjeldende lov og tvister", en: "10. Governing Law and Disputes" },
  "terms.s10.text": { no: "Disse vilkårene er underlagt norsk lov. Eventuelle tvister som oppstår i forbindelse med bruken av Pantora skal først søkes løst gjennom dialog. Dersom enighet ikke oppnås, skal tvisten avgjøres av norske domstoler med Oslo tingrett som verneting.", en: "These terms are governed by Norwegian law. Any disputes arising in connection with the use of Pantora shall first be sought resolved through dialogue. If agreement cannot be reached, the dispute shall be settled by Norwegian courts with Oslo District Court as the legal venue." },
  "terms.s11.title": { no: "11. Endringer i vilkårene", en: "11. Changes to Terms" },
  "terms.s11.text": { no: "Vi kan oppdatere disse vilkårene fra tid til annen. Ved vesentlige endringer vil du bli varslet via appen eller e-post. Fortsatt bruk av plattformen etter slike endringer utgjør aksept av de reviderte vilkårene.", en: "We may update these terms from time to time. For significant changes, you will be notified via the app or email. Continued use of the platform after such changes constitutes acceptance of the revised terms." },
  "terms.s12.title": { no: "12. Kontakt", en: "12. Contact" },
  "terms.s12.text": { no: "Har du spørsmål om brukervilkårene? Ta kontakt med oss via appen eller send en e-post til support@pantora.no.", en: "Do you have questions about the Terms of Use? Contact us via the app or send an email to support@pantora.no." },

  // Admin
  "admin.title": { no: "Admin Panel", en: "Admin Panel" },
  "admin.noAccess": { no: "Du har ikke tilgang til denne siden", en: "You don't have access to this page" },
  "admin.back": { no: "Tilbake", en: "Back" },
  "admin.reports": { no: "Rapporter", en: "Reports" },
  "admin.help": { no: "Hjelp", en: "Help" },
  "admin.users": { no: "Brukere", en: "Users" },
  "admin.content": { no: "Innhold", en: "Content" },
  "admin.noReports": { no: "Ingen rapporter", en: "No reports" },
  "admin.noHelp": { no: "Ingen hjelpeforespørsler", en: "No help requests" },
  "admin.reviewed": { no: "Gjennomgått", en: "Reviewed" },
  "admin.resolved": { no: "Løst", en: "Resolved" },
  "admin.dismiss": { no: "Avvis", en: "Dismiss" },
  "admin.inProgress": { no: "Under behandling", en: "In progress" },
  "admin.deleteListing": { no: "Slett annonse", en: "Delete listing" },
  "admin.deleteNotify": { no: "Brukeren vil bli varslet om grunnen til slettingen.", en: "The user will be notified about the reason for deletion." },
  "admin.selectReason": { no: "Velg grunn", en: "Select reason" },
  "admin.deleteAndNotify": { no: "Slett og varsle bruker", en: "Delete and notify user" },
  "admin.roleUpdated": { no: "Rolle oppdatert", en: "Role updated" },
  "admin.roleError": { no: "Kunne ikke oppdatere rollen", en: "Could not update role" },
  "admin.userDeleted": { no: "Bruker slettet", en: "User deleted" },
  "admin.deleteUserConfirm": { no: "Er du sikker på at du vil slette denne brukeren?", en: "Are you sure you want to delete this user?" },
  "admin.listingDeleted": { no: "Annonse slettet og bruker varslet", en: "Listing deleted and user notified" },
  "admin.reportUpdated": { no: "Rapport oppdatert", en: "Report updated" },
  "admin.statusUpdated": { no: "Status oppdatert", en: "Status updated" },
  "admin.pendingReports": { no: "Ventende rapporter", en: "Pending reports" },
  "admin.openHelp": { no: "Åpne hjelpeforespørsler", en: "Open help requests" },

  // General
  "general.somethingWrong": { no: "Noe gikk galt", en: "Something went wrong" },
  "general.copyright": { no: "© {year} Pantora. Alle rettigheter reservert.", en: "© {year} Pantora. All rights reserved." },

  // Chat
  "chat.title": { no: "Meldinger", en: "Messages", sv: "Meddelanden", de: "Nachrichten", da: "Beskeder" },
  "chat.inbox": { no: "Innboks", en: "Inbox", sv: "Inkorg", de: "Posteingang", da: "Indbakke" },
  "chat.empty": { no: "Ingen samtaler ennå", en: "No conversations yet", sv: "Inga konversationer ännu", de: "Noch keine Gespräche", da: "Ingen samtaler endnu" },
  "chat.messageSeller": { no: "Send melding", en: "Send message", sv: "Skicka meddelande", de: "Nachricht senden", da: "Send besked" },
  "chat.placeholder": { no: "Skriv en melding...", en: "Write a message...", sv: "Skriv ett meddelande...", de: "Nachricht schreiben...", da: "Skriv en besked..." },
  "chat.send": { no: "Send", en: "Send", sv: "Skicka", de: "Senden", da: "Send" },
  "chat.disabled": { no: "Chat er midlertidig utilgjengelig", en: "Chat is temporarily unavailable", sv: "Chatten är tillfälligt otillgänglig", de: "Chat ist vorübergehend nicht verfügbar", da: "Chat er midlertidigt utilgængelig" },
  "chat.loginRequired": { no: "Logg inn for å sende meldinger", en: "Log in to send messages", sv: "Logga in för att skicka meddelanden", de: "Anmelden, um Nachrichten zu senden", da: "Log ind for at sende beskeder" },
  "chat.cantMessageSelf": { no: "Du kan ikke sende melding til deg selv", en: "You can't message yourself", sv: "Du kan inte skicka meddelande till dig själv", de: "Sie können sich selbst keine Nachricht senden", da: "Du kan ikke sende besked til dig selv" },
  "nav.inbox": { no: "Innboks", en: "Inbox", sv: "Inkorg", de: "Posteingang", da: "Indbakke" },

  // Country
  "country.select": { no: "Velg land", en: "Select country", sv: "Välj land", de: "Land wählen", da: "Vælg land" },

  // Admin extras
  "admin.chatSettings": { no: "Chat-innstillinger", en: "Chat settings", sv: "Chattinställningar", de: "Chat-Einstellungen", da: "Chatindstillinger" },
  "admin.chatEnabled": { no: "Chat aktivert", en: "Chat enabled", sv: "Chatt aktiverad", de: "Chat aktiviert", da: "Chat aktiveret" },
  "admin.chatToggleDesc": { no: "Slå chatsystemet av eller på globalt for alle brukere.", en: "Toggle the chat system on or off globally for all users.", sv: "Slå på eller av chattsystemet globalt för alla användare.", de: "Schalten Sie das Chatsystem global für alle Benutzer ein oder aus.", da: "Slå chatsystemet til eller fra globalt for alle brugere." },
  "admin.country": { no: "Land", en: "Country", sv: "Land", de: "Land", da: "Land" },
  "admin.settings": { no: "Innstillinger", en: "Settings", sv: "Inställningar", de: "Einstellungen", da: "Indstillinger" },

  // Chat moderation
  "chat.deleteConversation": { no: "Slett samtale", en: "Delete conversation", sv: "Radera konversation", de: "Gespräch löschen", da: "Slet samtale" },
  "chat.deleteConfirm": { no: "Er du sikker på at du vil slette denne samtalen? Dette kan ikke angres.", en: "Are you sure you want to delete this conversation? This cannot be undone.", sv: "Är du säker på att du vill radera denna konversation? Detta kan inte ångras.", de: "Möchten Sie dieses Gespräch wirklich löschen? Dies kann nicht rückgängig gemacht werden.", da: "Er du sikker på, at du vil slette denne samtale? Dette kan ikke fortrydes." },
  "chat.deleted": { no: "Samtalen er slettet", en: "Conversation deleted", sv: "Konversationen raderad", de: "Gespräch gelöscht", da: "Samtalen slettet" },
  "chat.blockUser": { no: "Blokker bruker", en: "Block user", sv: "Blockera användare", de: "Benutzer blockieren", da: "Blokér bruger" },
  "chat.blockConfirm": { no: "Blokkerte brukere kan ikke kontakte deg. Du kan oppheve blokkeringen senere.", en: "Blocked users cannot contact you. You can unblock later.", sv: "Blockerade användare kan inte kontakta dig. Du kan avblockera senare.", de: "Blockierte Benutzer können Sie nicht kontaktieren. Sie können später entsperren.", da: "Blokerede brugere kan ikke kontakte dig. Du kan ophæve blokeringen senere." },
  "chat.userBlocked": { no: "Brukeren er blokkert", en: "User blocked", sv: "Användaren blockerad", de: "Benutzer blockiert", da: "Bruger blokeret" },
  "chat.reportConversation": { no: "Rapporter samtale", en: "Report conversation", sv: "Rapportera konversation", de: "Gespräch melden", da: "Rapportér samtale" },
  "chat.reportUser": { no: "Rapporter bruker", en: "Report user", sv: "Rapportera användare", de: "Benutzer melden", da: "Rapportér bruger" },
  "report.conversation": { no: "samtalen", en: "the conversation", sv: "konversationen", de: "das Gespräch", da: "samtalen" },
  "report.user": { no: "brukeren", en: "the user", sv: "användaren", de: "den Benutzer", da: "brugeren" },
  "report.message": { no: "meldingen", en: "the message", sv: "meddelandet", de: "die Nachricht", da: "beskeden" },

  // Auth reset
  "auth.forgotPassword": { no: "Glemt passord?", en: "Forgot password?", sv: "Glömt lösenord?", de: "Passwort vergessen?", da: "Glemt adgangskode?" },
  "auth.enterEmailFirst": { no: "Skriv inn e-postadressen din først", en: "Enter your email first", sv: "Ange din e-post först", de: "Geben Sie zuerst Ihre E-Mail ein", da: "Indtast din e-mail først" },
  "auth.resetSent": { no: "Sjekk e-posten for å tilbakestille passordet", en: "Check your email to reset your password", sv: "Kolla din e-post för att återställa lösenordet", de: "Überprüfen Sie Ihre E-Mail, um Ihr Passwort zurückzusetzen", da: "Tjek din e-mail for at nulstille adgangskoden" },
  "auth.resetTitle": { no: "Nytt passord", en: "New password", sv: "Nytt lösenord", de: "Neues Passwort", da: "Ny adgangskode" },
  "auth.resetSubtitle": { no: "Velg et nytt passord for kontoen din", en: "Choose a new password for your account", sv: "Välj ett nytt lösenord för ditt konto", de: "Wählen Sie ein neues Passwort für Ihr Konto", da: "Vælg en ny adgangskode til din konto" },
  "auth.newPassword": { no: "Nytt passord", en: "New password", sv: "Nytt lösenord", de: "Neues Passwort", da: "Ny adgangskode" },
  "auth.confirmPassword": { no: "Bekreft passord", en: "Confirm password", sv: "Bekräfta lösenord", de: "Passwort bestätigen", da: "Bekræft adgangskode" },
  "auth.updatePassword": { no: "Oppdater passord", en: "Update password", sv: "Uppdatera lösenord", de: "Passwort aktualisieren", da: "Opdater adgangskode" },
  "auth.passwordUpdated": { no: "Passordet er oppdatert", en: "Password updated", sv: "Lösenord uppdaterat", de: "Passwort aktualisiert", da: "Adgangskode opdateret" },
  "auth.passwordTooShort": { no: "Passordet må være minst 6 tegn", en: "Password must be at least 6 characters", sv: "Lösenordet måste vara minst 6 tecken", de: "Passwort muss mindestens 6 Zeichen lang sein", da: "Adgangskoden skal være mindst 6 tegn" },
  "auth.passwordMismatch": { no: "Passordene stemmer ikke overens", en: "Passwords do not match", sv: "Lösenorden matchar inte", de: "Passwörter stimmen nicht überein", da: "Adgangskoderne matcher ikke" },
  "auth.openFromEmail": { no: "Åpne denne siden via lenken i e-posten du fikk.", en: "Open this page via the link in the email you received.", sv: "Öppna denna sida via länken i e-postmeddelandet du fick.", de: "Öffnen Sie diese Seite über den Link in der E-Mail, die Sie erhalten haben.", da: "Åbn denne side via linket i e-mailen, du modtog." },
};

// Merge SV/DE/DA translations from extras file
for (const key in translationsExtra) {
  translations[key] = { ...translationsExtra[key], ...translations[key] };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("pantora-lang") as Lang | null;
    if (saved && ["no", "en", "sv", "de", "da"].includes(saved)) return saved;
    return "no";
  });

  const setLang = (l: Lang) => {
    localStorage.setItem("pantora-lang", l);
    setLangState(l);
  };

  const toggleLang = () => setLang(lang === "no" ? "en" : "no");

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || entry.no || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
