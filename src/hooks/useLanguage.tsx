import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "no" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
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
  "faq.q1": { no: "Hva er Pantora?", en: "What is Pantora?" },
  "faq.a1": { no: "Pantora er en app som gjør det enkelt å resirkulere flasker og bokser. Du kan legge ut en annonse for å få hentet pant hjemme hos deg, eller tilby deg å hente for andre.", en: "Pantora is an app that makes it easy to recycle bottles and cans. You can post a listing to have bottles picked up at your home, or offer to pick up for others." },
  "faq.q2": { no: "Hvordan fungerer det?", en: "How does it work?" },
  "faq.a2": { no: "1. Opprett en konto.\n2. Legg ut en annonse med hvor mange flasker/bokser du har.\n3. En annen bruker ser annonsen og tilbyr seg å hente.\n4. Dere avtaler tidspunkt via kommentarfeltet.\n5. Panteren henter, panter og dere fordeler inntektene som avtalt.", en: "1. Create an account.\n2. Post a listing with how many bottles/cans you have.\n3. Another user sees the listing and offers to pick up.\n4. You agree on a time via the comments.\n5. The collector picks up, recycles, and you split the earnings as agreed." },
  "faq.q3": { no: "Er det gratis å bruke?", en: "Is it free to use?" },
  "faq.a3": { no: "Ja, det er helt gratis å opprette konto, legge ut annonser og kommentere. Pantora tar ingen provisjon.", en: "Yes, it's completely free to create an account, post listings and comment. Pantora takes no commission." },
  "faq.q4": { no: "Hvordan kommuniserer jeg med andre brukere?", en: "How do I communicate with other users?" },
  "faq.a4": { no: "Du kan bruke kommentarfeltet på en annonse for å kommunisere. Du kan også velge å gjøre e-post, telefonnummer eller adresse synlig i profilen din.", en: "You can use the comment section on a listing to communicate. You can also choose to make your email, phone number or address visible in your profile." },
  "faq.q5": { no: "Er informasjonen min trygg?", en: "Is my information safe?" },
  "faq.a5": { no: "E-post, telefonnummer og adresse er skjult som standard. Du velger selv hva som er synlig for andre via profilinnstillingene. Vi anbefaler å være forsiktig med å dele personlig informasjon.", en: "Email, phone number and address are hidden by default. You choose what's visible to others via profile settings. We recommend being careful about sharing personal information." },
  "faq.q6": { no: "Kan jeg slette kontoen min?", en: "Can I delete my account?" },
  "faq.a6": { no: "Ja, du kan når som helst slette kontoen din via profilinnstillingene. Alle dine data vil bli fjernet.", en: "Yes, you can delete your account at any time via profile settings. All your data will be removed." },
  "faq.q7": { no: "Hva gjør jeg hvis noen misbruker plattformen?", en: "What do I do if someone abuses the platform?" },
  "faq.a7": { no: "Kontakt oss via appen, så vil vi undersøke saken. Vi tar misbruk svært alvorlig og kan stenge kontoer som bryter med brukervilkårene.", en: "Contact us via the app and we will investigate. We take abuse very seriously and may suspend accounts that violate the terms of service." },
  "faq.q8": { no: "Hvilke områder dekker Pantora?", en: "Which areas does Pantora cover?" },
  "faq.a8": { no: "Pantora er tilgjengelig i hele Norge. Du kan legge ut annonser uansett hvor du befinner deg.", en: "Pantora is available throughout Norway. You can post listings wherever you are." },

  // Terms
  "terms.title": { no: "Brukervilkår", en: "Terms of Service" },
  "terms.back": { no: "Tilbake", en: "Back" },
  "terms.s1.title": { no: "1. Generelt", en: "1. General" },
  "terms.s1.text": { no: "Ved å opprette en konto på Pantora aksepterer du disse brukervilkårene. Pantora er en plattform som kobler sammen personer som ønsker å pante flasker og bokser med personer som tilbyr henting.", en: "By creating an account on Pantora, you accept these terms of service. Pantora is a platform that connects people who want to recycle bottles and cans with people who offer pickup services." },
  "terms.s2.title": { no: "2. Ansvar for innhold", en: "2. Content responsibility" },
  "terms.s2.text": { no: "Du er selv ansvarlig for innholdet du publiserer, inkludert annonser, bilder og kommentarer. Pantora er ikke ansvarlig for innhold lastet opp av brukere.", en: "You are responsible for the content you publish, including listings, images and comments. Pantora is not responsible for content uploaded by users." },
  "terms.s3.title": { no: "3. Personlig sikkerhet", en: "3. Personal safety" },
  "terms.s3.text": { no: "Din sikkerhet er ditt eget ansvar. Vær forsiktig med å dele personlig informasjon som adresse og telefonnummer. Vi anbefaler å bruke appens kommentarfunksjon for å kommunisere med andre brukere før du deler kontaktinformasjon.", en: "Your safety is your own responsibility. Be careful about sharing personal information such as address and phone number. We recommend using the app's comment feature to communicate with other users before sharing contact information." },
  "terms.s4.title": { no: "4. Personvern", en: "4. Privacy" },
  "terms.s4.text": { no: "Du bestemmer selv hvilken kontaktinformasjon som er synlig for andre brukere via innstillingene i profilen din. E-post, telefonnummer og adresse er som standard skjult.", en: "You decide which contact information is visible to other users via your profile settings. Email, phone number and address are hidden by default." },
  "terms.s5.title": { no: "5. Transaksjoner mellom brukere", en: "5. Transactions between users" },
  "terms.s5.text": { no: "Pantora er kun en formidlingsplattform. Vi er ikke part i avtaler mellom brukere og tar ikke ansvar for kvaliteten på tjenester, betalinger eller eventuelle tvister mellom brukere.", en: "Pantora is only a marketplace platform. We are not a party to agreements between users and are not responsible for the quality of services, payments or any disputes between users." },
  "terms.s6.title": { no: "6. Misbruk og utestengelse", en: "6. Abuse and suspension" },
  "terms.s6.text": { no: "Vi forbeholder oss retten til å fjerne innhold eller stenge kontoer som bryter med disse vilkårene, inkludert spam, svindel, trakassering eller annet misbruk av plattformen.", en: "We reserve the right to remove content or suspend accounts that violate these terms, including spam, fraud, harassment or other abuse of the platform." },
  "terms.s7.title": { no: "7. Endringer i vilkårene", en: "7. Changes to terms" },
  "terms.s7.text": { no: "Vi kan oppdatere disse vilkårene fra tid til annen. Ved vesentlige endringer vil du bli varslet via appen eller e-post.", en: "We may update these terms from time to time. For significant changes, you will be notified via the app or email." },
  "terms.s8.title": { no: "8. Kontakt", en: "8. Contact" },
  "terms.s8.text": { no: "Har du spørsmål om brukervilkårene? Ta kontakt med oss via appen.", en: "Do you have questions about the terms of service? Contact us via the app." },

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
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("pantora-lang");
    return (saved === "en" ? "en" : "no") as Lang;
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "no" ? "en" : "no";
      localStorage.setItem("pantora-lang", next);
      return next;
    });
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry["no"] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
