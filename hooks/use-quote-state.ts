"use client";

import { useState, useEffect } from "react";
import type { CarInfo, UserInfo } from "@/lib/validations";
import type { InsuranceOffer } from "@/lib/insurance-calculator";

type Step = "car-info" | "user-info" | "documents" | "offers" | "thank-you";

interface Documents {
  personal_id_front: File | null;
  personal_id_back: File | null;
  license_front: File | null;
  license_back: File | null;
}

interface QuoteState {
  currentStep: Step;
  carInfo: Partial<CarInfo>;
  userInfo: Partial<UserInfo>;
  documents: Documents;
  offers: InsuranceOffer[];
  selectedOffer: InsuranceOffer | null;
  language: "en" | "ar";
  errors: Record<string, string>;
  isSubmitted: boolean; // Add this new field
}

const STORAGE_KEY = "sky-insurance-quote-state";

const initialState: QuoteState = {
  currentStep: "car-info",
  carInfo: {},
  userInfo: {},
  documents: {
    personal_id_front: null,
    personal_id_back: null,
    license_front: null,
    license_back: null,
  },
  offers: [],
  selectedOffer: null,
  language: "en",
  errors: {},
  isSubmitted: false, // Add this
};

export function useQuoteState() {
  const [state, setState] = useState<QuoteState>(initialState);

  // Removed localStorage persistence to ensure the form resets on page reload/close.

  const updateState = (updates: Partial<QuoteState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateCarInfo = (carInfo: Partial<CarInfo>) => {
    setState((prev) => ({ ...prev, carInfo: { ...prev.carInfo, ...carInfo } }));
  };

  const updateUserInfo = (userInfo: Partial<UserInfo>) => {
    setState((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, ...userInfo },
    }));
  };

  const updateDocuments = (documents: Partial<Documents>) => {
    setState((prev) => ({
      ...prev,
      documents: { ...prev.documents, ...documents },
    }));
  };

  const setCurrentStep = (step: Step) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const setErrors = (errors: Record<string, string>) => {
    setState((prev) => ({ ...prev, errors }));
  };

  const clearState = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Add a new function to mark as submitted
  const markAsSubmitted = () => {
    setState((prev) => ({ ...prev, isSubmitted: true }));
  };

  // Update canNavigateToStep to use submission status
  const canNavigateToStep = (targetStep: Step): boolean => {
    const steps: Step[] = [
      "car-info",
      "user-info",
      "documents",
      "offers",
      "thank-you",
    ];
    const currentIndex = steps.indexOf(state.currentStep);
    const targetIndex = steps.indexOf(targetStep);

    // Can always go back
    if (targetIndex <= currentIndex) {
      return true;
    }

    // Can only access thank-you step after successful submission
    if (targetStep === "thank-you") {
      return state.isSubmitted;
    }

    // Can only go forward if previous steps are completed
    switch (targetStep) {
      case "user-info":
        return (
          !!state.carInfo.make &&
          !!state.carInfo.model &&
          !!state.carInfo.year &&
          !!state.carInfo.market_price
        );
      case "documents":
        return !!state.userInfo.full_name && !!state.userInfo.mobile_number;
      case "offers":
        return (
          !!state.documents.personal_id_front &&
          !!state.documents.personal_id_back &&
          !!state.documents.license_front &&
          !!state.documents.license_back
        );
      default:
        return false;
    }
  };

  return {
    state,
    updateState,
    updateCarInfo,
    updateUserInfo,
    updateDocuments,
    setCurrentStep,
    setErrors,
    clearState,
    canNavigateToStep,
    markAsSubmitted, // Add this
  };
}
