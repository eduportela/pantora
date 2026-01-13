import pantoraLogo from "@/assets/pantora-logo.png";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={pantoraLogo}
            alt="Pantora"
            className="w-24 h-24 animate-pulse"
          />
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
