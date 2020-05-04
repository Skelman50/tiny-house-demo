import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-03-02",
});

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      code,
      grant_type: "authorization_code",
    });
    return response;
  },
  charge: async (amount: number, source: string, striprAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        application_fee_amount: Math.round(amount * 0.05),
      },
      { stripe_account: striprAccount }
    );
    if (res.status !== "succeded") {
      throw new Error("Failed charched to Stripe!");
    }
  },
};
