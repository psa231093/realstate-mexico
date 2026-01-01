"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2, Check } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  sellerType: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    sellerType: "",
  });

  const userAvatar = profile?.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Usuario";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          sellerType: data.sellerType || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => prev ? { ...prev, avatarUrl: data.url } : null);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
          <div className="space-y-4 max-w-md mx-auto">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Administra tu informacion personal
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-lg border border-border">
        {/* Avatar Section */}
        <div className="p-6 flex flex-col items-center border-b border-border">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Haz clic en el icono de camara para cambiar tu foto
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 space-y-6">
          <div className="grid gap-6 max-w-md">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre completo
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Tu nombre"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Correo electronico
              </label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El correo esta vinculado a tu cuenta de Google
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Telefono
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+52 55 1234 5678"
                type="tel"
              />
            </div>

            {/* Seller Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tipo de vendedor
              </label>
              <Select
                value={formData.sellerType}
                onValueChange={(value) =>
                  setFormData({ ...formData, sellerType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARTICULAR">Particular</SelectItem>
                  <SelectItem value="INMOBILIARIA">Inmobiliaria</SelectItem>
                  <SelectItem value="CORREDOR">Corredor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Guardado
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
            {saveSuccess && (
              <span className="text-sm text-green-600">
                Cambios guardados exitosamente
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
