"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Content() {
  const params = useSearchParams();
  const token = params.get("token");
  const started = useRef(false);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [plan, setPlan] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: token }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || !data.success) {
          setErrorCode(data.issue ?? data.code ?? `HTTP_${r.status}`);
          throw new Error(data.code);
        }
        setPlan(data.plan);
        setState("ok");
      })
      .catch(() => setState("error"));
  }, [token]);

  if (!token) return <p>Paramètre de paiement manquant.</p>;
  if (state === "loading") return <p>Finalisation de votre paiement…</p>;
  if (state === "error")
    return (
      <div className="text-center p-10">
        <p>
          Le paiement n&apos;a pas pu être finalisé (code : {errorCode || "inconnu"}).{" "}
          <Link href="/offres" className="text-blue-500 underline">Retour aux offres</Link>
        </p>
      </div>
    );
  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold">Paiement réussi 🎉</h1>
      <p>Votre plan {plan} est maintenant actif.</p>
      <Link href="/" className="text-blue-500 underline">Continuer</Link>
    </div>
  );
}

export default function SuccesPage() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <Content />
    </Suspense>
  );
}
