"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useUser } from "@/lib/useUser";

// Wraps every staff page. If nobody is logged in (nothing saved in localStorage) it sends you to the login page.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser, loaded] = useUser();

  useEffect(() => {
    if (loaded && !user) router.replace("/admin/login");
  }, [loaded, user, router]);

  if (!loaded || !user) return null;
  return (
    <AdminShell username={user.username} onLogout={() => { setUser(null); router.push("/admin/login"); }}>
      {children}
    </AdminShell>
  );
}
