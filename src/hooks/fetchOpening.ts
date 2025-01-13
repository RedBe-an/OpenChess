"use server";

import prisma from "@/lib/prisma";
import { OpeningInfo } from "@/types/chess";

export const fetchOpening = async (openingInfo: OpeningInfo) => {
  try {
    const opening = await prisma.opening.findFirst({
      where: {
        name: openingInfo.name,
      },
      select: {
        name: true,
        eco: true,
        pgn: true,
      },
    });

    return opening || { notFound: true };
  } catch (error) {
    console.error("Error fetching opening:", error);
    return { notFound: true };
  }
};
