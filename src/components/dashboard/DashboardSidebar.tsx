"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Heart,
  Search,
  Clock,
  MessageSquare,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/perfil", label: "Mi Perfil", icon: User },
  { href: "/dashboard/guardados", label: "Propiedades Guardadas", icon: Heart },
  { href: "/dashboard/busquedas-guardadas", label: "Busquedas Guardadas", icon: Search },
  { href: "/dashboard/vistos-recientemente", label: "Vistos Recientemente", icon: Clock },
  { href: "/dashboard/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/dashboard/mis-propiedades", label: "Mis Propiedades", icon: Home },
];

const settingsItems = [
  { href: "/dashboard/configuracion", label: "Configuracion", icon: Settings },
];

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Usuario";
  const userEmail = user?.email || "";
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{userName}</p>
            <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Separator className="my-4" />

        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesion
        </Button>
      </div>
    </div>
  );
}
