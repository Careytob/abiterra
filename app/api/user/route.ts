import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

const createRegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(255, { message: "Name is too long." }),
  email: z.string().email({ message: "Invalid email address." }).max(255),
  phone: z.string().regex(/^[0-9\-+\s()]*$/, { message: "Invalid phone number format." }).max(20),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password is too long." })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[@$!%*?&]/, { message: "Password must include at least one special character." }),
  inquiries: z.string().min(1, { message: "Inquiry is required." }).max(500),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createRegisterSchema.safeParse(body);
  
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone
    }
  });

  return NextResponse.json(newUser, { status: 201 });
}
