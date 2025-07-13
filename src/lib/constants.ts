import { PieceType } from "@/types/chess";

// 체스 기물 이미지 경로 매핑
export const PIECE_IMAGES: Record<PieceType, { b: string; w: string }> = {
  p: {
    // pawn
    b: "black/bp.png",
    w: "white/wp.png",
  },
  n: {
    // knight
    b: "black/bn.png",
    w: "white/wn.png",
  },
  b: {
    // bishop
    b: "black/bb.png",
    w: "white/wb.png",
  },
  r: {
    // rook
    b: "black/br.png",
    w: "white/wr.png",
  },
  q: {
    // queen
    b: "black/bq.png",
    w: "white/wq.png",
  },
  k: {
    // king
    b: "black/bk.png",
    w: "white/wk.png",
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
    LIGHT_SQUARE: "bg-chess-white",
    DARK_SQUARE: "bg-chess-black",
    SELECTED: "bg-yellow-300 opacity-50",
    POSSIBLE_MOVE_INDICATOR: "w-8 h-8 bg-black opacity-10 rounded-full",
    CAPTURE_INDICATOR:
      "w-full h-full border-8 border-black opacity-10 rounded-full",
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
