import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpeningInfo, topGames } from "@/types/chess";
import React from "react";
import { Button } from "./ui/button";
import { CircleHelp, RotateCcw } from "lucide-react";
import { ShareButton } from "./ShareButton";
import { normalizeFileName } from "@/lib/utils";
import { ImportPGN } from "./ImportPGN";

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

const GameInfo = ({
  fen,
  pgn,
  openingInfo,
  onReset,
  onUndo,
}: GameInfoProps) => {
  return (
    <Card className="flex-none min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>
          {openingInfo ? (
            <div key="opening-info">
              <CircleHelp className="mb-4" />이 오프닝은{" "}
              <a
                href={`/openings/${normalizeFileName(openingInfo?.name ?? "")}`}
                className="hover:underline"
              >
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {openingInfo.name}
                </code>
              </a>{" "}
              입니다.
            </div>
          ) : (
            <div>
              <CircleHelp className="mb-4" />
              <p
                key="no-opening"
                className="text-base font-semibold text-muted-foreground"
              >
                오프닝을 찾아보세요!
              </p>
            </div>
          )}
          <div className="relative">
            <div className="apsolute inset-y-0 right-0" >
              <ShareButton fen={fen} pgn={pgn} />
              <ImportPGN />
            </div>
          </div>

          
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw />
          리셋
        </Button>
        <Button onClick={onUndo}>
          <RotateCcw />한 수 이전으로
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameInfo;
