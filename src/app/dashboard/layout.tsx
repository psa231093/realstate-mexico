"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-card border-b border-border">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-foreground">Mi Cuenta</span>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] fixed left-0 top-0 bottom-0 border-r border-border bg-card z-30">
          <DashboardSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[280px] min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
