import { createMollieClient } from '@mollie/api-client';

export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Body uitlezen (Vercel Node runtime geeft geen req.body)
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
  }

  let data = {};
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    res.status(400).json({ error: "Ongeldige JSON payload" });
    return;
  }

  const { amount, description, redirectUrl } = data;

  // Mollie client initialiseren
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "MOLLIE_API_KEY ontbreekt in Vercel Settings." });
    return;
  }

  const mollie = createMollieClient({ apiKey });

  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: String(amount || "0.00")
      },
      description: description || "Z.A.L HUB Resonantie Bijdrage",
      redirectUrl: redirectUrl || `https://${req.headers.host}/bedankt.html`
    });

    res.status(200).json({
      checkoutUrl: payment.getCheckoutUrl()
    });

  } catch (error) {
    console.error("Mollie Error:", error);
    res.status(500).json({
      error: "Mollie API fout",
      message: error.message
    });
  }
}
