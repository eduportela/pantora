import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Country = "NO" | "SE" | "DE" | "DK";

export const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "NO", name: "Norge", flag: "🇳🇴" },
  { code: "SE", name: "Sverige", flag: "🇸🇪" },
  { code: "DE", name: "Deutschland", flag: "🇩🇪" },
  { code: "DK", name: "Danmark", flag: "🇩🇰" },
];

interface CountryContextType {
  country: Country;
  setCountry: (c: Country) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem("pantora-country") as Country | null;
    return saved && ["NO", "SE", "DE", "DK"].includes(saved) ? saved : "NO";
  });

  useEffect(() => {
    localStorage.setItem("pantora-country", country);
  }, [country]);

  const setCountry = (c: Country) => setCountryState(c);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
}
