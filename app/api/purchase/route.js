import { NextResponse } from "next/server";

import prisma from "@/prisma/prismadb";

import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { value, productId } = body;

    if (
      !value ||
      isNaN(value) ||
      !productId ||
      productId.trim() === ""
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    if (!decoded.isActive) {
      return NextResponse.json({ error: "User Banned" }, { status: 400 });
    }

    const purchase = await prisma.purchase.create({
      data: {
        value: parseFloat(value),
        product: {
          connect: {
            id: product.id,
          },
        },
        user: {
          connect: {
            id: decoded.id,
          },
        },
      },
    });

    return NextResponse.json(purchase, { status: 201 });
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

    const id = request.nextUrl.searchParams.get("id");

    if (!decoded.isActive) {
      return NextResponse.json({ error: "User Banned" }, { status: 400 });
    }

    if (id) {
      const purchase = await prisma.purchase.findUnique({
        where: {
          userId: decoded.id,
          id: id,
        },
        include: {
          product: true,
        },
      });

      if (!purchase) {
        return NextResponse.json(
          { error: "Purchase not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(purchase, { status: 200 });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
