import { LayoutGrid, Plus, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* Feed/Annonser */}
        <Link
          to="/feed"
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-lg transition-all duration-200",
            location.pathname === "/feed"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              location.pathname === "/feed" && "scale-110"
            )}
            strokeWidth={location.pathname === "/feed" ? 2.5 : 2}
          />
          <span className={cn(
            "text-[10px] font-medium",
            location.pathname === "/feed" && "font-semibold"
          )}>
            Annonser
          </span>
        </Link>

        {/* Center Add Button */}
        <button
          onClick={() => navigate("/create-listing")}
          className="flex items-center justify-center w-14 h-14 -mt-6 bg-primary rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </button>

        {/* Profile */}
        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-lg transition-all duration-200",
            location.pathname === "/profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              location.pathname === "/profile" && "scale-110"
            )}
            strokeWidth={location.pathname === "/profile" ? 2.5 : 2}
          />
          <span className={cn(
            "text-[10px] font-medium",
            location.pathname === "/profile" && "font-semibold"
          )}>
            Profil
          </span>
        </Link>
      </div>
    </nav>
  );
}
