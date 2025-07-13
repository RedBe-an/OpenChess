import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

/**
 * Prisma 클라이언트 인스턴스를 생성하거나 기존 인스턴스를 반환합니다.
 * 개발 환경에서는 핫 리로드로 인한 다중 인스턴스 생성을 방지합니다.
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends(withAccelerate());
};

const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

export default prisma;
