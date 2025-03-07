import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    const body = await req.text();
    const signature = headers().get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const { data, type } = event;
    if (type === "checkout.session.completed") {
      await connectMongo();
      const user = await User.findById(data.object.client_reference_id);
      user.hasAccess = true;
      user.customerId = data.object.customer;

      await user.save();
    } else if (type === "customer.subscription.deleted") {
      await connectMongo();
      const user = await User.findById({ customerId: data.object.customer });
      user.hasAcces = false;

      await user.save();
    }
  } catch (error) {
    console.error("Stripe error: " + error?.message);
  }

  return NextResponse.json({});
}
