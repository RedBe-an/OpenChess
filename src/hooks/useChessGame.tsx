"use client";

import { useState, useEffect, useCallback } from "react";
import type { Square } from "chess.js";
import type {
  Board,
  OpeningInfo,
  TopGame,
  ChessMove,
  BoardPosition,
  GameState,
} from "@/types/chess";
import { ChessGameManager } from "@/lib/ChessGameManager";
import { fetchOpeningFromLichess, findLastKnownOpening } from "@/lib/api";

interface UseChessGameReturn {
  // 게임 상태
  gameManager: ChessGameManager;
  board: Board;
  gameState: GameState;

  // UI 상태
  selectedSquare: BoardPosition | null;
  lastMove: ChessMove | null;
  possibleMoves: Square[];

  // 오프닝 정보
  openingInfo: OpeningInfo | null;
  topGames: TopGame[];
  isLastKnownOpening: boolean;

  // 액션들
  selectSquare: (position: BoardPosition) => void;
  makeMove: (from: BoardPosition, to: BoardPosition) => boolean;
  resetGame: () => void;
  undoMove: () => void;
  loadFromPgn: (pgn: string) => boolean;
  clearSelection: () => void;
}

export const useChessGame = (): UseChessGameReturn => {
  // 게임 매니저 초기화
  const [gameManager] = useState(() => new ChessGameManager());

  // 게임 상태
  const [board, setBoard] = useState<Board>(gameManager.getBoard());
  const [gameState, setGameState] = useState<GameState>(
    gameManager.getGameState(),
  );

  // UI 상태
  const [selectedSquare, setSelectedSquare] = useState<BoardPosition | null>(
    null,
  );
  const [lastMove, setLastMove] = useState<ChessMove | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  // 오프닝 정보
  const [openingInfo, setOpeningInfo] = useState<OpeningInfo | null>(null);
  const [topGames, setTopGames] = useState<TopGame[]>([]);
  const [isLastKnownOpening, setIsLastKnownOpening] = useState<boolean>(false);

  /**
   * 게임 상태를 업데이트하는 헬퍼 함수
   */
  const updateGameState = useCallback(() => {
    setBoard(gameManager.getBoard());
    setGameState(gameManager.getGameState());
  }, [gameManager]);

  /**
   * 오프닝 정보를 가져오는 함수
   */
  const fetchOpeningInfo = useCallback(async (fen: string) => {
    try {
      const { opening, topGames: games } = await fetchOpeningFromLichess(fen);
      setOpeningInfo(opening);
      setTopGames(games);
      setIsLastKnownOpening(false);
    } catch (error) {
      console.error("오프닝 정보를 가져오는데 실패했습니다:", error);
      setOpeningInfo(null);
      setTopGames([]);
      setIsLastKnownOpening(false);
    }
  }, []);

  /**
   * 선택 상태를 클리어하는 함수
   */
  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, []);

  /**
   * 사각형을 선택하는 함수
   */
  const selectSquare = useCallback(
    (position: BoardPosition) => {
      setSelectedSquare(position);
      const moves = gameManager.getPossibleMoves(position);
      setPossibleMoves(moves);
    },
    [gameManager],
  );

  /**
   * 체스 이동을 실행하는 함수
   */
  const makeMove = useCallback(
    (from: BoardPosition, to: BoardPosition): boolean => {
      const success = gameManager.makeMove(from, to);

      if (success) {
        updateGameState();
        setLastMove({ from, to });
        clearSelection();
        return true;
      }

      return false;
    },
    [gameManager, updateGameState, clearSelection],
  );

  /**
   * 게임을 리셋하는 함수
   */
  const resetGame = useCallback(() => {
    gameManager.reset();
    updateGameState();
    setLastMove(null);
    clearSelection();
    setOpeningInfo(null);
    setTopGames([]);
    setIsLastKnownOpening(false);
  }, [gameManager, updateGameState, clearSelection]);

  /**
   * 마지막 이동을 취소하는 함수
   */
  const undoMove = useCallback(() => {
    const success = gameManager.undoLastMove();

    if (success) {
      updateGameState();
      setLastMove(null);
      clearSelection();

      // 초기 위치라면 오프닝 정보 리셋
      if (gameManager.isInitialPosition()) {
        setOpeningInfo(null);
        setTopGames([]);
        setIsLastKnownOpening(false);
      }
    }
  }, [gameManager, updateGameState, clearSelection]);

  /**
   * PGN에서 게임을 로드하는 함수
   */
  const loadFromPgn = useCallback(
    (pgn: string): boolean => {
      const success = gameManager.loadFromPgn(pgn);

      if (success) {
        updateGameState();
        clearSelection();
        setLastMove(null);
        
        // PGN 로드 후 오프닝 정보 가져오기
        const currentFen = gameManager.getGameState().fen;
        if (currentFen && !gameManager.isInitialPosition()) {
          // 먼저 현재 위치에서 오프닝 정보 확인
          fetchOpeningFromLichess(currentFen).then(({ opening, topGames }) => {
            if (opening) {
              // 현재 위치에서 오프닝이 발견된 경우
              setOpeningInfo(opening);
              setTopGames(topGames);
              setIsLastKnownOpening(false);
            } else {
              // 현재 위치에서 오프닝이 없는 경우, 마지막 알려진 오프닝 찾기
              const backtrackFens = gameManager.generateBacktrackFens();
              findLastKnownOpening(backtrackFens).then(({ opening: lastOpening, topGames: lastTopGames }) => {
                if (lastOpening) {
                  // 마지막 알려진 오프닝을 openingInfo에 설정하고 플래그로 구분
                  setOpeningInfo(lastOpening);
                  setTopGames(lastTopGames);
                  setIsLastKnownOpening(true);
                } else {
                  setOpeningInfo(null);
                  setTopGames([]);
                  setIsLastKnownOpening(false);
                }
              }).catch(error => {
                console.error("마지막 오프닝 찾기 실패:", error);
                setOpeningInfo(null);
                setTopGames([]);
                setIsLastKnownOpening(false);
              });
            }
          }).catch(error => {
            console.error("오프닝 정보 가져오기 실패:", error);
            setOpeningInfo(null);
            setTopGames([]);
            setIsLastKnownOpening(false);
          });
        } else {
          // 초기 위치라면 오프닝 정보 리셋
          setOpeningInfo(null);
          setTopGames([]);
          setIsLastKnownOpening(false);
        }
        
        return true;
      }

      return false;
    },
    [gameManager, updateGameState, clearSelection],
  );

  // FEN이 변경될 때마다 오프닝 정보 가져오기
  useEffect(() => {
    const fen = gameState.fen;
    if (fen && !gameManager.isInitialPosition()) {
      fetchOpeningInfo(fen);
    }
  }, [gameState.fen, fetchOpeningInfo, gameManager]);

  return {
    gameManager,
    board,
    gameState,
    selectedSquare,
    lastMove,
    possibleMoves,
    openingInfo,
    topGames,
    isLastKnownOpening,
    selectSquare,
    makeMove,
    resetGame,
    undoMove,
    loadFromPgn,
    clearSelection,
  };
};
