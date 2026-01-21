import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, X, MapPin, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CreateListing() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 4) {
      toast.error("Du kan laste opp maks 4 bilder");
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Legg til minst ett bilde");
      return;
    }

    if (!title.trim()) {
      toast.error("Legg til en tittel");
      return;
    }

    if (!location.trim()) {
      toast.error("Legg til en lokasjon");
      return;
    }

    if (!contact.trim()) {
      toast.error("Legg til kontaktinformasjon");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast.success("Annonsen din er publisert!");
      navigate("/feed");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Custom Header with Back Button */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-pt">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Ny annonse</h1>
            <p className="text-sm text-muted-foreground">Legg ut flasker for salg eller donasjon</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Upload */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Bilder</Label>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-muted"
              >
                <img
                  src={img}
                  alt={`Bilde ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Legg til</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Maks 4 bilder</p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">
            Tittel
          </Label>
          <Input
            id="title"
            placeholder="f.eks. Stor pose med flasker"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-semibold">
            Beskrivelse
          </Label>
          <Textarea
            id="description"
            placeholder="Beskriv hva du har å tilby..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-semibold">
            Pris (valgfritt)
          </Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              kr
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            La stå tom eller sett til 0 for donasjon
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-base font-semibold">
            Lokasjon
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="location"
              placeholder="f.eks. Grünerløkka, Oslo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 pl-12"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <Label htmlFor="contact" className="text-base font-semibold">
            Kontakt
          </Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="contact"
              type="tel"
              placeholder="+47 000 00 000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="h-12 pl-12"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publiserer..." : "Publiser annonse"}
        </Button>
      </form>
    </div>
  );
}
