"use client";

import { AuthProvider } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export function SessionProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
