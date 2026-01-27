import { Phone, MessageCircle, MapPin, Heart, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Listing {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number | null; // null means donation
  location: string;
  contact: {
    phone?: string;
    email?: string;
  };
  bottleCount: number;
  createdAt: string;
  type: "sell" | "donate";
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const handleContact = () => {
    if (listing.contact.phone) {
      window.location.href = `tel:${listing.contact.phone}`;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card animate-scale-in hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-[3/2] bg-muted">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-3 left-3 ${
            listing.type === "donate"
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {listing.type === "donate" ? (
            <>
              <Heart className="w-3 h-3 mr-1" />
              Donasjon
            </>
          ) : (
            <>
              <Package className="w-3 h-3 mr-1" />
              Til salgs
            </>
          )}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{listing.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          </div>
          {listing.type === "sell" && listing.price !== null ? (
            <p className="text-lg font-bold text-primary shrink-0">
              {listing.price} kr
            </p>
          ) : (
            <p className="text-lg font-bold text-success shrink-0">Gratis</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            {listing.bottleCount} flasker
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleContact}
          >
            <Phone className="w-4 h-4 mr-1" />
            Ring
          </Button>
          <Button
            variant="hero"
            size="sm"
            className="flex-1"
            onClick={() => {
              if (listing.contact.phone) {
                window.location.href = `sms:${listing.contact.phone}`;
              }
            }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Melding
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Lagt ut {listing.createdAt}
        </p>
      </div>
    </div>
  );
}
