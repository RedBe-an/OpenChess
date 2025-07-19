"use client";

import React, { useCallback } from "react";
import { useChessGame } from "@/hooks/useChessGame";
import { type BoardPosition, BOARD_SIZE } from "@/types/chess";
import { coordinatesToSquare } from "@/lib/chess";
import { CSS_CLASSES } from "@/lib/constants";
import ChessSquare from "./ChessSquare";
import GameInfo from "./GameInfo";
import PgnImportDialog from "./PgnImportDialog";

/**
 * 메인 체스보드 컴포넌트
 */
const Chessboard: React.FC = () => {
  const {
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
  } = useChessGame();

  /**
   * 사각형 클릭 처리
   */
  const handleSquareClick = useCallback(
    (position: BoardPosition) => {
      const [row, col] = position;

      // 같은 사각형을 다시 클릭한 경우 선택 해제
      if (
        selectedSquare &&
        selectedSquare[0] === row &&
        selectedSquare[1] === col
      ) {
        clearSelection();
        return;
      }

      // 아무것도 선택되지 않은 상태에서 클릭
      if (selectedSquare === null) {
        selectSquare(position);
        return;
      }

      // 이동 시도
      const moveSuccess = makeMove(selectedSquare, position);

      // 이동이 실패한 경우, 다른 기물 선택
      if (!moveSuccess) {
        selectSquare(position);
      }
    },
    [selectedSquare, selectSquare, makeMove, clearSelection],
  );

  /**
   * 개별 사각형 렌더링
   */
  const renderSquare = useCallback(
    (row: number, col: number) => {
      const position: BoardPosition = [row, col];
      const isLight = (row + col) % 2 === 0;
      const isSelected =
        selectedSquare?.[0] === row && selectedSquare?.[1] === col;
      const isLastMoveFrom =
        lastMove?.from[0] === row && lastMove?.from[1] === col;
      const isLastMoveTo = lastMove?.to[0] === row && lastMove?.to[1] === col;
      const piece = board[row][col];
      const square = coordinatesToSquare(row, col);
      const isPossibleMove = possibleMoves.includes(square);

      return (
        <ChessSquare
          key={`${row}-${col}`}
          position={position}
          piece={piece}
          isLight={isLight}
          isSelected={isSelected}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
          isPossibleMove={isPossibleMove}
          onClick={handleSquareClick}
        />
      );
    },
    [board, selectedSquare, lastMove, possibleMoves, handleSquareClick],
  );

  /**
   * 보드 행 렌더링
   */
  const renderRow = useCallback(
    (row: number) => (
      <div key={row} className={CSS_CLASSES.LAYOUT.ROW}>
        {Array.from({ length: BOARD_SIZE }, (_, col) => renderSquare(row, col))}
      </div>
    ),
    [renderSquare],
  );

  return (
    <div className={CSS_CLASSES.LAYOUT.BOARD_CONTAINER}>
      {/* 체스보드 */}
      <div className="flex-1 aspect-square flex flex-col">
        {Array.from({ length: BOARD_SIZE }, (_, row) => renderRow(row))}
      </div>

      {/* 게임 정보 패널 */}
      <GameInfo
        fen={gameState.fen}
        pgn={gameState.pgn}
        openingInfo={openingInfo ?? undefined}
        topGames={topGames}
        onReset={resetGame}
        onUndo={undoMove}
        isWhiteTurn={gameState.turn === "w"}
        isLastKnownOpening={isLastKnownOpening}
        ImportPGN={() => <PgnImportDialog onImport={loadFromPgn} />}
      />
    </div>
  );
};

export default Chessboard;
