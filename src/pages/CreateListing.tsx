import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, X, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useQueryClient } from "@tanstack/react-query";
import { SafetyTipsDialog } from "@/components/SafetyTipsDialog";

export default function CreateListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [bottleCount, setBottleCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(() => !editId);
  useEffect(() => {
    if (editId) {
      supabase.from("listings").select("*").eq("id", editId).single().then(({ data }) => {
        if (data) { setTitle(data.title); setDescription(data.description || ""); setPrice(data.price?.toString() || ""); setLocation(data.location); setBottleCount(data.bottle_count?.toString() || ""); setExistingImages(data.images || []); }
      });
    }
  }, [editId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + existingImages.length + files.length > 4) { toast.error(t("create.maxImages")); return; }
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeNewImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const removeExistingImage = (index: number) => setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const uploadImages = async (): Promise<string[]> => {
    if (!user) return [];
    const urls: string[] = [...existingImages];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("listings").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("listings").getPublicUrl(path);
      urls.push(publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (images.length === 0 && existingImages.length === 0) { toast.error(t("create.addImageError")); return; }
    if (!title.trim()) { toast.error(t("create.addTitleError")); return; }
    if (!location.trim()) { toast.error(t("create.addLocationError")); return; }

    setIsSubmitting(true);
    try {
      const imageUrls = await uploadImages();
      const listingData = { title: title.trim(), description: description.trim() || null, price: price ? parseInt(price) : null, location: location.trim(), bottle_count: bottleCount ? parseInt(bottleCount) : null, type: (!price || parseInt(price) === 0) ? "donate" : "sell", images: imageUrls, user_id: user.id };

      if (editId) {
        const { error } = await supabase.from("listings").update(listingData).eq("id", editId);
        if (error) throw error;
        toast.success(t("create.updated"));
      } else {
        const { error } = await supabase.from("listings").insert(listingData);
        if (error) throw error;
        toast.success(t("create.published"));
      }
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.message || t("general.somethingWrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{editId ? t("create.editTitle") : t("create.title")}</h1>
            <p className="text-sm text-muted-foreground">{editId ? t("create.editSubtitle") : t("create.subtitle")}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t("create.images")}</Label>
          <div className="grid grid-cols-4 gap-3">
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {images.map((file, index) => (
              <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {images.length + existingImages.length < 4 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground mb-1" /><span className="text-xs text-muted-foreground">{t("create.addImage")}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t("create.titleLabel")}</Label>
          <Input placeholder={t("create.titlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t("create.description")}</Label>
          <Textarea placeholder={t("create.descPlaceholder")} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="resize-none" />
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t("create.bottleCount")}</Label>
          <Input type="number" placeholder="0" value={bottleCount} onChange={(e) => setBottleCount(e.target.value)} className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t("create.price")}</Label>
          <div className="relative">
            <Input type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 pr-12" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">kr</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("create.priceDonation")}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t("create.location")}</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder={t("create.locationPlaceholder")} value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 pl-12" />
          </div>
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("create.publishing") : editId ? t("create.update") : t("create.publish")}
        </Button>
      </form>
      <SafetyTipsDialog open={showSafetyTips} onClose={() => setShowSafetyTips(false)} continueLabel={t("safety.continuePost")} />
    </div>
  );
}
