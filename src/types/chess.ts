// 체스 기물 타입 정의
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

// 체스 기물 색상 타입
export type PieceColor = "b" | "w";

// 체스 기물 인터페이스
export interface Piece {
  type: PieceType;
  color: PieceColor;
}

// 체스 보드 타입 (8x8 배열)
export type Board = (Piece | null)[][];

// 체스 오프닝 정보 인터페이스
export interface OpeningInfo {
  eco?: string;
  name?: string;
  urlName?: string;
  pgn?: string;
  mdx?: string;
}

// 플레이어 정보 인터페이스
export interface Player {
  name: string;
  rating: number;
}

// 게임 결과 타입
export type GameResult = "white" | "black" | "draw";

// 상위 게임 정보 인터페이스
export interface TopGame {
  uci: string;
  id: string;
  white: Player;
  black: Player;
  winner?: GameResult;
  year: number;
  month: string;
}

// 체스 이동 정보 인터페이스
export interface ChessMove {
  from: [number, number];
  to: [number, number];
}

// 게임 상태 인터페이스
export interface GameState {
  fen: string;
  pgn: string;
  turn: PieceColor;
  isGameOver: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

// 보드 좌표 타입
export type BoardPosition = [number, number];

// API 응답 타입들
export interface LichessOpeningResponse {
  opening?: {
    eco: string;
    name: string;
  };
  recentGames?: TopGame[];
}

// 상수
export const BOARD_SIZE = 8;
export const INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
