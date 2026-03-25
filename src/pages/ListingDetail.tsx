import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { CommentSection } from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/components/ReportButton";
import { ArrowLeft, MapPin, Package, Heart, Phone, Mail, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const dateLocale = lang === "no" ? nb : enUS;

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*, profiles!listings_user_id_fkey(display_name, avatar_url, phone, email, phone_public, email_public)").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deleteListing = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("listings").delete().eq("id", id!); if (error) throw error; },
    onSuccess: () => { toast.success(t("listing.deleted")); queryClient.invalidateQueries({ queryKey: ["listings"] }); navigate("/feed"); },
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse w-16 h-16 rounded-full gradient-primary" /></div>;

  if (!listing) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">{t("listing.notFound")}</p>
      <Button onClick={() => navigate("/feed")}>{t("listing.back")}</Button>
    </div>
  );

  const isOwner = user?.id === listing.user_id;
  const profile = listing.profiles as any;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground truncate flex-1">{listing.title}</h1>
          <div className="flex gap-2">
            {!isOwner && <ReportButton reportType="listing" targetId={listing.id} variant="icon" />}
            {isOwner && (
              <>
                <Button size="icon" variant="ghost" onClick={() => navigate(`/create-listing?edit=${listing.id}`)}><Edit className="w-5 h-5" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if (confirm(t("listing.deleteConfirm"))) deleteListing.mutate(); }}><Trash2 className="w-5 h-5" /></Button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto">
        {listing.images && listing.images.length > 0 && <div className="aspect-[4/3] bg-muted"><img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" /></div>}
        <div className="px-4 py-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className={listing.type === "donate" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}>
                {listing.type === "donate" ? <><Heart className="w-3 h-3 mr-1" />{t("listing.donation")}</> : <><Package className="w-3 h-3 mr-1" />{t("listing.forSale")}</>}
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mt-2">{listing.title}</h2>
            </div>
            {listing.type === "sell" && listing.price ? <p className="text-2xl font-bold text-primary">{listing.price} kr</p> : <p className="text-2xl font-bold text-success">{t("listing.free")}</p>}
          </div>
          {listing.description && <p className="text-foreground">{listing.description}</p>}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {listing.bottle_count && <span className="flex items-center gap-1"><Package className="w-4 h-4" />{listing.bottle_count} {t("listing.bottles")}</span>}
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.location}</span>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? <img src={profile.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" /> : (
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center"><span className="text-lg font-bold text-accent-foreground">{(profile?.display_name || "?")[0].toUpperCase()}</span></div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-foreground">{profile?.display_name || t("listing.anonymous")}</p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: dateLocale })}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {profile?.phone_public && profile?.phone && <Button size="sm" variant="outline" className="flex-1" onClick={() => window.location.href = `tel:${profile.phone}`}><Phone className="w-4 h-4 mr-1" />{t("listing.call")}</Button>}
              {profile?.email_public && profile?.email && <Button size="sm" variant="outline" className="flex-1" onClick={() => window.location.href = `mailto:${profile.email}`}><Mail className="w-4 h-4 mr-1" />{t("listing.emailBtn")}</Button>}
              {!isOwner && <ReportButton reportType="profile" targetId={listing.user_id} variant="text" />}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4"><CommentSection listingId={listing.id} /></div>
        </div>
      </div>
    </div>
  );
}
