import type { OpeningInfo, TopGame, LichessOpeningResponse } from "@/types/chess";

/**
 * Lichess 마스터 데이터베이스에서 오프닝 정보를 가져옵니다
 * @param fen - 조회할 FEN 문자열
 * @returns 오프닝 정보와 최근 게임 목록
 */
export const fetchOpeningFromLichess = async (
  fen: string,
): Promise<{ opening: OpeningInfo | null; topGames: TopGame[] }> => {
  try {
    const response = await fetch(
      `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LichessOpeningResponse = await response.json();

    const opening = data.opening
      ? {
          eco: data.opening.eco,
          name: data.opening.name,
        }
      : null;

    const topGames = data.recentGames?.slice(0, 5) || [];

    return { opening, topGames };
  } catch (error) {
    console.error("오프닝 정보를 가져오는데 실패했습니다:", error);
    return { opening: null, topGames: [] };
  }
};

/**
 * 네트워크 요청 재시도 유틸리티
 * @param fn - 실행할 함수
 * @param retries - 재시도 횟수
 * @param delay - 재시도 간격 (ms)
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryAsync(fn, retries - 1, delay);
    }
    throw error;
  }
};

/**
 * FEN 위치 배열에서 마지막 알려진 오프닝을 찾습니다
 * @param fens - 확인할 FEN 위치 배열 (최신부터 과거 순서)
 * @returns 마지막 알려진 오프닝 정보
 */
export const findLastKnownOpening = async (
  fens: string[],
): Promise<{ opening: OpeningInfo | null; topGames: TopGame[] }> => {
  for (const fen of fens) {
    try {
      const { opening, topGames } = await fetchOpeningFromLichess(fen);
      if (opening) {
        return { opening, topGames };
      }
    } catch (error) {
      console.error(`FEN ${fen}에서 오프닝 조회 실패:`, error);
      continue;
    }
  }

  return { opening: null, topGames: [] };
};
