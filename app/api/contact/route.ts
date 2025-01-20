import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Changed to import the default export
import { contact_inquiry } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received contact form data:", body);

    const { firstName, lastName, email, phone, inquiry, message } = body;

    console.log("Creating contact record...");
    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || '',
        inquiry: inquiry as contact_inquiry,
        message,
      },
    });

    console.log("Contact record created:", contact);

    return NextResponse.json(
      { message: "Your message was successfully sent!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error handling contact form submission:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving your message." },
      { status: 500 }
    );
  }
}