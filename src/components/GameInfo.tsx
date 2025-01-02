import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OpeningInfo, topGames } from "@/types/chess";
import React from "react";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react"

interface GameInfoProps {
  fen: string;
  pgn: string;
  openingInfo?: OpeningInfo;
  topGames: topGames[];
  onReset: () => void;
  onUndo: () => void;
  isWhiteTurn: boolean;
  capturedPieces?: {
    white: string[];
    black: string[];
  };
}

const GameInfo = ({ fen, pgn, openingInfo, topGames, onReset, onUndo, isWhiteTurn, capturedPieces }: GameInfoProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>게임 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
      <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">현재 차례</h3>
        <p className="text-sm md:text-base">
          {isWhiteTurn ? '백' : '흑'}의 차례입니다
        </p>
      </div>

      {capturedPieces && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">잡은 말</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">흑이 잡은 말</h4>
              <div className="flex flex-wrap gap-1">
                {capturedPieces.white.map((piece, i) => (
                  <span key={i} className="text-xs md:text-sm">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">백이 잡은 말</h4> 
              <div className="flex flex-wrap gap-1">
                {capturedPieces.black.map((piece, i) => (
                  <span key={i} className="text-xs md:text-sm">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
        <div>
          <span className="font-bold">FEN: </span>
          <span className="font-mono text-sm">{fen}</span>
        </div>
        <div>
          <span className="font-bold">PGN: </span>
          <span className="font-mono text-sm">{pgn}</span>
        </div>
        
        {openingInfo && (
          <div>
            <h3 className="font-bold mb-1">오프닝 정보</h3>
            <p>이름: {openingInfo.name}</p>
          </div>
        )}
      </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}><RotateCcw />리셋</Button>
        <Button onClick={onUndo}><RotateCcw />한 수 이전으로</Button>
      </CardFooter>
    </Card>
  );
};

export default GameInfo;