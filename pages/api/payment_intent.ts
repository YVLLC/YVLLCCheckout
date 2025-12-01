// checkout.yesviral.com project
// path: pages/api/payment_intent.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ALWAYS set CORS, no matter what
  res.setHeader("Access-Control-Allow-Origin", "https://checkout.yesviral.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const upstreamRes = await fetch("https://yesviral.com/api/payment_intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });

    const text = await upstreamRes.text();

    try {
      return res.status(upstreamRes.status).json(JSON.parse(text));
    } catch {
      return res
        .status(upstreamRes.status)
        .json({ error: "Upstream error", raw: text });
    }
  } catch (err: any) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message || "Proxy failed." });
  }
}
