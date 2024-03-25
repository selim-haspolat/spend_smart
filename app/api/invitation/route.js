import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import prisma from "@/prisma/prismadb";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { code } = body;

    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const { isAdmin } = decoded;

    if (!isAdmin)
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 401 }
      );

    let inviteCode = code;

    if (!code) {
      inviteCode = Math.random().toString(36).substring(2, 8);
    }

    if (inviteCode.length !== 6)
      return NextResponse.json(
        { error: "Invitation code must be 6 characters long" },
        { status: 400 }
      );

    const invitation = await prisma.invitation.create({
      data: { code: inviteCode },
    });

    return NextResponse.json(invitation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const { isAdmin } = decoded;

    if (!isAdmin)
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 401 }
      );

    if (active === "true" || active === "false") {
      const invitations = await prisma.invitation.findMany({
        where: {
          isActive: active === "true",
        },
      });

      return NextResponse.json(invitations);
    }

    const invitations = await prisma.invitation.findMany();

    return NextResponse.json(invitations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
