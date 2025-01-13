"use client";

import { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";
import { Board, OpeningInfo, topGames } from "@/types/chess";
import { fenToBoard } from "@/lib/chess";

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState<Board>(fenToBoard(game.fen()));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [lastMove, setLastMove] = useState<{
    from: [number, number];
    to: [number, number];
  } | null>(null);
  const [fen, setFen] = useState<string>(game.fen());
  const [pgn, setPgn] = useState<string>(game.pgn());
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [openingInfo, setOpeningInfo] = useState<OpeningInfo | null>(null);
  const [topGames, settopGames] = useState<topGames[]>([]);

  const fetchOpeningInfo = async (fen: string) => {
    try {
      const response = await fetch(
        `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`
      );
      const data = await response.json();

      if (data.opening) {
        setOpeningInfo({
          eco: data.opening.eco,
          name: data.opening.name,
        });
      }

      const recentGames = data.recentGames?.slice(0, 5) || [];
      settopGames(recentGames);
    } catch (error) {
      console.error("오프닝 정보를 가져오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchOpeningInfo(fen);
  }, [fen]);

  return {
    game,
    board,
    selectedSquare,
    lastMove,
    fen,
    pgn,
    possibleMoves,
    openingInfo,
    topGames,
    setGame,
    setBoard,
    setSelectedSquare,
    setLastMove,
    setFen,
    setPgn,
    setPossibleMoves,
    setOpeningInfo,
    fetchOpeningInfo,
  };
};
