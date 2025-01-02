import React from 'react';
import { Piece, PieceType } from '@/types/chess';

const pieceImages: Record<PieceType, { b: string; w: string }> = {
    p: { // pawn
        b: 'black/bp.png',
        w: 'white/wp.png'
    },
    n: { // knight
        b: 'black/bn.png',
        w: 'white/wn.png'
    },
    b: { // bishop
        b: 'black/bb.png',
        w: 'white/wb.png'
    },
    r: { // rook
        b: 'black/br.png',
        w: 'white/wr.png'
    },
    q: { // queen
        b: 'black/bq.png',
        w: 'white/wq.png'
    },
    k: { // king
        b: 'black/bk.png',
        w: 'white/wk.png'
    }
};

interface ChessPieceProps {
    piece: Piece | null;
    className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
    if (!piece) return null;

    const imagePath = `/pieces/${pieceImages[piece.type][piece.color]}`;

    return (
        <div className="absolute flex items-center justify-center h-full w-full">
            <img 
                src={imagePath}
                alt={`${piece.color} ${piece.type}`}
                className="h-full w-full object-contain"
            />
        </div>
    );
};

export default ChessPiece;