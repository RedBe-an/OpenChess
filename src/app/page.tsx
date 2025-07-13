import { Suspense } from "react";
import Chessboard from "@/components/ChessBoard";

/**
 * 체스보드 로딩 스켈레톤 컴포넌트
 */
function ChessboardSkeleton() {
  return (
    <div className="h-screen w-screen flex flex-row items-center justify-center">
      <div className="flex flex-row gap-4 w-full h-full max-w-[90vmin] max-h-[90vmin] rounded-lg justify-center">
        {/* 체스보드 스켈레톤 */}
        <div className="flex-1 aspect-square flex flex-col bg-muted animate-pulse rounded-lg" />

        {/* 게임 정보 패널 스켈레톤 */}
        <div className="flex-none min-w-[400px] max-w-[400px] bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 홈페이지 컴포넌트
 */
export default function HomePage() {
  return (
    <main className="h-screen w-screen flex flex-row items-center justify-center">
      <Suspense fallback={<ChessboardSkeleton />}>
        <Chessboard />
      </Suspense>
    </main>
  );
}
