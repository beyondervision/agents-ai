// common.js — Z.A.L HUB verbindingslaag

// Puls naar Luxen (AI-resonantie)
export async function stuurPuls(bericht) {
  try {
    const response = await fetch('/api/zal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: bericht })
    });

    return await response.json();

  } catch (error) {
    console.error("Resonantie-fout:", error);
    return { text: "Gateway fout: De 35-spiegeling is niet bereikbaar." };
  }
}

// Mollie Checkout trigger
export async function activeerCheckout(amount, description) {
  try {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description })
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }

  } catch (error) {
    console.error("Fysieke flow fout:", error);
    alert("Kon geen verbinding maken met de bank-gateway.");
  }
}
