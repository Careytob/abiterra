import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to send an inquiry." },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Incoming request body:", body); // ✅ Debugging log

    const { message, phone, propertyId } = body;

    // Validate required fields
    if (!phone || !message || !propertyId) {
      return NextResponse.json(
        { error: "All fields (phone, message, propertyId) are required." },
        { status: 400 }
      );
    }

    // Ensure `propertyId` is a valid number
    const propertyIdNumber = Number(propertyId);
    if (isNaN(propertyIdNumber)) {
      return NextResponse.json(
        { error: "Invalid property ID." },
        { status: 400 }
      );
    }

    // Create the inquiry in the database
    const inquiry = await prisma.inquiry.create({
      data: {
        phone, 
        message, 
        propertyId: propertyIdNumber,
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: "Your inquiry was successfully sent!" },
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
