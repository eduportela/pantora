import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useChatEnabled } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquareOff, MoreVertical, Trash2, UserX, Flag } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReportButton } from "@/components/ReportButton";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const chatEnabled = useChatEnabled();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
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
      return { ...data, otherId, other: profile };
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));
  }, [conversationId]);

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

  const handleDelete = async () => {
    if (!conversation) return;
    const { error } = await supabase.from("conversations").delete().eq("id", conversation.id);
    if (error) { toast.error(error.message); return; }
    toast.success(t("chat.deleted"));
    navigate("/inbox");
  };

  const handleBlock = async () => {
    if (!conversation || !user) return;
    const { error } = await supabase
      .from("blocked_users")
      .insert({ user_id: user.id, blocked_user_id: conversation.otherId });
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    toast.success(t("chat.userBlocked"));
    navigate("/inbox");
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
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 max-w-2xl mx-auto">
          <button onClick={() => navigate("/inbox")} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {conversation?.other?.avatar_url ? (
            <img src={conversation.other.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground shrink-0">
              {(conversation?.other?.display_name || "?")[0].toUpperCase()}
            </div>
          )}
          <p className="font-semibold truncate flex-1">{conversation?.other?.display_name || t("listing.anonymous")}</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted shrink-0" aria-label="Menu">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {conversation && (
                <ReportButton
                  reportType="conversation"
                  targetId={conversation.id}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Flag className="w-4 h-4 mr-2" />{t("chat.reportConversation")}
                    </DropdownMenuItem>
                  }
                />
              )}
              {conversation && (
                <ReportButton
                  reportType="user"
                  targetId={conversation.otherId}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Flag className="w-4 h-4 mr-2" />{t("chat.reportUser")}
                    </DropdownMenuItem>
                  }
                />
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setConfirmBlock(true)}>
                <UserX className="w-4 h-4 mr-2" />{t("chat.blockUser")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setConfirmDelete(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />{t("chat.deleteConversation")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-2 max-w-2xl mx-auto w-full">
        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`group flex items-end gap-1 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && (
                <ReportButton
                  reportType="message"
                  targetId={m.id}
                  trigger={
                    <button className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive p-1" aria-label="Report message">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  }
                />
              )}
              <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
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

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("chat.deleteConversation")}</AlertDialogTitle>
            <AlertDialogDescription>{t("chat.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("earnings.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {t("chat.deleteConversation")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmBlock} onOpenChange={setConfirmBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("chat.blockUser")}</AlertDialogTitle>
            <AlertDialogDescription>{t("chat.blockConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("earnings.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {t("chat.blockUser")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
