"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ChevronDown, Calculator, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

const calculatorLinks = [
  {
    href: "/calculadora",
    label: "Capacidad de Compra",
    description: "Cuanto puedes pagar por una vivienda",
    icon: Calculator,
    color: "text-blue-600",
  },
  {
    href: "/calculadora/infonavit",
    label: "INFONAVIT",
    description: "Calcula tu puntaje y credito",
    icon: Building2,
    color: "text-green-600",
  },
  {
    href: "/calculadora/inversion",
    label: "Inversion",
    description: "Cap rate, ROI y rendimientos",
    icon: TrendingUp,
    color: "text-amber-600",
  },
];

export function Navbar() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCalculatorDropdown, setShowCalculatorDropdown] = useState(false);
  const calculatorDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calculatorDropdownRef.current && !calculatorDropdownRef.current.contains(event.target as Node)) {
        setShowCalculatorDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProtectedAction = (href: string) => {
    if (!user) {
      setShowAuthModal(true);
      return null;
    }
    return href;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.webp"
                alt="Urbanify"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/propiedades"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Compra
              </Link>
              <Link
                href="/venta"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Venta
              </Link>
              <Link
                href="/propiedades?status=RENTA"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Renta
              </Link>

              {/* Calculadoras Dropdown */}
              <div className="relative" ref={calculatorDropdownRef}>
                <button
                  onClick={() => setShowCalculatorDropdown(!showCalculatorDropdown)}
                  className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Calculadoras
                  <ChevronDown className={`h-4 w-4 transition-transform ${showCalculatorDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCalculatorDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {calculatorLinks.map((calc) => {
                      const Icon = calc.icon;
                      return (
                        <Link
                          key={calc.href}
                          href={calc.href}
                          onClick={() => setShowCalculatorDropdown(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <Icon className={`h-5 w-5 mt-0.5 ${calc.color}`} />
                          <div>
                            <div className="font-medium text-sm text-foreground">{calc.label}</div>
                            <div className="text-xs text-muted-foreground">{calc.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />

              {/* Search - Goes to properties page */}
              <Link href="/propiedades">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              {/* Favorites - Goes to saved properties (requires auth) */}
              {user ? (
                <Link href="/dashboard/guardados">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => setShowAuthModal(true)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}

              {/* User Menu */}
              <UserMenu onSignInClick={() => setShowAuthModal(true)} />

              {/* Publish Property Button - Goes to Venta page */}
              <Link href="/venta" className="hidden md:inline-flex">
                <Button>
                  Publicar Propiedad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
