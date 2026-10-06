"use client";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Card, Field, Input } from "@/components/ui";
import { writeStorage } from "@/lib/useLocalStorage";

// PLACEHOLDER LOGIN: any username and password is accepted and saved in localStorage.
// TODO: replace with a real login request to your backend.
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    writeStorage("user", { username, password });
    router.push("/admin");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-ink p-4">
      <Card className="w-full max-w-110 p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <Logo size={80} />
          <h1 className="font-display mt-5 text-3xl text-cream">
            Staff sign in
          </h1>
          <p className="mt-1 text-[14.5px] text-muted">
            For restaurant staff only.
          </p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          <Button type="submit" size="lg" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
          <Lock size={14} />
          Placeholder login: any username and password works.
        </p>
      </Card>
    </main>
  );
}
