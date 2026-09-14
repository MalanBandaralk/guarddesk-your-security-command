import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in | GuardDesk" },
    { name: "description", content: "Sign in to your GuardDesk security operations workspace." },
    { property: "og:title", content: "Sign in | GuardDesk" },
    { property: "og:description", content: "Access your GuardDesk operations workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => { if (user) window.location.replace("/app"); }, [user]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    setBusy(false);
    if (result.error) return toast.error(result.error.message);
    if (mode === "signup" && !result.data.session) toast.success("Check your email to confirm your account.");
    else window.location.href = "/app";
  };

  return <main className="grid min-h-screen bg-muted/30 lg:grid-cols-[1.1fr_.9fr]">
    <section className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col">
      <BrandMark className="[&_*]:text-background" />
      <div className="my-auto max-w-xl"><p className="text-sm font-semibold uppercase text-success">Operations, proven</p><h1 className="mt-4 text-5xl font-semibold leading-tight">Every post covered. Every shift accounted for.</h1><p className="mt-6 text-lg text-background/70">One connected command center for deployment, attendance, patrols, incidents, payroll, billing and contract performance.</p></div>
      <p className="text-sm text-background/60">Built for professional security operations.</p>
    </section>
    <section className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to GuardDesk</Link><div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8"><BrandMark className="mb-8 lg:hidden" /><h2 className="text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2><p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to your operations workspace." : "Start a secure GuardDesk workspace."}</p><form className="mt-7 space-y-4" onSubmit={submit}>{mode === "signup" && <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" /></div>}<div className="space-y-2"><Label htmlFor="email">Work email</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete={mode === "signin" ? "current-password" : "new-password"} /></div><Button className="w-full" size="lg" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />}{mode === "signin" ? "Sign in" : "Create account"}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">{mode === "signin" ? "New to GuardDesk?" : "Already have an account?"} <button className="font-medium text-primary hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p></div></div></section>
  </main>;
}