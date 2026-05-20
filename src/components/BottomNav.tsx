import { LayoutGrid, Plus, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItem = (to: string, Icon: any, label: string) => {
    const active = location.pathname === to;
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
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <p className="text-[10px] text-muted-foreground text-center pt-1 px-2">© {new Date().getFullYear()} Pantora. All rights reserved.</p>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItem("/feed", LayoutGrid, t("nav.listings"))}

        <button
          onClick={() => navigate("/create-listing")}
          className="flex items-center justify-center w-14 h-14 -mt-6 bg-primary rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={t("create.title")}
        >
          <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </button>

        {navItem("/profile", User, t("nav.profile"))}
      </div>
    </nav>
  );
}
