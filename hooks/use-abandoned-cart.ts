"use client";

import { useEffect, useRef, useCallback } from "react";

interface AbandonedCartData {
  userInfo: {
    full_name: string;
    mobile_number: string;
    email?: string;
  };
  carInfo: {
    make: string;
    model: string;
    year: number;
    market_price: number;
    condition: string;
    fuel_type: string;
  };
  timestamp: number;
  lastActivity: number;
  currentStep: string;
  emailSent: boolean;
  sessionId: string;
  submitted: boolean;
}

const STORAGE_KEY = "sky_insurance_abandoned_cart";
const SESSION_KEY = "sky_insurance_session_id";
const GLOBAL_SENT_KEY = "sky_insurance_emails_sent";
const ABANDON_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const hasEmailBeenSent = (sessionId: string) => {
  if (typeof window === 'undefined') return false;
  
  const sentEmails = JSON.parse(localStorage.getItem(GLOBAL_SENT_KEY) || '[]');
  return sentEmails.includes(sessionId);
};

const markEmailAsSent = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  
  const sentEmails = JSON.parse(localStorage.getItem(GLOBAL_SENT_KEY) || '[]');
  if (!sentEmails.includes(sessionId)) {
    sentEmails.push(sessionId);
    localStorage.setItem(GLOBAL_SENT_KEY, JSON.stringify(sentEmails));
  }
};

export function useAbandonedCart() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>(getOrCreateSessionId());
  const lastActivityRef = useRef<number>(Date.now());

  const clearAbandonedCart = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (typeof window === 'undefined') return;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: AbandonedCartData = JSON.parse(stored);
      data.lastActivity = Date.now();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, []);

  const sendAbandonedEmail = useCallback(async (data: AbandonedCartData) => {
    if (data.emailSent || data.submitted || hasEmailBeenSent(data.sessionId)) {
      return;
    }

    try {
      await fetch("/api/send-abandoned-cart-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      data.emailSent = true;
      markEmailAsSent(data.sessionId);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to send abandoned cart email:", error);
    }
  }, []);

  const resetTimer = useCallback(() => {
    updateActivity();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (typeof window === 'undefined') return;
      
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: AbandonedCartData = JSON.parse(stored);
        await sendAbandonedEmail(data);
      }
    }, ABANDON_TIMEOUT);
  }, [updateActivity, sendAbandonedEmail]);

  const saveAbandonedCart = useCallback(
    (
      userInfo: AbandonedCartData["userInfo"],
      carInfo: AbandonedCartData["carInfo"],
      currentStep: string = "car-info"
    ) => {
      if (typeof window === 'undefined') return;
      
      const existing = sessionStorage.getItem(STORAGE_KEY);

      if (existing) {
        const existingData: AbandonedCartData = JSON.parse(existing);
        if (existingData.emailSent || existingData.submitted) {
          return;
        }
      }

      const data: AbandonedCartData = {
        userInfo,
        carInfo,
        timestamp: Date.now(),
        lastActivity: Date.now(),
        currentStep,
        emailSent: false,
        submitted: false,
        sessionId: sessionIdRef.current,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      resetTimer();
    },
    [resetTimer]
  );

  const markAsSubmitted = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: AbandonedCartData = JSON.parse(stored);
      data.submitted = true;
      markEmailAsSent(data.sessionId);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const getAbandonedCart = useCallback((): AbandonedCartData | null => {
    if (typeof window === 'undefined') return null;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    const handleBeforeUnload = () => {
      if (typeof window === 'undefined') return;
      
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: AbandonedCartData = JSON.parse(stored);
        if (!data.emailSent && !data.submitted && !hasEmailBeenSent(data.sessionId)) {
          navigator.sendBeacon(
            "/api/send-abandoned-cart-email",
            JSON.stringify(data)
          );
          markEmailAsSent(data.sessionId);
        }
      }
    };

    // Activity event listeners
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("click", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("scroll", handleActivity);
    document.addEventListener("touchstart", handleActivity);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("click", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("scroll", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return {
    saveAbandonedCart,
    getAbandonedCart,
    clearAbandonedCart,
    resetTimer,
    markAsSubmitted,
  };
}
