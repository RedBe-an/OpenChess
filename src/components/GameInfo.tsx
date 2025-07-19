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
import type { OpeningInfo, TopGame } from "@/types/chess";
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
  isLastKnownOpening?: boolean;
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
  isLastKnownOpening = false,
}) => {
  const [openingData, setOpeningData] = useState<OpeningData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastOpeningInfo, setLastOpeningInfo] = useState<OpeningInfo | null>(null);

  /**
   * 오프닝 데이터 로드
   */
  const loadOpeningData = useCallback(async () => {
    if (!openingInfo) {
      setOpeningData(null);
      return;
    }

    // 현재 오프닝 정보를 마지막 오프닝으로 저장
    setLastOpeningInfo(openingInfo);

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

  // 리셋 시 마지막 오프닝 정보도 초기화 (완전히 초기 상태일 때만)
  useEffect(() => {
    const isInitialState = !pgn || pgn.trim() === "";
    if (isInitialState) {
      setLastOpeningInfo(null);
    }
  }, [pgn]);

  // 한 수 되돌리기 처리 - 오프닝이 다시 감지되면 마지막 오프닝 정보 업데이트
  useEffect(() => {
    if (openingInfo && lastOpeningInfo && openingInfo.name !== lastOpeningInfo.name) {
      setLastOpeningInfo(openingInfo);
    }
  }, [openingInfo, lastOpeningInfo]);

  /**
   * 오프닝 정보 렌더링
   */
  const renderOpeningInfo = () => {
    // pgn이 비어있는 초기 상태인지 확인
    const isInitialState = !pgn || pgn.trim() === "";
    
    // 현재 오프닝이 없는 경우
    if (!openingInfo) {
      // 초기 상태라면 기본 메시지 표시
      if (isInitialState) {
        return (
          <div>
            <p className="text-base font-semibold text-muted-foreground">
              오프닝을 찾아보세요!
            </p>
          </div>
        );
      }
      
      // 마지막 오프닝이 있다면 그것을 표시
      if (lastOpeningInfo) {
        return (
          <div className="text-base font-semibold text-muted-foreground">
            마지막 오프닝:{" "}
            <a
              href={`/openings/${normalizeFileName(lastOpeningInfo.name ?? "")}`}
              className="hover:underline"
            >
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {lastOpeningInfo.name}
              </code>
            </a>
          </div>
        );
      }
      
      // 마지막 오프닝도 없다면 기본 메시지
      return (
        <div>
          <p className="text-base font-semibold text-muted-foreground">
            오프닝을 찾아보세요!
          </p>
        </div>
      );
    }

    // 현재 오프닝이 있는 경우
    if (isLastKnownOpening) {
      // 마지막 알려진 오프닝인 경우 회색 글자로 표시
      return (
        <div className="text-base font-semibold text-muted-foreground">
          마지막 오프닝:{" "}
          <a
            href={`/openings/${normalizeFileName(openingInfo?.name ?? "")}`}
            className="hover:underline"
          >
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {openingInfo.name}
            </code>
          </a>
        </div>
      );
    } else {
      // 현재 오프닝인 경우 일반 글자로 표시
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
    }
  };

  /**
   * PGN과 ECO 코드 렌더링
   */
  const renderPgnSection = () => {
    // 현재 오프닝이나 마지막 오프닝이 있을 때만 PGN 섹션을 표시
    const displayOpeningInfo = openingInfo || lastOpeningInfo;
    if (!displayOpeningInfo) return null;

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
