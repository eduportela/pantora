import { useCountry, COUNTRIES, Country } from "@/hooks/useCountry";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

export function CountrySelector() {
  const { country, setCountry } = useCountry();
  const qc = useQueryClient();

  const current = COUNTRIES.find((c) => c.code === country)!;

  return (
    <Select
      value={country}
      onValueChange={(v) => {
        setCountry(v as Country);
        qc.invalidateQueries();
      }}
    >
      <SelectTrigger className="h-9 w-auto min-w-[80px] gap-1 px-2.5 rounded-full bg-muted border-0 text-sm font-medium">
        <span className="text-base leading-none">{current.flag}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="flex items-center gap-2">
              <span className="text-base">{c.flag}</span>
              <span>{c.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
