import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      console.log("Received contact form data:", body);
  
      const { firstName, lastName, email, phone, inquiry, message } = body;
  
      // Validate required fields
      if (!firstName || !lastName || !email || !message || !inquiry) {
        console.log("Validation failed:", { firstName, lastName, email, message, inquiry });
        return NextResponse.json(
          { error: "All required fields must be filled." },
          { status: 400 }
        );
      }
  
      // Create the contact form submission
      console.log("Creating contact record...");
      const contact = await prisma.contact.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          inquiry: inquiry.toUpperCase(),
          message,
          status: 'PENDING'
        },
      });
      console.log("Contact record created:", contact);
  
      return NextResponse.json(
        { message: "Your contact form was successfully submitted!" },
        { status: 200 }
      );
  
    } catch (error) {
      console.error("Error handling contact form submission:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }