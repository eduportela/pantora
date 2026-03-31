import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { SafetyTipsDialog } from "@/components/SafetyTipsDialog";

export default function FAQ() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [safetyOpen, setSafetyOpen] = useState(false);

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />{t("faq.back")}</Button>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("faq.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("faq.subtitle")}</p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" size="lg" className="w-full mt-8" onClick={() => setSafetyOpen(true)}>
          {t("faq.safetyTips")}
        </Button>
      </div>
      <SafetyTipsDialog open={safetyOpen} onClose={() => setSafetyOpen(false)} />
    </div>
  );
}
