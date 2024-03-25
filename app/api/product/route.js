import { NextResponse } from "next/server";

import prisma from "@/prisma/prismadb";

import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { name, value, icon, dynamic } = body;

    if (!name || name.trim() === "" || !icon || icon.trim() === "") {
      if (dynamic === false && (!value || isNaN(value)))
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    if (!decoded.isActive) {
      return NextResponse.json({ message: "User Banned" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: name,
        value: dynamic ? null : parseFloat(value),
        dynamic: dynamic,
        icon: icon,
        user: {
          connect: {
            id: decoded.id,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const id = request.nextUrl.searchParams.get("id");

    if (!decoded.isActive) {
      return NextResponse.json({ message: "User Banned" }, { status: 400 });
    }

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: id,
        },
      });

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product, { status: 200 });
    }

    const products = await prisma.product.findMany({
      where: {
        userId: decoded.id,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (request) => {
  try {
    const body = await request.json();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const id = searchParams.get("id");

    const { name, value, icon } = body;

    if (!name || !value || isNaN(value)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (!decoded || decoded.id !== product.userId) {
      return NextResponse.json({ message: "Access Denied" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        value: parseFloat(value),
        icon,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const Delete = async (request) => {
  try {
    const { id } = request.params;

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token)
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 400 }
      );

    const decoded = jwt.verify(access_token, process.env.JWT);

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (!decoded || decoded.id !== product.userId) {
      return NextResponse.json({ message: "Access Denied" }, { status: 400 });
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { message: "Product Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
