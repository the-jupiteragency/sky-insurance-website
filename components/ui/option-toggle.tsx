"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { InsuranceOffer } from "@/lib/insurance-calculator";

interface OptionToggleProps {
  offers: InsuranceOffer[];
  selectedOffer: InsuranceOffer;
  onSelect: (offer: InsuranceOffer) => void;
  language: "en" | "ar";
}

export function OptionToggle({
  offers,
  selectedOffer,
  onSelect,
  language,
}: OptionToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRTL = language === "ar";

  if (offers.length <= 1) return null;

  const otherOffers = offers.filter(
    (offer) => offer.optionId !== selectedOffer.optionId
  );

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full justify-between text-xs h-8",
          isRTL && "flex-row-reverse"
        )}
      >
        <span>
          {language === "en"
            ? `${otherOffers.length} other option${otherOffers.length > 1 ? "s" : ""} available`
            : `${otherOffers.length} خيار${otherOffers.length > 1 ? "ات" : ""} أخرى متاحة`}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>

      {isExpanded && (
        <div className="space-y-2 p-2 bg-gray-50 rounded-lg border">
          {otherOffers.map((offer) => (
            <div
              key={offer.optionId}
              className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(offer);
                setIsExpanded(false);
              }}
            >
              <div className={cn("flex-1", isRTL && "text-right")}>
                <div className="text-xs font-medium">{offer.policyType}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "en" ? "Rate:" : "النسبة:"}{" "}
                  {(offer.premiumRate * 100).toFixed(2)}%
                </div>
              </div>
              <div className={cn("text-right", isRTL && "text-left")}>
                <div className="text-sm font-semibold text-blue-600">
                  {Math.round(offer.annualPremium).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === "en" ? "EGP/year" : "جنيه/سنة"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
