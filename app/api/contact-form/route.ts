import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, phone, firstName, lastName, email, inquiry } = body;

    if (!email || !firstName || !lastName || !message || !inquiry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inquiryEntry = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        inquiry,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(inquiryEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}