import { Piece } from '@/types/chess';
import React from 'react';

const pieceImages: { [key in Piece['type']]: { [key in Piece['color']]: string } } = {
    king: { white: '/images/white/wk.png', black: '/images/black/bk.png' },
    queen: { white: '/images/white/wq.png', black: '/images/black/bq.png' },
    rook: { white: '/images/white/wr.png', black: '/images/black/br.png' },
    bishop: { white: '/images/white/wb.png', black: '/images/black/bb.png' },
    knight: { white: '/images/white/wn.png', black: '/images/black/bn.png' },
    pawn: { white: '/images/white/wp.png', black: '/images/black/bp.png' },
};


interface ChessPieceProps {
    piece: Piece;
    className?: string;
}
  

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
    return (
        <div className="absolute flex items-center justify-center h-full w-full">
            <img src={pieceImages[piece.type][piece.color]} alt={`${piece.color} ${piece.type}`} className="h-full w-full object-contain" />
        </div>
    );
};

export default ChessPiece;
