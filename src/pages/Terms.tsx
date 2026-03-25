import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const sections = [
    { title: t("terms.s1.title"), text: t("terms.s1.text") },
    { title: t("terms.s2.title"), text: t("terms.s2.text") },
    { title: t("terms.s3.title"), text: t("terms.s3.text") },
    { title: t("terms.s4.title"), text: t("terms.s4.text") },
    { title: t("terms.s5.title"), text: t("terms.s5.text") },
    { title: t("terms.s6.title"), text: t("terms.s6.text") },
    { title: t("terms.s7.title"), text: t("terms.s7.text") },
    { title: t("terms.s8.title"), text: t("terms.s8.text") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />{t("terms.back")}</Button>
        <h1 className="text-2xl font-bold text-foreground mb-6">{t("terms.title")}</h1>
        <div className="prose prose-sm text-muted-foreground space-y-6">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
