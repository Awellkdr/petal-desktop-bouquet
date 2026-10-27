import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Adey Digital" },
      { name: "description", content: "Confirm Telebirr payments and create custom bouquets." },
      { property: "og:title", content: "Admin — Adey Digital" },
      { property: "og:description", content: "Adey Digital payment confirmation dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Order = {
  id: string;
  code: string;
  recipient: string | null;
  sender: string | null;
  reference: string;
  status: string;
  created_at: string;
};

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return (
    <main className="bloom-landing mx-auto min-h-screen max-w-5xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Adey Digital admin</h1>
      {session ? <Dashboard /> : <SignIn />}
    </main>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const go = async (mode: "in" | "up") => {
    setMsg("");
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    if (error) setMsg(error.message);
    else if (mode === "up") setMsg("Check your email to confirm your account, then sign in.");
  };
  return (
    <div className="max-w-sm space-y-3 rounded-xl border border-border bg-card p-6">
      <input className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded-md border border-input bg-background px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex gap-2">
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground" onClick={() => go("in")}>Sign in</button>
        <button className="rounded-md border border-border px-4 py-2" onClick={() => go("up")}>Create account</button>
      </div>
      <p className="text-sm text-muted-foreground">The first account created becomes the admin.</p>
      {msg && <p className="text-sm text-destructive">{msg}</p>}
    </div>
  );
}

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const load = useCallback(async () => {
    const { data } = await supabase
      .from("gift_orders")
      .select("id,code,recipient,sender,reference,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setOrders((data as Order[]) ?? []);
  }, []);
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user?.id ?? "").eq("role", "admin");
      setIsAdmin(!!data?.length);
    })();
    load();
    const ch = supabase
      .channel(`orders-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "gift_orders" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);
  const setStatus = async (id: string, status: string) => {
    await supabase.from("gift_orders").update({ status }).eq("id", id);
    load();
  };
  if (isAdmin === false)
    return (
      <div className="space-y-3">
        <p>This account is not an admin.</p>
        <button className="rounded-md border border-border px-4 py-2" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    );
  const pending = orders.filter((o) => o.status === "pending").length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <a className="rounded-md bg-primary px-4 py-2 text-primary-foreground" href="/bloom.html#new" target="_blank" rel="noreferrer">
          + Create custom bouquet
        </a>
        <span className="text-sm text-muted-foreground">
          Build it, press Share, type "admin" as the reference, then confirm it here.
        </span>
        <button className="ml-auto rounded-md border border-border px-4 py-2" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <h2 className="text-xl font-semibold">Payments ({pending} waiting)</h2>
      <div className="space-y-3">
        {orders.length === 0 && <p className="text-muted-foreground">No payments yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <strong>{o.sender || "Someone"} → {o.recipient || "someone"}</strong>
              <span className="text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
              <span className="ml-auto rounded-full bg-accent px-3 py-1 text-xs capitalize">{o.status}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-md bg-muted p-2 font-mono text-sm">{o.reference}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.status !== "approved" && (
                <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => setStatus(o.id, "approved")}>Confirm payment</button>
              )}
              {o.status !== "rejected" && (
                <button className="rounded-md border border-border px-3 py-1.5 text-sm" onClick={() => setStatus(o.id, "rejected")}>Reject</button>
              )}
              {o.status === "approved" && (
                <a className="rounded-md border border-border px-3 py-1.5 text-sm" href={`/g/${o.code}`} target="_blank" rel="noreferrer">Open link /g/{o.code}</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
