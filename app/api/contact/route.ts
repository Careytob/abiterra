import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct path to your nextauth configuration
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received data:", body);

    const { name, email, phone, message, propertyId } = body;

    // Validate required fields
    if (!name || !email || !phone || !message || !propertyId === undefined) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Get the session using getServerSession
    const session = await getServerSession(authOptions);
    
    // Modify this section to handle unauthenticated users
    if (!session?.user?.email) {
      // Create a new user or get existing user
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name,
          phone: phone || '',
        },
      });

     // Create the inquiry with the user's ID
     const inquiry = await prisma.inquiry.create({
      data: {
        userId: user.id,
        propertyId: Number(propertyId),
        message,
      },
    });

    return NextResponse.json(
      { message: "Your message was successfully sent!" },
      { status: 200 }
    );
  }

  // If user is authenticated, proceed with existing logic
  const userId = session.user.id;

  // Create the inquiry
  const inquiry = await prisma.inquiry.create({
    data: {
      userId,
      propertyId: Number(propertyId),
      message,
    },
  });

  return NextResponse.json(
    { message: "Your message was successfully sent!" },
    { status: 200 }
  );
} catch (error) {
  console.error("Error handling POST request:", error);
  return NextResponse.json(
    { error: "An unexpected error occurred." },
    { status: 500 }
  );
}
}