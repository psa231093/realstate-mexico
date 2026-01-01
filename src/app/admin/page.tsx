"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  Building2,
  Users,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  UserCheck,
  Shield,
  Clock,
} from "lucide-react";

interface Stats {
  properties: {
    total: number;
    active: number;
    inactive: number;
    featured: number;
    newThisWeek: number;
  };
  users: {
    total: number;
    admins: number;
    agents: number;
    regular: number;
    newThisWeek: number;
  };
  inquiries: {
    total: number;
    pending: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Properties Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Propiedades</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/propiedades">Ver todas</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Propiedades"
            value={stats?.properties.total || 0}
            icon={Building2}
            trend={{
              value: stats?.properties.newThisWeek || 0,
              label: "esta semana",
            }}
          />
          <StatsCard
            title="Activas"
            value={stats?.properties.active || 0}
            subtitle="Visibles en el sitio"
            icon={Eye}
            variant="success"
          />
          <StatsCard
            title="Inactivas"
            value={stats?.properties.inactive || 0}
            subtitle="Ocultas o rechazadas"
            icon={EyeOff}
            variant="warning"
          />
          <StatsCard
            title="Destacadas"
            value={stats?.properties.featured || 0}
            subtitle="Propiedades premium"
            icon={Star}
            variant="default"
          />
        </div>
      </div>

      {/* Users Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Usuarios</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/usuarios">Ver todos</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Usuarios"
            value={stats?.users.total || 0}
            icon={Users}
            trend={{
              value: stats?.users.newThisWeek || 0,
              label: "esta semana",
            }}
          />
          <StatsCard
            title="Usuarios Regulares"
            value={stats?.users.regular || 0}
            icon={UserCheck}
          />
          <StatsCard
            title="Agentes"
            value={stats?.users.agents || 0}
            icon={TrendingUp}
          />
          <StatsCard
            title="Administradores"
            value={stats?.users.admins || 0}
            icon={Shield}
          />
        </div>
      </div>

      {/* Inquiries Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Consultas</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/consultas">Ver todas</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <StatsCard
            title="Total Consultas"
            value={stats?.inquiries.total || 0}
            icon={MessageSquare}
          />
          <StatsCard
            title="Pendientes"
            value={stats?.inquiries.pending || 0}
            subtitle="Sin responder"
            icon={Clock}
            variant={stats?.inquiries.pending && stats.inquiries.pending > 0 ? "warning" : "default"}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Acciones Rapidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/propiedades?filter=inactive">
              <EyeOff className="h-4 w-4 mr-2" />
              Revisar propiedades inactivas
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/consultas?filter=pending">
              <Clock className="h-4 w-4 mr-2" />
              Ver consultas pendientes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/usuarios">
              <Users className="h-4 w-4 mr-2" />
              Gestionar usuarios
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
