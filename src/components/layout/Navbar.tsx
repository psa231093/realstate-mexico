"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
