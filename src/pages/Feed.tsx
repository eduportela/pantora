import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ListingCard, Listing } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const mockListings: Listing[] = [
  {
    id: "1",
    image: "/lovable-uploads/262bc330-5cce-40d6-9870-42b4ce0240e0.png",
    title: "Stor pose med flasker og bokser",
    description: "Ca. 50 flasker og bokser, blanding av plast og boks. Må hentes.",
    price: 75,
    location: "Grünerløkka, Oslo",
    contact: { phone: "12345678" },
    bottleCount: 50,
    createdAt: "i dag",
    type: "sell",
  },
  {
    id: "2",
    image: "/lovable-uploads/385c68dc-1943-49f5-9e17-a9c3c5edd87d.png",
    title: "Donerer flasker til veldedig formål",
    description: "30 flasker klar for henting. Passer for innsamlingsaksjoner.",
    price: null,
    location: "Majorstuen, Oslo",
    contact: { phone: "87654321" },
    bottleCount: 30,
    createdAt: "i går",
    type: "donate",
  },
  {
    id: "3",
    image: "/lovable-uploads/4466eca5-a2a2-4357-b227-078258fa547b.png",
    title: "Panteflasker fra arrangement",
    description: "100+ flasker etter bursdagsfest. Må hentes i løpet av uken.",
    price: 150,
    location: "Frogner, Oslo",
    contact: { phone: "11223344" },
    bottleCount: 100,
    createdAt: "2 dager siden",
    type: "sell",
  },
  {
    id: "4",
    image: "/lovable-uploads/60469bc2-0b08-4b21-9304-884a5ee9b507.png",
    title: "Småpose med bokser",
    description: "20 bokser fra ukens handling. Gratis til den som vil ha!",
    price: null,
    location: "Torshov, Oslo",
    contact: { phone: "55667788" },
    bottleCount: 20,
    createdAt: "3 dager siden",
    type: "donate",
  },
];

type FilterType = "all" | "sell" | "donate";

export default function Feed() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredListings = mockListings.filter((listing) => {
    if (filter === "all") return true;
    return listing.type === filter;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Annonser" subtitle="Finn flasker i nærheten" />

      <main className="px-4 md:px-8 lg:px-16 xl:px-24 space-y-4 max-w-6xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="shrink-0"
          >
            Alle
          </Button>
          <Button
            variant={filter === "sell" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("sell")}
            className="shrink-0"
          >
            Til salgs
          </Button>
          <Button
            variant={filter === "donate" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("donate")}
            className="shrink-0"
          >
            Donasjoner
          </Button>
        </div>

        {/* Listings - Grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ingen annonser funnet</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
