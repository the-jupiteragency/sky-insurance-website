"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div
      className={`flex items-center gap-2 p-2 bg-muted rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="h-8 px-3"
      >
        English
      </Button>
      <Button
        variant={language === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("ar")}
        className="h-8 px-3"
      >
        العربية
      </Button>
    </div>
  );
}
