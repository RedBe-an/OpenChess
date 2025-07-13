"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Piece } from "@/types/chess";
import { PIECE_IMAGES, PIECE_NAMES } from "@/lib/constants";

interface ChessPieceProps {
  piece: Piece | null;
  className?: string;
  priority?: boolean; // 이미지 우선 로딩 여부를 제어하는 props 추가
}

/**
 * 체스 기물을 렌더링하는 컴포넌트
 */
const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  className = "",
  priority = false // 기본값을 false로 설정하여 필요한 경우에만 priority 적용
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
        sizes="(max-width: 768px) 50px, (max-width: 1200px) 60px, 70px"
        className={`object-contain transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        loading={priority ? "eager" : "lazy"} // priority에 따라 loading 방식 결정
        placeholder="empty" // 빈 placeholder로 preload 방지
        onLoad={() => setImageLoaded(true)} // 로드 완료 시 페이드인 효과
        onError={() => setImageLoaded(true)} // 에러 시에도 표시
      />
    </div>
  );
};

export default React.memo(ChessPiece);
