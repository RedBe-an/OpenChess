"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
const GameInfo = React.memo(
  ({ fen, pgn, openingInfo, onReset, onUndo, ImportPGN }: GameInfoProps) => {
    const [openingData, setOpeningData] = useState<{
      pgn: string;
      eco: string;
      name: string;
      urlName: string;
      mdx: string | null;
    } | null>(null);

    useEffect(() => {
      let isMounted = true;

      const loadOpening = async () => {
        if (!openingInfo) {
          setOpeningData(null);
          return;
        }

        try {
          const opening = await fetchOpening(openingInfo);
          if (isMounted) {
            setOpeningData(opening as typeof openingData);
          }
        } catch (error) {
          console.error("오프닝 정보를 불러오는데 실패했습니다:", error);
        }
      };

      loadOpening();
      return () => {
        isMounted = false;
      };
    }, [openingInfo]);

    const handleReset = React.useCallback(() => {
      onReset();
    }, [onReset]);

    const handleUndo = React.useCallback(() => {
      onUndo();
    }, [onUndo]);

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
                <div className="text-gray-400 flex flex-row space-x-2 pr-2">
                    {openingData ? (
                    <div className="flex items-center h-full">{openingData.eco}</div>
                    ) : (
                    <div className="w-8 h-7 bg-muted rounded-sm animate-pulse flex items-center justify-center" />
                    )}
                </div>
                {pgn}
              </div>
              <hr className="mt-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw />
            리셋
          </Button>
          <Button onClick={handleUndo}>
            <RotateCcw />한 수 이전으로
          </Button>
        </CardFooter>
      </Card>
    );
  },
);

GameInfo.displayName = "GameInfo";

export default GameInfo;
