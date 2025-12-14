"use client";

import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Bienes Raíces México</span>
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
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden md:inline-flex">
              Publicar Propiedad
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
