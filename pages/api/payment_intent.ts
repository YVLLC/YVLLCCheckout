// checkout.yesviral.com project
// path: pages/api/payment_intent.ts

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false }, // IMPORTANT FIX
};

// Convert raw body to JSON
async function readBody(req: NextApiRequest) {
  const chunks: any[] = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS required ALWAYS
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
    // FIX: read raw body manually
    const body = await readBody(req);

    const upstreamRes = await fetch("https://yesviral.com/api/payment_intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
