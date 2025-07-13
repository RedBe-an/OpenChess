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
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {piece ? (
          <div className={CSS_CLASSES.CHESS_BOARD.CAPTURE_INDICATOR} />
        ) : (
          <div className={CSS_CLASSES.CHESS_BOARD.POSSIBLE_MOVE_INDICATOR} />
        )}
      </div>
    );
  };

  // 초기 게임 위치의 말들도 lazy loading으로 변경하여 preload 경고 방지
  const shouldPrioritizeImage = () => {
    // 모든 이미지를 lazy loading으로 처리하여 preload 경고 방지
    return false;
  };

  return (
    <div
      key={`${row}-${col}`}
      className={`${CSS_CLASSES.LAYOUT.SQUARE} ${getSquareBackground()} cursor-pointer hover:brightness-110 transition-all duration-150`}
      onClick={handleClick}
    >
      {shouldShowHighlight() && (
        <div
          className={`absolute inset-0 ${CSS_CLASSES.CHESS_BOARD.SELECTED} z-5`}
        />
      )}

      {renderPossibleMoveIndicator()}

      {piece && (
        <ChessPiece 
          piece={piece} 
          className="z-20 relative" 
          priority={shouldPrioritizeImage()}
        />
      )}
    </div>
  );
};

export default React.memo(ChessSquare);
