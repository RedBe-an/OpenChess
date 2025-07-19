"use server";

import prisma from "@/lib/prisma";
import { type OpeningInfo } from "@/types/chess";
import { modelCacheStrategies } from "@/lib/cache";

interface FetchOpeningResult extends OpeningInfo {
  notFound?: boolean;
}

/**
 * 데이터베이스에서 오프닝 정보를 가져옵니다
 * @param openingInfo - 조회할 오프닝 정보
 * @returns 오프닝 정보 또는 notFound 플래그
 */
export const fetchOpening = async (
  openingInfo: OpeningInfo,
): Promise<FetchOpeningResult> => {
  // 입력 검증
  if (!openingInfo?.name?.trim()) {
    console.warn("fetchOpening: 유효하지 않은 오프닝 이름");
    return { notFound: true };
  }

  try {
    const opening = await prisma.opening.findFirst({
      where: {
        name: {
          equals: openingInfo.name.trim(),
          mode: "insensitive", // 대소문자 구분 없이 검색
        },
      },
      select: {
        name: true,
        eco: true,
        pgn: true,
        urlName: true,
        mdx: true,
      },
      cacheStrategy: modelCacheStrategies.opening.detail,
    });

    if (!opening) {
      return { notFound: true };
    }

    return {
      name: opening.name,
      eco: opening.eco,
      pgn: opening.pgn,
      urlName: opening.urlName,
      mdx: opening.mdx || undefined,
    };
  } catch (error) {
    console.error("오프닝 정보를 가져오는데 실패했습니다:", error);
    return { notFound: true };
  }
};

/**
 * ECO 코드로 오프닝을 검색합니다
 * @param eco - ECO 코드
 * @returns 오프닝 정보 또는 notFound 플래그
 */
export const fetchOpeningByEco = async (
  eco: string,
): Promise<FetchOpeningResult> => {
  if (!eco?.trim()) {
    console.warn("fetchOpeningByEco: 유효하지 않은 ECO 코드");
    return { notFound: true };
  }

  try {
    const opening = await prisma.opening.findFirst({
      where: {
        eco: {
          equals: eco.trim().toUpperCase(),
        },
      },
      select: {
        name: true,
        eco: true,
        pgn: true,
        urlName: true,
        mdx: true,
      },
      cacheStrategy: modelCacheStrategies.opening.detail,
    });

    if (!opening) {
      return { notFound: true };
    }

    return {
      name: opening.name,
      eco: opening.eco,
      pgn: opening.pgn,
      urlName: opening.urlName,
      mdx: opening.mdx || undefined,
    };
  } catch (error) {
    console.error("ECO 코드로 오프닝 정보를 가져오는데 실패했습니다:", error);
    return { notFound: true };
  }
};
