import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useCountry } from "@/hooks/useCountry";

type FilterType = "all" | "sell" | "donate";

export default function Feed() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const { t } = useLanguage();
  const { country } = useCountry();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", filter, country],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("country", country)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("type", filter);
      }

      const { data: listingsData, error } = await query;
      if (error) throw error;
      if (!listingsData || listingsData.length === 0) return [];

      const userIds = [...new Set(listingsData.map((l) => l.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, phone, email, phone_public, email_public")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return listingsData.map((l) => ({ ...l, profiles: profileMap.get(l.user_id) || null }));
    },
  });

  // Extract unique cities from listing locations
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    listings.forEach((l: any) => {
      if (l.location) {
        // Extract city: take last part after comma, or the whole string
        const parts = l.location.split(",").map((p: string) => p.trim());
        const city = parts[parts.length - 1];
        if (city) citySet.add(city);
      }
    });
    return Array.from(citySet).sort();
  }, [listings]);

  // Filter listings by city
  const filteredListings = useMemo(() => {
    if (cityFilter === "all") return listings;
    return listings.filter((l: any) => {
      if (!l.location) return false;
      const parts = l.location.split(",").map((p: string) => p.trim());
      const city = parts[parts.length - 1];
      return city === cityFilter;
    });
  }, [listings, cityFilter]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={t("feed.title")} subtitle={t("feed.subtitle")} />

      <main className="px-4 md:px-8 lg:px-16 xl:px-24 space-y-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")} className="shrink-0">{t("feed.all")}</Button>
            <Button variant={filter === "sell" ? "default" : "outline"} size="sm" onClick={() => setFilter("sell")} className="shrink-0">{t("feed.forSale")}</Button>
            <Button variant={filter === "donate" ? "default" : "outline"} size="sm" onClick={() => setFilter("donate")} className="shrink-0">{t("feed.donations")}</Button>
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              <SelectValue placeholder={t("feed.allCities")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("feed.allCities")}</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredListings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!isLoading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("feed.noListings")}</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
