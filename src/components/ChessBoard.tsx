"use client";

import React from 'react';
import ChessPiece from '@/components/ChessPiece';
import GameInfo from '@/components/GameInfo';
import { useChessGame } from '@/hooks/useChessGame';
import { BOARD_SIZE, fenToBoard } from '@/lib/chess';
import { Chess, Square } from 'chess.js';

const Chessboard: React.FC = () => {
  const {
    game,
    board,
    selectedSquare,
    lastMove,
    fen,
    pgn,
    possibleMoves,
    openingInfo,
    topGames,
    setBoard,
    setSelectedSquare,
    setLastMove,
    setFen,
    setPgn,
    setPossibleMoves,
    setGame,
    setOpeningInfo,
    fetchOpeningInfo,
  } = useChessGame();

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
          promotion: 'q' // always promote to a queen for example simplicity
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


  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(fenToBoard(newGame.fen()));
    setFen(newGame.fen());
    setPgn(newGame.pgn());
    setSelectedSquare(null);
    setLastMove(null);
    setPossibleMoves([]); 
    setOpeningInfo(null);
  };

  const undoMove = async () => {
    const moves = game.history();
    const newGame = new Chess();
    
    moves.slice(0, -1).forEach(move => {
      newGame.move(move);
    });
  
    setGame(newGame);
    setBoard(fenToBoard(newGame.fen()));
    setFen(newGame.fen());
    setPgn(newGame.pgn());
    setSelectedSquare(null);
    setLastMove(null);
    setPossibleMoves([]);
  
    const info = await fetchOpeningInfo(newGame.fen());
    if (info !== undefined && info !== null) {
      setOpeningInfo(info);
    }
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full max-w-[90vmin] max-h-[90vmin] rounded-lg justify-center">
      <div className="flex-1 aspect-square flex flex-col">
        {Array.from({ length: BOARD_SIZE }, (_, row) => renderRow(row))}
      </div>
      <GameInfo 
        fen={fen}
        pgn={pgn}
        openingInfo={openingInfo ?? undefined}
        topGames={topGames}
        onReset={resetGame}
        onUndo={undoMove}
        isWhiteTurn={game.turn() === 'w'}
      />
    </div>
  );
};

export default Chessboard;