import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OpeningInfo, topGames } from "@/types/chess";
import React from "react";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react"
import { ShareButton } from "./ShareButton";

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

const GameInfo = ({ fen, pgn, openingInfo, onReset, onUndo, isWhiteTurn }: GameInfoProps) => {
  return (
    <Card className="flex-none min-w-[400px] max-w-[400px]">
      <CardHeader className="">
        <CardTitle>게임 정보</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-4">
        <h3 className="font-bold mb-1">오프닝 정보</h3>
        {openingInfo && (
            <p className="break-words whitespace-pre-wrap text-sm">이름: {openingInfo.name}</p>
        )}
      </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}><RotateCcw />리셋</Button>

        <Button onClick={onUndo}><RotateCcw />한 수 이전으로</Button>

        <ShareButton fen={fen} pgn={pgn} />

      </CardFooter>
    </Card>
  );
};

export default GameInfo;