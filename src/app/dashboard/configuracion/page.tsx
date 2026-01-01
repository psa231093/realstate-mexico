"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Shield, Bell, Trash2, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    searchAlerts: true,
    propertyUpdates: true,
    inquiries: true,
  });

  const handleDeactivate = async () => {
    // In a real app, this would call an API to deactivate the account
    await signOut();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Sign In & Security */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Inicio de Sesion y Seguridad
            </h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          {/* Email */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Correo electronico</p>
              <p className="text-sm text-muted-foreground">
                El correo asociado a tu cuenta
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user?.email}</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Inicio de sesion con Google</p>
              <p className="text-sm text-muted-foreground">
                Tu cuenta esta vinculada a Google
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm text-green-600 font-medium">Conectado</span>
            </div>
          </div>

          {/* Password */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Contrasena</p>
              <p className="text-sm text-muted-foreground">
                No aplica - Inicias sesion con Google
              </p>
            </div>
            <Button variant="outline" disabled>
              No disponible
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Notificaciones
            </h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          {/* Search Alerts */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Alertas de busqueda</p>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones cuando haya nuevas propiedades que coincidan con tus busquedas
              </p>
            </div>
            <Switch
              checked={notifications.searchAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, searchAlerts: checked })
              }
            />
          </div>

          {/* Property Updates */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Actualizaciones de propiedades</p>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones cuando cambien los precios de propiedades guardadas
              </p>
            </div>
            <Switch
              checked={notifications.propertyUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, propertyUpdates: checked })
              }
            />
          </div>

          {/* Inquiry Notifications */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Consultas</p>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones cuando alguien te contacte sobre tus propiedades
              </p>
            </div>
            <Switch
              checked={notifications.inquiries}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, inquiries: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-lg border border-destructive/50">
        <div className="p-6 border-b border-destructive/50">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">
              Zona de Peligro
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Desactivar cuenta</p>
              <p className="text-sm text-muted-foreground">
                Tu cuenta sera desactivada y no podras iniciar sesion hasta que la reactives
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Desactivar cuenta</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tu cuenta sera desactivada y no podras acceder a tus propiedades,
                    favoritos ni mensajes. Podras reactivar tu cuenta iniciando sesion
                    nuevamente con Google.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivate}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Desactivar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Al usar nuestros servicios, aceptas nuestros{" "}
          <a href="/terminos" className="text-primary hover:underline">
            Terminos de Servicio
          </a>{" "}
          y{" "}
          <a href="/privacidad" className="text-primary hover:underline">
            Politica de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}
