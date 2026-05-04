"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Languages, Menu, X } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const content = {
  en: {
    home: "Home",
    services: "Services",
    contact: "Contact",
    offers: "Quotes & Offers",
  },
  ar: {
    home: "الصفحة الرئيسية",
    services: "خدماتنا",
    contact: "اتصل بنا",
    offers: "عروضنا وأسعارنا",
  },
};

export default function Component() {
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === "/";
  // On mobile menu open, we force white background and dark text
  const isDarkText =
    isHomePage && !isScrolled && !isMobileMenuOpen ? false : true;
  const textColor = isDarkText ? "text-black" : "text-white";
  const bgColor =
    isScrolled || isMobileMenuOpen ? "bg-white shadow-md" : "bg-transparent";

  const isRTL = language === "ar";

  const navItems = [
    { href: "/", label: content[language as keyof typeof content].home },
    {
      href: "/services",
      label: content[language as keyof typeof content].services,
    },
    {
      href: "#contact",
      label: content[language as keyof typeof content].contact,
    },
    { href: "/quote", label: content[language as keyof typeof content].offers },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${bgColor}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png?height=75&width=75"
              alt="Sky Insurance"
              width={75}
              height={75}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} textColor={textColor}>
                {item.label}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className={`${textColor} flex items-center gap-2 px-3 py-2 hover:bg-black/5 hover:text-black`}
            >
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === "en" ? "AR" : "EN"}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className={`${textColor} flex items-center gap-2 px-2 py-2 hover:bg-black/5`}
            >
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === "en" ? "AR" : "EN"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${textColor} hover:bg-black/5`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-black text-lg font-medium hover:text-blue-900 transition-colors py-3 border-b border-gray-50 last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
  textColor,
}: {
  href: string;
  children: React.ReactNode;
  textColor: string;
}) {
  return (
    <Link
      href={href}
      className={`${textColor} hover:text-blue-900 transition-colors relative group font-medium`}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
