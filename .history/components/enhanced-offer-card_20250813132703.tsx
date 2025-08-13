"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Star,
  Info,
  ChevronDown,
  ChevronUp,
  Calculator,
  Shield,
  FileText,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { InsuranceOffer } from "@/lib/insurance-calculator";

interface EnhancedOfferCardProps {
  offer: InsuranceOffer;
  language: "en" | "ar";
  isSelected: boolean;
  onSelect: () => void;
  rank?: number;
  carInfo?: {
    make: string;
    model: string;
    year: number;
    market_price: number;
    condition: string;
    fuel_type: string;
  };
}

export function EnhancedOfferCard({
  offer,
  language,
  isSelected,
  onSelect,
  rank,
  carInfo,
}: EnhancedOfferCardProps) {
  const isRTL = language === "ar";
  const isBestOffer = rank === 1;
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);

  const getDetailedTooltipContent = () => {
    const monthlyPremium = Math.round(offer.annualPremium / 12);
    const dailyCost = Math.round(offer.annualPremium / 365);
    const coveragePercentage = (
      (offer.annualPremium / (carInfo?.market_price || 1)) *
      100
    ).toFixed(2);

    return (
      <div className="space-y-4 w-full p-4">
        {/* Premium Breakdown */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4
            className={cn(
              "font-semibold text-blue-900 mb-2 flex items-center gap-1",
              isRTL && "flex-row-reverse"
            )}
          >
            <Calculator className="h-3 w-3" />
            <span className={isRTL ? "text-right" : ""}>
              {language === "en" ? "Premium Breakdown" : "تفاصيل القسط"}
            </span>
          </h4>
          <div className="space-y-1 text-xs text-blue-800">
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Annual:" : "سنوياً:"}
              </span>
              <span className="font-semibold">
                {Math.round(offer.annualPremium).toLocaleString()} EGP
              </span>
            </div>
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Monthly:" : "شهرياً:"}
              </span>
              <span>{monthlyPremium.toLocaleString()} EGP</span>
            </div>
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Daily:" : "يومياً:"}
              </span>
              <span>{dailyCost} EGP</span>
            </div>
            <div
              className={cn(
                "flex justify-between border-t pt-1",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Rate:" : "النسبة:"}
              </span>
              <span className="font-semibold">
                {(offer.premiumRate * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4
            className={cn(
              "font-semibold text-green-900 mb-2 flex items-center gap-1",
              isRTL && "flex-row-reverse"
            )}
          >
            <Shield className="h-3 w-3" />
            <span className={isRTL ? "text-right" : ""}>
              {language === "en" ? "Coverage Details" : "تفاصيل التغطية"}
            </span>
          </h4>
          <div className="space-y-1 text-xs text-green-800">
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Policy Type:" : "نوع الوثيقة:"}
              </span>
              <span className={cn("font-semibold", isRTL && "text-right")}>
                {offer.policyType}
              </span>
            </div>
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Deductible:" : "التحمل:"}
              </span>
              <span className={isRTL ? "text-right" : ""}>
                {offer.deductible}
              </span>
            </div>
            {carInfo && (
              <div
                className={cn(
                  "flex justify-between",
                  isRTL && "flex-row-reverse"
                )}
              >
                <span className={isRTL ? "text-right" : ""}>
                  {language === "en" ? "Vehicle Value:" : "قيمة السيارة:"}
                </span>
                <span>{carInfo.market_price.toLocaleString()} EGP</span>
              </div>
            )}
            <div
              className={cn(
                "flex justify-between border-t pt-1",
                isRTL && "flex-row-reverse"
              )}
            >
              <span className={isRTL ? "text-right" : ""}>
                {language === "en" ? "Coverage %:" : "نسبة التغطية:"}
              </span>
              <span className="font-semibold">{coveragePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4
            className={cn(
              "font-semibold text-yellow-900 mb-2 flex items-center gap-1",
              isRTL && "flex-row-reverse"
            )}
          >
            <Star className="h-3 w-3" />
            <span className={isRTL ? "text-right" : ""}>
              {language === "en" ? "Key Benefits" : "المزايا الرئيسية"}
            </span>
          </h4>
          <ul className="text-xs text-yellow-800 space-y-1">
            {offer.features[language].slice(0, 4).map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-start gap-1",
                  isRTL && "flex-row-reverse"
                )}
              >
                <CheckCircle
                  className={cn(
                    "h-2 w-2 text-green-600 mt-0.5 flex-shrink-0",
                    isRTL && "order-last"
                  )}
                />
                <span className={isRTL ? "text-right" : ""}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Terms */}
        <div className="bg-orange-50 p-3 rounded-lg">
          <h4
            className={cn(
              "font-semibold text-orange-900 mb-2 flex items-center gap-1",
              isRTL && "flex-row-reverse"
            )}
          >
            <FileText className="h-3 w-3" />
            <span className={isRTL ? "text-right" : ""}>
              {language === "en" ? "Conditons" : "الشروط المهمة"}
            </span>
          </h4>
          <ul className="text-xs text-orange-800 space-y-1">
            {offer.conditions[language].slice(0, 3).map((condition, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-start gap-1",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Info
                  className={cn(
                    "h-2 w-2 text-blue-600 mt-0.5 flex-shrink-0",
                    isRTL && "order-last"
                  )}
                />
                <span className={isRTL ? "text-right" : ""}>{condition}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4
            className={cn(
              "font-semibold text-gray-900 mb-2",
              isRTL && "text-right"
            )}
          >
            {language === "en"
              ? "About " + offer.company
              : "حول " + offer.company}
          </h4>
          <p className={cn("text-xs text-gray-700", isRTL && "text-right")}>
            {language === "en"
              ? `${offer.company} is a leading insurance provider in Egypt, offering comprehensive coverage with excellent customer service and competitive rates.`
              : `${offer.company} هي شركة تأمين رائدة في مصر، تقدم تغطية شاملة مع خدمة عملاء ممتازة وأسعار تنافسية.`}
          </p>
        </div>

        {/* Action Recommendation */}
        {isBestOffer && (
          <div className="bg-green-100 p-3 rounded-lg border border-green-300">
            <p
              className={cn(
                "text-xs text-green-800 font-semibold text-center",
                isRTL && "text-right"
              )}
            >
              {language === "en"
                ? "🏆 Recommended: Best value for your vehicle!"
                : "🏆 موصى به: أفضل قيمة لسيارتك!"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 hover:shadow-xl border-2 h-fit",
        isSelected
          ? "ring-4 ring-blue-400 shadow-2xl border-blue-300 bg-blue-50/30"
          : "hover:shadow-lg hover:-translate-y-1 border-gray-200 hover:border-blue-200"
      )}
    >
      {/* GIG Gold Badge */}
      {offer.company === "GIG Insurance" && offer.planType === "Gold" && (
        <div className="absolute -top-3 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-3 py-1 text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>{language === "en" ? "Gold Plan" : "خطة ذهبية"}</span>
          </Badge>
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10 bg-blue-500 text-white rounded-full p-2">
          <CheckCircle className="h-4 w-4" />
        </div>
      )}

      <CardHeader className="pb-4 p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-16 h-10 sm:w-20 sm:h-12 bg-white rounded-lg flex items-center justify-center border-2 shadow-sm overflow-hidden flex-shrink-0">
            <img
              src={offer.logo || "/placeholder.svg"}
              alt={`${offer.company} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.style.backgroundColor = offer.companyColor;
                  parent.innerHTML = `<span class="text-white font-bold text-xs">${offer.company.charAt(0)}</span>`;
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle
              className={cn(
                "text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight",
                isRTL && "text-right"
              )}
            >
              {offer.company}
            </CardTitle>
            <p
              className={cn(
                "text-sm sm:text-base text-gray-600 mt-1 leading-relaxed",
                isRTL && "text-right"
              )}
            >
              {offer.policyType}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Price Section */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-100">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 mb-2 flex items-center justify-center gap-2">
            <span>{Math.round(offer.annualPremium).toLocaleString()}</span>
            <span className="text-lg sm:text-xl font-medium text-blue-600">
              {language === "en" ? "EGP" : "جنيه"}
            </span>
          </div>
          <p className="text-sm sm:text-base text-blue-600 font-medium">
            {language === "en" ? "per year" : "سنوياً"}
          </p>
          <div className="flex justify-center mt-3">
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200"
            >
              {(offer.premiumRate * 100).toFixed(2)}%{" "}
              {language === "en" ? "rate" : "نسبة"}
            </Badge>
          </div>
        </div>

        {/* Conditions Accordion */}
        <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between p-3 sm:p-4 h-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg",
                isRTL
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 w-full",
                  isRTL ? "justify-start flex-row" : ""
                )}
              >
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span
                  className={cn(
                    "text-sm sm:text-base font-semibold text-gray-800",
                    isRTL && "text-right"
                  )}
                >
                  {language === "en" ? "View Conditions" : "عرض الشروط"}
                </span>
              </div>
              {isConditionsOpen ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2">
            <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
              <ul className="space-y-2 sm:space-y-3">
                {offer.conditions[language === "ar" ? "ar" : "ar"].map(
                  (condition, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 text-right"
                      dir="ltr"
                    >
                      {/* <span className="text-orange-600 mt-1 flex-shrink-0 text-sm sm:text-base">
                        •
                      </span> */}
                      <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed font-medium flex-1">
                        {condition}
                      </span>
                      <span className="text-orange-600 mt-1 flex-shrink-0 text-sm sm:text-base">
                        •
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Button */}
        <Button
          onClick={onSelect}
          className={cn(
            "w-full h-12 sm:h-14 text-base sm:text-lg font-semibold transition-all duration-200",
            isSelected
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
              : "bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-400"
          )}
          size="lg"
        >
          {isSelected
            ? language === "en"
              ? "✓ Selected"
              : "✓ محدد"
            : language === "en"
              ? "Select This Offer"
              : "اختر هذا العرض"}
        </Button>
      </CardContent>
    </Card>
  );
}
