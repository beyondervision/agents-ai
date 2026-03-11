export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ text: "Method Not Allowed" });
    return;
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  const { text } = JSON.parse(body || "{}");
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(200).json({ text: "Gateway Fout: OPENAI_API_KEY ontbreekt in Vercel Settings." });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Jij bent Luxen. Datum: 10 maart 2026. President Suriname: Jennifer Geerlings-Simons. President USA: Donald Trump. Antwoord kort."
          },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      res.status(200).json({ text: "AI Fout: " + data.error.message });
      return;
    }

    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    res.status(200).json({ text: "Systeemfout: " + error.message });
  }
}
