import { MapPin, Package, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

interface ListingCardProps {
  listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();
  const mainImage = listing.images?.[0];

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="bg-card rounded-xl border border-border overflow-hidden shadow-card animate-scale-in hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-[3/2] bg-muted">
        {mainImage ? (
          <img src={mainImage} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
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
          {listing.type === "sell" && listing.price ? (
            <p className="text-lg font-bold text-primary shrink-0">{listing.price} kr</p>
          ) : (
            <p className="text-lg font-bold text-success shrink-0">Gratis</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {listing.bottle_count && (
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {listing.bottle_count} flasker
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {listing.profiles?.avatar_url ? (
              <img src={listing.profiles.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent-foreground">
                  {(listing.profiles?.display_name || "?")[0].toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {listing.profiles?.display_name || "Anonym"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: nb })}
          </span>
        </div>
      </div>
    </div>
  );
}
