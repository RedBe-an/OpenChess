'use client'; 

import {
  Card,
  CardContent,
  CardDescription,
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
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

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
}: GameInfoProps) => {
  return (
    <Card className="flex-none min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>
          <div className="relative">
            <CircleHelp className="mb-4" />
            <div className="absolute inset-y-0 right-0 flex space-x-2">
              <ShareButton fen={fen} pgn={pgn}/>
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
            {(() => {
              // Execute the script logic
              const fetchOpening = async () => {
                try {
                  const opening = await prisma.opening.findFirst({
                    where: {
                      name: openingInfo.name,
                    },
                  });
                
                  console.log("DB query result:", opening);
                
                  if (!opening) {
                    console.error(`Opening not found in database: ${openingInfo.name}`);
                    return notFound(); // Ensure `notFound()` is defined or replace it with appropriate logic
                  }
                
                  // You can now use the `opening` data as needed
                  return opening;
                } catch (error) {
                  console.error("Database query error:", error);
                  return null;
                }
              };
            
              // Call the function and handle the result
              fetchOpening().then((opening) => {
                if (opening) {
                  // Do something with the opening data
                  console.log("Opening data:", opening);
                } else {
                  // Handle the case where the opening is not found or an error occurs
                  console.error("Failed to fetch opening data.");
                }
              });
            
              // Render a placeholder or loading state
              return <p>Loading opening data...</p>;
            })()}
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
