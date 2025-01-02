"use client";

import React, { useState } from 'react';
import ChessPiece from '@/components/ChessPiece';
import { Board, Piece } from '@/types/chess';
import { Chess, Square } from 'chess.js';

const BOARD_SIZE = 8;

const fenToBoard = (fen: string): Board => {
  const chess = new Chess(fen);
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = chess.get(`${String.fromCharCode(97 + col)}${8 - row}` as Square);
      if (square) {
        const piece: Piece = {
          type: square.type as Piece['type'],
          color: square.color as Piece['color']
        };
        board[row][col] = piece;
      }
    }
  }
  return board;
};

const Chessboard: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState<Board>(fenToBoard(game.fen()));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number], to: [number, number] } | null>(null);
  const [fen, setFen] = useState<string>(game.fen());
  const [pgn, setPgn] = useState<string>(game.pgn());
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }
  
    if (selectedSquare === null) {
      setSelectedSquare([row, col]);
      const fromSquare = `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}` as Square;
      const moves = game.moves({ square: fromSquare, verbose: true }).map(move => move.to);
      setPossibleMoves(moves);
    } else {
      const [fromRow, fromCol] = selectedSquare;
      const fromSquare = `${String.fromCharCode(97 + fromCol)}${BOARD_SIZE - fromRow}` as Square;
      const toSquare = `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}` as Square;
  
      try {
        const move = game.move({
          from: fromSquare,
          to: toSquare,
        });
  
        if (move) {
          setBoard(fenToBoard(game.fen()));
          setFen(game.fen());
          setPgn(game.pgn());
          setLastMove({ from: [fromRow, fromCol], to: [row, col] });
        }
      } catch (error) {
        // 잘못된 이동은 조용히 무시
      }
  
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const renderSquare = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare?.[0] === row && selectedSquare?.[1] === col;
    const isLastMoveFrom = lastMove?.from[0] === row && lastMove?.from[1] === col;
    const isLastMoveTo = lastMove?.to[0] === row && lastMove?.to[1] === col;
    const piece = board[row][col];
    const square = `${String.fromCharCode(97 + col)}${BOARD_SIZE - row}` as Square;
    const isPossibleMove = possibleMoves.includes(square);
  
    return (
      <div 
        key={`${row}-${col}`}
        className={`aspect-square w-full h-full relative ${
          isLight ? 'bg-chess-white' : 'bg-chess-black'
        } flex items-center justify-center`}
        onClick={() => handleSquareClick(row, col)}
      >
        {(isSelected || isLastMoveFrom || isLastMoveTo) && (
          <div className="absolute inset-0 bg-yellow-300 opacity-50 z-0" />
        )}
        {isPossibleMove && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
            {piece ? (
              <div className="w-full h-full border-8 border-black opacity-10 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-black opacity-10 rounded-full" />
            )}
            </div>
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
      </div>
      <div className="game-info p-4 bg-gray-100 rounded my-4">
        <div className="mb-2">
          <span className="font-bold">FEN: </span>
          <span className="font-mono text-sm">{fen}</span>
        </div>
        <div>
          <span className="font-bold">PGN: </span>
          <span className="font-mono text-sm whitespace-pre-wrap">{pgn}</span>
        </div>
      </div>
    </div>
  );
};

export default Chessboard;
