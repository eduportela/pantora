import { LayoutGrid, MessageCircle, Plus, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useChatEnabled } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const chatEnabled = useChatEnabled();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread-total", user?.id, tick],
    enabled: !!user && chatEnabled,
    queryFn: async () => {
      const { data: convs } = await supabase
        .from("conversations").select("id").or(`user_a.eq.${user!.id},user_b.eq.${user!.id}`);
      if (!convs?.length) return 0;
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("conversation_id", convs.map((c) => c.id))
        .neq("sender_id", user!.id)
        .is("read_at", null);
      return count ?? 0;
    },
  });

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("nav-unread")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => setTick((v) => v + 1))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const navItem = (to: string, Icon: any, label: string, badge?: number) => {
    const active = location.pathname === to || (to === "/inbox" && location.pathname.startsWith("/chat"));
    return (
      <Link
        to={to}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-lg transition-all duration-200",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className={cn("w-5 h-5 transition-transform duration-200", active && "scale-110")} strokeWidth={active ? 2.5 : 2} />
        <span className={cn("text-[10px] font-medium", active && "font-semibold")}>{label}</span>
        {badge && badge > 0 ? (
          <span className="absolute top-1 right-3 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <p className="text-[10px] text-muted-foreground text-center pt-1">© {new Date().getFullYear()} Pantora. All rights reserved.</p>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItem("/feed", LayoutGrid, t("nav.listings"))}
        {chatEnabled && navItem("/inbox", MessageCircle, t("nav.inbox"), unread)}

        <button
          onClick={() => navigate("/create-listing")}
          className="flex items-center justify-center w-14 h-14 -mt-6 bg-primary rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </button>

        {navItem("/profile", User, t("nav.profile"))}
      </div>
    </nav>
  );
}
