"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpeningInfo, topGames } from "@/types/chess";
import React, { JSX, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CircleHelp, RotateCcw } from "lucide-react";
import { ShareButton } from "./ShareButton";
import { normalizeFileName } from "@/lib/utils";
import { fetchOpening } from "@/hooks/fetchOpening";

interface GameInfoProps {
  fen: string;
  pgn: string;
  openingInfo?: OpeningInfo;
  topGames: topGames[];
  onReset: () => void;
  onUndo: () => void;
  ImportPGN: () => JSX.Element;
  isWhiteTurn: boolean;
  capturedPieces?: {
    white: string[];
    black: string[];
  };
}

/**
 * GameInfo component displays the current game information, including
 * the opening details and buttons for resetting and undoing moves.
 */
const GameInfo = ({
  fen,
  pgn,
  openingInfo,
  onReset,
  onUndo,
  ImportPGN,
}: GameInfoProps) => {
  const [openingData, setOpeningData] = useState<{
    pgn: string;
    eco: string;
    name: string;
    urlName: string;
    mdx: string | null;
  } | null>(null);

  useEffect(() => {
    if (openingInfo) {
      fetchOpening(openingInfo).then((opening) =>
        setOpeningData(opening as typeof openingData),
      );
    } else {
      setOpeningData(null);
    }
  }, [openingInfo]);

  return (
    <Card className="flex-none min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>
          <div className="relative">
            <CircleHelp className="mb-4" />
            <div className="absolute inset-y-0 right-0 flex space-x-2">
              <ShareButton fen={fen} pgn={pgn} />
              <ImportPGN />
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {openingInfo ? (
            <div
              key="opening-info"
              className="text-base font-semibold text-foreground"
            >
              이 오프닝은{" "}
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
              <p
                key="no-opening"
                className="text-base font-semibold text-muted-foreground"
              >
                오프닝을 찾아보세요!
              </p>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {openingInfo && (
          <div>
            <hr />
            <div className="leading-7 [&:not(:first-child)]:mt-2 flex flex-row space-x-2">
              {openingData && (
                <div className="text-gray-400 flex flex-row space-x-2 pr-2">
                  {openingData.eco}
                </div>
              )}
              {pgn}
            </div>
            <hr className="mt-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
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
