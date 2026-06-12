import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";

// Create lazy loaded Stripe instance to avoid starting crashes
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripe = new Stripe(key);
    }
  }
  return stripe;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Stripe checkout session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { items, successUrl, cancelUrl } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Nenhum item de pagamento foi fornecido." });
      }

      const stripeClient = getStripe();
      
      // If Stripe client is not configured, fall back to simulated checkout experience
      if (!stripeClient) {
        console.warn("STRIPE_SECRET_KEY não configurada. Ativando Checkout Simulado para visualização rápida!");
        
        const totalAmount = items.reduce((acc, curr) => acc + (Number(curr.price) || 0) * (Number(curr.quantity) || 1), 0);
        const encodedItems = encodeURIComponent(JSON.stringify(items));
        
        // Mock success URL with feedback indicators
        const mockUrl = `${req.headers.origin || 'http://localhost:3000'}/#/obrigado?payment_simulated=true&amount=${totalAmount}&items=${encodedItems}`;
        
        return res.json({ url: mockUrl, isMock: true });
      }

      // Convert customized client items into structured Stripe line items
      const lineItems = items.map((item: any) => {
        const name = item.name || "Serviço AutoLeads";
        const description = item.description || "Marketing e Estratégia Digital para Revendas de Carros";
        const unitAmountInt = Math.round((Number(item.price) || 2500) * 100); // Stripe expects payment in cents (e.g. 2500.00 BRL is 250000 cents)
        
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: name,
              description: description,
            },
            unit_amount: unitAmountInt,
          },
          quantity: Number(item.quantity) || 1,
        };
      });

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl || `${req.headers.origin}/obrigado?stripe_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.origin}/`,
      });

      res.json({ url: session.url, isMock: false });
    } catch (error: any) {
      console.error("Erro ao criar sessão de checkout Stripe:", error);
      res.status(500).json({ error: error.message || "Erro no servidor ao configurar o pagamento." });
    }
  });

  // Client configuration context API
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "alive", 
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY 
    });
  });

  // Vite middleware for dev mode, static serve for production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
