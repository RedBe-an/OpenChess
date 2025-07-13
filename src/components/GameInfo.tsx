"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpeningInfo, TopGame } from "@/types/chess";
import { Button } from "./ui/button";
import { CircleHelp, RotateCcw } from "lucide-react";
import { ShareButton } from "./ShareButton";
import { normalizeFileName } from "@/lib/utils";
import { fetchOpening } from "@/hooks/fetchOpening";

interface GameInfoProps {
  fen: string;
  pgn: string;
  openingInfo?: OpeningInfo;
  topGames: TopGame[];
  onReset: () => void;
  onUndo: () => void;
  ImportPGN: () => React.ReactElement;
  isWhiteTurn: boolean;
  capturedPieces?: {
    white: string[];
    black: string[];
  };
}

interface OpeningData {
  pgn: string;
  eco: string;
  name: string;
  urlName: string;
  mdx: string | null;
}

/**
 * 게임 정보를 표시하는 컴포넌트
 */
const GameInfo: React.FC<GameInfoProps> = ({
  fen,
  pgn,
  openingInfo,
  onReset,
  onUndo,
  ImportPGN,
}) => {
  const [openingData, setOpeningData] = useState<OpeningData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 오프닝 데이터 로드
   */
  const loadOpeningData = useCallback(async () => {
    if (!openingInfo) {
      setOpeningData(null);
      return;
    }

    setIsLoading(true);
    try {
      const opening = await fetchOpening(openingInfo);
      setOpeningData(opening as OpeningData);
    } catch (error) {
      console.error("오프닝 정보를 불러오는데 실패했습니다:", error);
      setOpeningData(null);
    } finally {
      setIsLoading(false);
    }
  }, [openingInfo]);

  useEffect(() => {
    loadOpeningData();
  }, [loadOpeningData]);

  /**
   * 오프닝 정보 렌더링
   */
  const renderOpeningInfo = () => {
    if (!openingInfo) {
      return (
        <div>
          <p className="text-base font-semibold text-muted-foreground">
            오프닝을 찾아보세요!
          </p>
        </div>
      );
    }

    return (
      <div className="text-base font-semibold text-foreground">
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
    );
  };

  /**
   * PGN과 ECO 코드 렌더링
   */
  const renderPgnSection = () => {
    if (!openingInfo) return null;

    return (
      <div>
        <hr />
        <div className="leading-7 [&:not(:first-child)]:mt-2 flex flex-row space-x-2">
          <div className="text-gray-400 flex flex-row space-x-2 pr-2">
            {isLoading ? (
              <div className="w-8 h-7 bg-muted rounded-sm animate-pulse flex items-center justify-center" />
            ) : openingData ? (
              <div className="flex items-center h-full">{openingData.eco}</div>
            ) : (
              <div className="flex items-center h-full">N/A</div>
            )}
          </div>
          {pgn}
        </div>
        <hr className="mt-2" />
      </div>
    );
  };

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
        <CardDescription>{renderOpeningInfo()}</CardDescription>
      </CardHeader>

      <CardContent>{renderPgnSection()}</CardContent>

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

export default React.memo(GameInfo);
