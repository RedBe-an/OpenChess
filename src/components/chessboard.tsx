"use client";

import React, { useState } from 'react';
import ChessPiece from '@/components/ChessPiece';
import { Board } from '@/types/chess';

const BOARD_SIZE = 8;

const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

const Chessboard: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    setSelectedSquare([row, col]);
  };

  const renderSquare = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare?.[0] === row && selectedSquare?.[1] === col;
    const piece = board[row][col];
  
    return (
      <div 
        key={`${row}-${col}`}
        className={`aspect-square w-full h-full relative ${
          isLight ? 'bg-chess-white' : 'bg-chess-black'
        } flex items-center justify-center`}
        onClick={() => handleSquareClick(row, col)}
      >
        {isSelected && (
          <div className="absolute inset-0 bg-yellow-300 opacity-50 z-0" /> // z-10에서 z-0로 변경
        )}
        {piece && <ChessPiece piece={piece} className="z-10" />}
      </div>
    );
  };

  const renderRow = (row: number) => (
    <div key={row} className="flex w-full flex-1">
      {Array.from({ length: BOARD_SIZE }, (_, col) => renderSquare(row, col))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full max-w-[95vmin] max-h-[95vmin] rounded-lg">
      <div className="flex-1 aspect-square flex flex-col">
        {Array.from({ length: BOARD_SIZE }, (_, row) => renderRow(row))}
  
        {selectedSquare && (
          <p className="mt-4 text-xl text-center">
            위치: {String.fromCharCode(97 + selectedSquare[1])}{BOARD_SIZE - selectedSquare[0]}
          </p>
        )}
      </div>
    </div>
  );
};

export default Chessboard;