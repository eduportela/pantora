import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCountry } from "@/hooks/useCountry";
import { useChatEnabled } from "@/hooks/useAppSettings";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, MessageSquareOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Inbox() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { country } = useCountry();
  const chatEnabled = useChatEnabled();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", user?.id, country, version],
    enabled: !!user,
    queryFn: async () => {
      const { data: blocks } = await supabase
        .from("blocked_users").select("blocked_user_id").eq("user_id", user!.id);
      const blockedSet = new Set((blocks || []).map((b) => b.blocked_user_id));

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("country", country)
        .or(`user_a.eq.${user!.id},user_b.eq.${user!.id}`)
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      if (!data?.length) return [];

      const filtered = data.filter((c) => {
        const otherId = c.user_a === user!.id ? c.user_b : c.user_a;
        return !blockedSet.has(otherId);
      });
      if (!filtered.length) return [];

      const otherIds = filtered.map((c) => (c.user_a === user!.id ? c.user_b : c.user_a));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", otherIds);
      const profMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const convIds = filtered.map((c) => c.id);
      const { data: lastMessages } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at, sender_id, read_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: false });
      const lastMap = new Map<string, any>();
      const unreadMap = new Map<string, number>();
      (lastMessages || []).forEach((m) => {
        if (!lastMap.has(m.conversation_id)) lastMap.set(m.conversation_id, m);
        if (m.sender_id !== user!.id && !m.read_at) {
          unreadMap.set(m.conversation_id, (unreadMap.get(m.conversation_id) || 0) + 1);
        }
      });

      return filtered.map((c) => ({
        ...c,
        other: profMap.get(c.user_a === user!.id ? c.user_b : c.user_a),
        lastMessage: lastMap.get(c.id),
        unread: unreadMap.get(c.id) || 0,
      }));
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("inbox-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => setVersion((v) => v + 1))
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => setVersion((v) => v + 1))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!chatEnabled) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title={t("chat.title")} />
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center gap-3">
          <MessageSquareOff className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">{t("chat.disabled")}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title={t("chat.title")} />
        <div className="px-6 py-12 text-center text-muted-foreground">{t("chat.loginRequired")}</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={t("chat.title")} />
      <main className="px-4 max-w-2xl mx-auto">
        {conversations.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("chat.empty")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {conversations.map((c: any) => (
              <li key={c.id}>
                <button
                  onClick={() => navigate(`/chat/${c.id}`)}
                  className="w-full flex items-center gap-3 py-3 text-left hover:bg-muted/50 transition rounded-lg px-2"
                >
                  {c.other?.avatar_url ? (
                    <img src={c.other.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">
                      {(c.other?.display_name || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate text-foreground">{c.other?.display_name || t("listing.anonymous")}</p>
                      {c.lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(c.lastMessage.created_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate">{c.lastMessage?.content || "—"}</p>
                      {c.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
