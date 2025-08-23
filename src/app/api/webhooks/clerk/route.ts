import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { deleteUser, upsertUser } from "@/features/users/db";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    switch (event.type) {
      case "user.created":
      case "user.updated":
        const clerkData = event.data;
        const email = clerkData.email_addresses.find(
          (email) => email.id === clerkData.primary_email_address_id
        )?.email_address;

        if (!email)
          return NextResponse.json(
            { error: "No primary email found" },
            { status: 404 }
          );

        await upsertUser({
          id: clerkData.id,
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          email,
          imageUrl: clerkData.image_url,
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        });
        break;
      case "user.deleted":
        if (!event.data.id)
          return NextResponse.json(
            { message: "No userId found" },
            { status: 404 }
          );

        await deleteUser(event.data.id);
        break;
    }
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Webhook processed successfully" },
    { status: 200 }
  );
}
