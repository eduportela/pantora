import { Bell } from "lucide-react";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { useLanguage } from "@/hooks/useLanguage";

export function NotificationBell() {
  const { data: notifications, unreadCount } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const { t, lang } = useLanguage();
  const dateLocale = lang === "no" ? nb : enUS;

  return (
    <Popover onOpenChange={(open) => { if (open && unreadCount > 0) markRead.mutate(); }}>
      <PopoverTrigger asChild>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-96 overflow-y-auto" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-foreground">{t("notifications.title")}</h3>
        </div>
        {(!notifications || notifications.length === 0) ? (
          <div className="p-6 text-center text-muted-foreground text-sm">{t("notifications.none")}</div>
        ) : (
          <div>
            {notifications.map((n) => (
              <div key={n.id} className={`p-3 border-b border-border last:border-b-0 ${!n.read ? "bg-accent/30" : ""}`}>
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: dateLocale })}</p>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
