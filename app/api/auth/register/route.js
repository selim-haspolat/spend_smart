import { NextResponse } from "next/server";

import prisma from "../../../../prisma/prismadb";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { email, password, name, code } = body;

    if (!email || !password || !name || !code)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 11);

    const inviteCode = await prisma.invitation.findUnique({
      where: {
        code: code,
        isActive: true,
      },
    });

    if (!inviteCode)
      return NextResponse.json(
        { message: "Invalid invitation code" },
        { status: 400 }
      );

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        invitation: {
          connect: {
            id: inviteCode.id,
          },
        },
      },
    });

    await prisma.invitation.update({
      where: {
        id: inviteCode.id,
      },
      data: {
        isActive: false,
      },
    });

    const { password: userPass, ...restUser } = user;

    const token = jwt.sign(restUser, process.env.JWT, { expiresIn: "365d" });

    const response = NextResponse.json({ user: restUser });

    response.cookies.set("access_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
