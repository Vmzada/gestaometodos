import { MercadoPagoConfig, Payment } from "mercadopago";

export const PLAN_PRICE_BRL = 14.99;

function getClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}

export function getPaymentClient() {
  return new Payment(getClient());
}
