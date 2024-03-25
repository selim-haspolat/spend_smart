import { NextResponse } from "next/server";

import prisma from "../../../../prisma/prismadb";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );

    if (!user.isActive)
      return NextResponse.json({ message: "User Banned" }, { status: 403 });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );

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
