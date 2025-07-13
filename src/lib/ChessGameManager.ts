import { Chess, Square, Move } from "chess.js";
import {
  Board,
  GameState,
  ChessMove,
  BoardPosition,
  INITIAL_FEN,
} from "@/types/chess";
import {
  fenToBoard,
  coordinatesToSquare,
  getGameState,
  isInitialPosition,
} from "@/lib/chess";
import { GAME_CONFIG } from "@/lib/constants";

/**
 * 체스 게임 로직을 관리하는 클래스
 */
export class ChessGameManager {
  private game: Chess;
  private moveHistory: string[] = [];

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  /**
   * 현재 게임 인스턴스 반환
   */
  getGame(): Chess {
    return this.game;
  }

  /**
   * 현재 보드 상태 반환
   */
  getBoard(): Board {
    return fenToBoard(this.game.fen());
  }

  /**
   * 현재 게임 상태 반환
   */
  getGameState(): GameState {
    return getGameState(this.game);
  }

  /**
   * 특정 위치에서 가능한 이동 반환
   */
  getPossibleMoves(position: BoardPosition): Square[] {
    const [row, col] = position;
    const square = coordinatesToSquare(row, col);

    try {
      return this.game
        .moves({ square, verbose: true })
        .map((move: Move) => move.to);
    } catch {
      return [];
    }
  }

  /**
   * 체스 이동 실행
   */
  makeMove(from: BoardPosition, to: BoardPosition): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const fromSquare = coordinatesToSquare(fromRow, fromCol);
    const toSquare = coordinatesToSquare(toRow, toCol);

    try {
      const move = this.game.move({
        from: fromSquare,
        to: toSquare,
        promotion: GAME_CONFIG.DEFAULT_PROMOTION,
      });

      if (move) {
        this.moveHistory = this.game.history();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 마지막 이동 취소
   */
  undoLastMove(): boolean {
    try {
      const undoneMove = this.game.undo();
      if (undoneMove) {
        this.moveHistory = this.game.history();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 게임 리셋
   */
  reset(): void {
    this.game = new Chess();
    this.moveHistory = [];
  }

  /**
   * PGN에서 게임 로드
   */
  loadFromPgn(pgn: string): boolean {
    try {
      const newGame = new Chess();
      newGame.loadPgn(pgn);
      this.game = newGame;
      this.moveHistory = this.game.history();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * FEN에서 게임 로드
   */
  loadFromFen(fen: string): boolean {
    try {
      const newGame = new Chess(fen);
      this.game = newGame;
      this.moveHistory = this.game.history();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 게임이 초기 상태인지 확인
   */
  isInitialPosition(): boolean {
    return isInitialPosition(this.game.fen());
  }

  /**
   * 특정 수까지의 게임 재구성
   */
  reconstructGameToMove(moveCount: number): ChessGameManager {
    const newGame = new ChessGameManager();
    const moves = this.moveHistory.slice(0, moveCount);

    moves.forEach((move) => {
      newGame.game.move(move);
    });

    return newGame;
  }

  /**
   * 현재 게임에서 한 수씩 되돌아가면서 FEN 위치들을 생성
   * @returns FEN 위치 배열 (최신부터 과거 순서)
   */
  generateBacktrackFens(): string[] {
    const fens: string[] = [];
    const totalMoves = this.moveHistory.length;

    // 현재 위치부터 시작해서 한 수씩 되돌아가기
    for (let i = totalMoves; i >= 0; i--) {
      const tempGame = new ChessGameManager();
      const moves = this.moveHistory.slice(0, i);

      moves.forEach((move) => {
        tempGame.game.move(move);
      });

      fens.push(tempGame.game.fen());
    }

    return fens;
  }
}
