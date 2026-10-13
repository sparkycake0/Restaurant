import { AdminShell } from "@/components/admin-shell";

// Sidebar + top bar around every staff page.
// TODO(auth): when you add real login, check the user here and redirect to /admin/login.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
