"use client";

import React from "react";
import { Square } from "chess.js";
import { Piece, BoardPosition } from "@/types/chess";
import { CSS_CLASSES } from "@/lib/constants";
import ChessPiece from "./ChessPiece";

interface ChessSquareProps {
  position: BoardPosition;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  isPossibleMove: boolean;
  onClick: (position: BoardPosition) => void;
}

/**
 * 체스 보드의 개별 사각형을 렌더링하는 컴포넌트
 */
const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isLastMoveFrom,
  isLastMoveTo,
  isPossibleMove,
  onClick,
}) => {
  const [row, col] = position;

  const handleClick = () => {
    onClick(position);
  };

  const getSquareBackground = () => {
    return isLight
      ? CSS_CLASSES.CHESS_BOARD.LIGHT_SQUARE
      : CSS_CLASSES.CHESS_BOARD.DARK_SQUARE;
  };

  const shouldShowHighlight = () => {
    return isSelected || isLastMoveFrom || isLastMoveTo;
  };

  const renderPossibleMoveIndicator = () => {
    if (!isPossibleMove) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center z-0">
        {piece ? (
          <div className={CSS_CLASSES.CHESS_BOARD.CAPTURE_INDICATOR} />
        ) : (
          <div className={CSS_CLASSES.CHESS_BOARD.POSSIBLE_MOVE_INDICATOR} />
        )}
      </div>
    );
  };

  return (
    <div
      key={`${row}-${col}`}
      className={`${CSS_CLASSES.LAYOUT.SQUARE} ${getSquareBackground()}`}
      onClick={handleClick}
    >
      {shouldShowHighlight() && (
        <div
          className={`absolute inset-0 ${CSS_CLASSES.CHESS_BOARD.SELECTED} z-0`}
        />
      )}

      {renderPossibleMoveIndicator()}

      {piece && <ChessPiece piece={piece} className="z-10" />}
    </div>
  );
};

export default React.memo(ChessSquare);
