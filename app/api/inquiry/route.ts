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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to send an inquiry." },
        { status: 401 }
      );
    }

    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("Failed to parse JSON body:", e);
      return NextResponse.json(
        { error: "Invalid request format." },
        { status: 400 }
      );
    }

    console.log("Parsed request body:", body);

    const { message, phone, propertyId } = body;

    if (!phone) {
      console.log("Missing phone number");
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!message) {
      console.log("Missing message");
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!propertyId) {
      console.log("Missing propertyId");
      return NextResponse.json(
        { error: "Property ID is required." },
        { status: 400 }
      );
    }

    // Validate propertyId as a UUID
    if (!isValidUUID(propertyId)) {
      console.log("Invalid propertyId format:", propertyId);
      return NextResponse.json(
        { error: "Invalid property ID format." },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      console.log("Property not found for propertyId:", propertyId);
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 }
      );
    }

    console.log("Creating inquiry with propertyId:", propertyId);

    const inquiry = await prisma.inquiry.create({
      data: {
        phone,
        message,
        propertyid: propertyId,
        userid: session.user.id,
        status: 'PENDING',
        createdat: new Date(),
      },
    });

    console.log("Inquiry created successfully:", inquiry.id);

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