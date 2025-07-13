import { PieceType } from "@/types/chess";

// 체스 기물 이미지 경로 매핑
export const PIECE_IMAGES: Record<PieceType, { b: string; w: string }> = {
  p: {
    // pawn
    b: "black/bp.svg",
    w: "white/wp.svg",
  },
  n: {
    // knight
    b: "black/bn.svg",
    w: "white/wn.svg",
  },
  b: {
    // bishop
    b: "black/bb.svg",
    w: "white/wb.svg",
  },
  r: {
    // rook
    b: "black/br.svg",
    w: "white/wr.svg",
  },
  q: {
    // queen
    b: "black/bq.svg",
    w: "white/wq.svg",
  },
  k: {
    // king
    b: "black/bk.svg",
    w: "white/wk.svg",
  },
};

// 체스 기물 한글 이름
export const PIECE_NAMES: Record<PieceType, string> = {
  p: "폰",
  n: "나이트",
  b: "비숍",
  r: "룩",
  q: "퀸",
  k: "킹",
};

// CSS 클래스명
export const CSS_CLASSES = {
  CHESS_BOARD: {
    LIGHT_SQUARE: "chess-light-square",
    DARK_SQUARE: "chess-dark-square",
    SELECTED: "chess-selected",
    POSSIBLE_MOVE_INDICATOR: "chess-possible-move",
    CAPTURE_INDICATOR: "chess-capture-indicator",
  },
  LAYOUT: {
    BOARD_CONTAINER:
      "flex flex-row gap-4 w-full h-full max-w-[90vmin] max-h-[90vmin] rounded-lg justify-center",
    SQUARE:
      "aspect-square w-full h-full relative flex items-center justify-center",
    ROW: "flex w-full flex-1",
  },
} as const;

// 게임 설정
export const GAME_CONFIG = {
  DEFAULT_PROMOTION: "q" as const,
  MAX_TOP_GAMES: 5,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;
