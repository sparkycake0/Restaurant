import { Home } from "lucide-react";
import { TableShape } from "@/components/floor";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ButtonLink } from "@/components/ui";
import { settings } from "@/data/settings";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar name={settings.name} />
      <main className="flex flex-1 flex-col items-center justify-center bg-raised px-4 py-16 text-center">
        <svg
          viewBox="0 0 260 240"
          className="h-52 w-auto"
          role="img"
          aria-label="An empty table"
        >
          <TableShape
            table={{
              id: "x",
              label: "404",
              shape: "round",
              seats: 4,
              x: 130,
              y: 120,
              active: true,
            }}
            state="free"
            radius={62}
            sr={18}
            gap={12}
            sub={false}
          />
        </svg>

        <h1 className="font-display mt-6 text-3xl text-cream sm:text-4xl">
          This table isn&apos;t on our floor plan
        </h1>
        <p className="mt-3 max-w-md text-muted sm:text-lg">
          The page you are looking for has moved or never existed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            <Home size={18} />
            Back home
          </ButtonLink>
          <ButtonLink href="/menu" variant="outline" size="lg">
            View menu
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </div>
  );
}
