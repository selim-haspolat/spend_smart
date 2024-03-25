import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
