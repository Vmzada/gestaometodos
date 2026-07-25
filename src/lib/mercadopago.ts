import { MercadoPagoConfig, PreApproval } from "mercadopago";

export const PLAN_PRICE_BRL = 14.99;

function getClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}

export function getPreApprovalClient() {
  return new PreApproval(getClient());
}
