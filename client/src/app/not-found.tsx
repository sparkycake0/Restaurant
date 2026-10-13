import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ButtonLink } from "@/components/ui";
import { settings } from "@/data/settings";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar name={settings.name} />
      <main className="flex flex-1 flex-col items-center justify-center bg-raised px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-cream sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-muted sm:text-lg">The page you are looking for has moved or never existed.</p>
        <ButtonLink href="/" size="lg" className="mt-8">Back home</ButtonLink>
      </main>
      <Footer />
    </div>
  );
}
