import Medusa from "@medusajs/medusa-js";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY!;

const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: PUBLISHABLE_KEY,
});

export default medusaClient;
