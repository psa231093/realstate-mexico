"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const supabase = createClient();
      const { data: profile } = await supabase
        .from("Profile")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(profile?.role === "ADMIN");
    }

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  // Show loading while checking auth and admin status
  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesion para acceder al panel de administracion.
          </p>
          <Button onClick={() => router.push("/")}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acceso Restringido
          </h1>
          <p className="text-muted-foreground mb-6">
            No tienes permisos de administrador para acceder a esta seccion.
          </p>
          <Button onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] border-r border-border z-30">
        <AdminSidebar />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground">Admin Panel</span>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-[280px]">
        <div className="container max-w-6xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
