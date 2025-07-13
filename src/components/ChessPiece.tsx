"use client";

import React from "react";
import Image from "next/image";
import { Piece } from "@/types/chess";
import { PIECE_IMAGES, PIECE_NAMES } from "@/lib/constants";

interface ChessPieceProps {
  piece: Piece | null;
  className?: string;
}

/**
 * 체스 기물을 렌더링하는 컴포넌트
 */
const ChessPiece: React.FC<ChessPieceProps> = ({ piece, className = "" }) => {
  if (!piece) return null;

  const imagePath = `/pieces/${PIECE_IMAGES[piece.type][piece.color]}`;
  const altText = `${piece.color === "w" ? "백" : "흑"}${PIECE_NAMES[piece.type]}`;

  return (
    <div
      className={`absolute flex items-center justify-center h-full w-full ${className}`}
    >
      <Image
        src={imagePath}
        alt={altText}
        fill
        sizes="100%"
        className="object-contain"
        priority
      />
    </div>
  );
};

export default React.memo(ChessPiece);
