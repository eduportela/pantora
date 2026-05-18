import { useLanguage, LANGUAGES, Lang } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger className="h-9 w-auto min-w-[80px] gap-1.5 px-2.5 rounded-full bg-muted border-0 text-sm font-medium">
        <Globe className="w-3.5 h-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            <span className="flex items-center gap-2">
              <span className="uppercase font-semibold text-xs">{l.code}</span>
              <span>{l.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
