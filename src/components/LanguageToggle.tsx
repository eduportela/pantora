import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase text-xs font-bold">{lang === "no" ? "EN" : "NO"}</span>
    </button>
  );
}
