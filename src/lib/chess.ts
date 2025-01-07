import { Chess, Square } from "chess.js";
import { Board, Piece } from "@/types/chess";

export const BOARD_SIZE = 8;

export const fenToBoard = (fen: string): Board => {
  const chess = new Chess(fen);
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = chess.get(
        `${String.fromCharCode(97 + col)}${8 - row}` as Square,
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
