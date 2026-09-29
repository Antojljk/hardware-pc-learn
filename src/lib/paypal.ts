const BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export const PLANS = {
  ESSENTIEL: { price: "7.99", label: "Plan Essentiel" },
  PRO: { price: "14.99", label: "Plan Pro" },
  ULTIMATE: { price: "24.99", label: "Plan Ultimate" },
} as const;

export type PaidPlan = keyof typeof PLANS;

export function isPaidPlan(p: unknown): p is PaidPlan {
  return typeof p === "string" && p in PLANS;
}

export async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal token: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

export const paypalBase = BASE;
