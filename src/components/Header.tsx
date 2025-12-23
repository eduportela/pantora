import pantoraLogo from "@/assets/pantora-logo.png";
interface HeaderProps {
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
}
export function Header({
  showLogo = true,
  title,
  subtitle
}: HeaderProps) {
  return <header className="pt-6 pb-4 px-4">
      {showLogo && <div className="flex items-center gap-3 mb-2">
          <img alt="Pantora" className="w-10 h-10 object-contain" src="/lovable-uploads/385c68dc-1943-49f5-9e17-a9c3c5edd87d.png" />
          <span className="text-xl font-bold text-foreground tracking-tight">Pantora</span>
        </div>}
      {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </header>;
}