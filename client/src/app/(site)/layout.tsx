import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { settings } from "@/data/settings";

// Navbar + footer around every public page.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar name={settings.name} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
