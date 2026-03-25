import { useState } from "react";
import { Mail, HelpCircle, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function FloatingButtons() {
  const [contactOpen, setContactOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3">
        <button
          onClick={() => setContactOpen(true)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Kontakt oss"
        >
          <Mail className="w-5 h-5" />
        </button>
        <button
          onClick={() => setHelpOpen(true)}
          className="w-12 h-12 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Hjelp"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}

function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Kontakt oss</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Maria Figu</p>
            <a
              href="mailto:mariafigu@pantora.no"
              className="text-sm text-primary font-medium hover:underline"
            >
              mariafigu@pantora.no
            </a>
          </div>
        </div>
        <Button variant="default" className="w-full" onClick={() => window.location.href = "mailto:mariafigu@pantora.no"}>
          <Mail className="w-4 h-4 mr-2" />
          Send e-post
        </Button>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function HelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !category || !message.trim()) {
      toast.error("Fyll ut alle feltene");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("help_requests").insert({
      user_id: user?.id || null,
      name: name.trim(),
      email: email.trim(),
      category,
      message: message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Kunne ikke sende forespørselen");
      return;
    }
    toast.success("Hjelpeforespørsel sendt!");
    setName("");
    setEmail("");
    setCategory("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trenger du hjelp?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Navn</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ditt navn" />
          </div>
          <div className="space-y-2">
            <Label>E-post</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@epost.no" />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Velg kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Konto og innlogging</SelectItem>
                <SelectItem value="listing">Annonser</SelectItem>
                <SelectItem value="payment">Betaling</SelectItem>
                <SelectItem value="safety">Sikkerhet</SelectItem>
                <SelectItem value="bug">Feil i appen</SelectItem>
                <SelectItem value="other">Annet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Melding</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Beskriv problemet ditt..."
              rows={4}
              className="resize-none"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Sender..." : "Send forespørsel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
