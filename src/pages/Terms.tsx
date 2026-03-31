import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const sections = Array.from({ length: 12 }, (_, i) => ({
    title: t(`terms.s${i + 1}.title`),
    text: t(`terms.s${i + 1}.text`),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />{t("terms.back")}</Button>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("terms.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("terms.lastUpdated")}</p>
        <div className="prose prose-sm text-muted-foreground space-y-6">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="whitespace-pre-line">{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
