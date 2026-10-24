//app/api/inquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";

// UUID validation regex
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Best-effort email to the listing agent. Never throws: the enquiry is already saved and
 * visible in the agent's in-app inbox, so a mail problem must not fail the visitor's request.
 * Does nothing unless SMTP is configured (EMAIL_SERVER_HOST).
 */
async function notifyListingAgent(opts: {
  ownerId: string | null;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    if (!process.env.EMAIL_SERVER_HOST || !opts.ownerId) return;
    const owner = await prisma.user.findUnique({
      where: { id: opts.ownerId },
      select: { email: true },
    });
    if (!owner?.email) return;

    const inbox = `${siteConfig.url}/agent/inquiries`;
    const text = `New enquiry about "${opts.propertyTitle}"\n\nFrom: ${opts.name} <${opts.email}>\nPhone: ${opts.phone}\n\n${opts.message}\n\nView it in your inbox: ${inbox}`;
    const html = `<p><strong>New enquiry about "${escapeHtml(opts.propertyTitle)}"</strong></p>
<p>From: ${escapeHtml(opts.name)} &lt;${escapeHtml(opts.email)}&gt;<br/>Phone: ${escapeHtml(opts.phone)}</p>
<p style="white-space:pre-wrap">${escapeHtml(opts.message)}</p>
<p><a href="${inbox}">Open your inbox</a></p>`;

    await sendEmail({
      to: owner.email,
      subject: `New enquiry: ${opts.propertyTitle}`,
      text,
      html,
      replyTo: opts.email,
    });
  } catch (err) {
    console.error("[Inquiry] Could not email listing agent:", err);
  }
}

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
      select: { id: true, title: true, listedby: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    // An agent can't send an enquiry about their own listing.
    if (session?.user?.id && property.listedby && session.user.id === property.listedby) {
      return NextResponse.json(
        { error: "You can't send an enquiry about your own listing." },
        { status: 403 }
      );
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

    await notifyListingAgent({
      ownerId: property.listedby,
      propertyTitle: property.title,
      name,
      email,
      phone,
      message,
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
