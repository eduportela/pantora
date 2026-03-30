import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

type FilterType = "all" | "sell" | "donate";

export default function Feed() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { t } = useLanguage();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", filter],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select("*")
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={t("feed.title")} subtitle={t("feed.subtitle")} />

      <main className="px-4 md:px-8 lg:px-16 xl:px-24 space-y-4 max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")} className="shrink-0">{t("feed.all")}</Button>
          <Button variant={filter === "sell" ? "default" : "outline"} size="sm" onClick={() => setFilter("sell")} className="shrink-0">{t("feed.forSale")}</Button>
          <Button variant={filter === "donate" ? "default" : "outline"} size="sm" onClick={() => setFilter("donate")} className="shrink-0">{t("feed.donations")}</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!isLoading && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("feed.noListings")}</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
