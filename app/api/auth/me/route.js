import { NextResponse } from "next/server";

import prisma from "../../../../prisma/prismadb";

import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export const POST = async (request) => {
  try {
    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const { email } = decoded;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isAdmin: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.isActive)
      return NextResponse.json(
        { error: "User is not active" },
        { status: 403 }
      );

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
