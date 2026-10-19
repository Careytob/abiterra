//app/api/inquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// UUID validation regex
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

export async function POST(request: NextRequest) {
  try {
    // Signing in is optional. If the sender is logged in we trust the
    // session for who they are; otherwise we require them to tell us.
    const session = await getServerSession(authOptions);

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
    }

    const { message, phone, propertyId } = body;
    const name = session?.user?.name || body.name;
    const email = session?.user?.email || body.email;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required." }, { status: 400 });
    }
    if (!isValidUUID(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID format." }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyid: propertyId,
        userid: session?.user?.id ?? null,
        status: "PENDING",
        createdat: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Your inquiry was successfully sent!", inquiryId: inquiry.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling inquiry submission:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving your inquiry." },
      { status: 500 }
    );
  }
}
