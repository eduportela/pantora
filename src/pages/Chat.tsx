import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useChatEnabled } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquareOff } from "lucide-react";
import { toast } from "sonner";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const chatEnabled = useChatEnabled();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    enabled: !!conversationId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId!).single();
      if (error) throw error;
      const otherId = data.user_a === user!.id ? data.user_b : data.user_a;
      const { data: profile } = await supabase
        .from("profiles").select("user_id, display_name, avatar_url").eq("user_id", otherId).maybeSingle();
      return { ...data, other: profile };
    },
  });

  // Initial load
  useEffect(() => {
    if (!conversationId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));
  }, [conversationId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === (payload.new as any).id) ? prev : [...prev, payload.new as any]));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Auto-scroll & mark read
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    if (user && conversationId && messages.length) {
      const unreadIds = messages.filter((m) => m.sender_id !== user.id && !m.read_at).map((m) => m.id);
      if (unreadIds.length) {
        supabase.from("messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds).then();
      }
    }
  }, [messages, user, conversationId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || !conversation) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      country: conversation.country,
      content: text.trim(),
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    setText("");
  };

  if (!chatEnabled) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-6 text-center">
        <MessageSquareOff className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">{t("chat.disabled")}</p>
        <Button onClick={() => navigate("/feed")}>{t("listing.back")}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/inbox")} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {conversation?.other?.avatar_url ? (
            <img src={conversation.other.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground">
              {(conversation?.other?.display_name || "?")[0].toUpperCase()}
            </div>
          )}
          <p className="font-semibold">{conversation?.other?.display_name || t("listing.anonymous")}</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 max-w-2xl mx-auto w-full">
        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="border-t border-border bg-background p-3 flex gap-2 max-w-2xl mx-auto w-full">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("chat.placeholder")}
          className="flex-1 h-11"
          disabled={sending}
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={!text.trim() || sending}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
