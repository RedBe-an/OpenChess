import { Chess, type Square } from "chess.js";
import {
  type Board,
  type Piece,
  BOARD_SIZE,
  INITIAL_FEN,
  type BoardPosition,
  type GameState,
} from "@/types/chess";

/**
 * FEN 문자열을 보드 배열로 변환
 * @param fen - FEN 형식의 게임 상태 문자열
 * @returns 2차원 배열 형태의 보드
 */
export const fenToBoard = (fen: string): Board => {
  const chess = new Chess(fen);
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const square = chess.get(
        `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}` as Square,
      );
      if (square) {
        const piece: Piece = {
          type: square.type as Piece["type"],
          color: square.color as Piece["color"],
        };
        board[row][col] = piece;
      }
    }
  }
  return board;
};

/**
 * 보드 좌표를 체스 표기법으로 변환
 * @param row - 행 인덱스 (0-7)
 * @param col - 열 인덱스 (0-7)
 * @returns 체스 표기법 좌표 (예: "e4")
 */
export const coordinatesToSquare = (row: number, col: number): Square => {
  return `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}` as Square;
};

/**
 * 체스 표기법을 보드 좌표로 변환
 * @param square - 체스 표기법 좌표 (예: "e4")
 * @returns 보드 좌표 [row, col]
 */
export const squareToCoordinates = (square: Square): BoardPosition => {
  const col = square.charCodeAt(0) - 97;
  const row = BOARD_SIZE - parseInt(square[1]);
  return [row, col];
};

/**
 * Chess.js 인스턴스에서 게임 상태 추출
 * @param game - Chess.js 게임 인스턴스
 * @returns 게임 상태 객체
 */
export const getGameState = (game: Chess): GameState => {
  return {
    fen: game.fen(),
    pgn: game.pgn(),
    turn: game.turn() as GameState["turn"],
    isGameOver: game.isGameOver(),
    isCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
  };
};

/**
 * 새로운 체스 게임 인스턴스 생성
 * @returns 초기 상태의 Chess.js 인스턴스
 */
export const createNewGame = (): Chess => {
  return new Chess();
};

/**
 * 게임이 초기 상태인지 확인
 * @param fen - 확인할 FEN 문자열
 * @returns 초기 상태 여부
 */
export const isInitialPosition = (fen: string): boolean => {
  return fen === INITIAL_FEN;
};
