@echo off
setlocal enabledelayedexpansion

echo 🚀 OpenChess 빌드 시작...

:: 1. 의존성 설치 (필요한 경우)
if not exist "node_modules" (
    echo 📦 의존성 설치 중...
    bun install --frozen-lockfile
)

:: 2. 이전 빌드 정리
echo 🧹 이전 빌드 정리 중...
bun run clean

:: 3. 타입 체크
echo 🔍 타입 체크 중...
bun run type-check
if errorlevel 1 (
    echo ❌ 타입 체크 실패
    exit /b 1
)

:: 4. 린팅
echo ✨ 코드 포맷팅 중...
bun run lint:check
if errorlevel 1 (
    echo ❌ 린팅 실패
    exit /b 1
)

:: 5. Prisma 클라이언트 생성
echo 🗄️ Prisma 클라이언트 생성 중...
bun run db:generate
if errorlevel 1 (
    echo ❌ Prisma 클라이언트 생성 실패
    exit /b 1
)

:: 6. 빌드 실행
echo 🏗️ Next.js 빌드 중...
set NODE_ENV=production
bun run build:next
if errorlevel 1 (
    echo ❌ 빌드 실패
    exit /b 1
)

echo ✅ 빌드 완료!

:: 빌드 크기 정보 출력
if exist ".next" (
    echo 📊 빌드 통계:
    dir .next /s
)

endlocal
