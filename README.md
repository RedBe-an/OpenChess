<p align="center">
  <img style="height:150px;" src=".github/OpenChess.png">
</p>

<h1 align="center">OpenChess</h1>

## 🚀 소개

체스 오프닝을 찾아볼 수 있는 사이트입니다. 스스로 수를 둬서 찾을 수도 있고, `PGN`, `FEN`을 사용해서 찾아볼 수도, 게임 링크로 찾아볼 수도 있습니다.

오프닝 이름이 무엇인지만을 알려주는 것이 아닌, `설명`과 `이후 전개`, `바리에이션`, `유저 승률`, 해당 오프닝의 `유명 경기`, `관련 콘텐츠` 등을 제공합니다.

## 🛠️ 기술 스택

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![supabase](https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white) ![prisma](https://img.shields.io/badge/prisma-000000?style=for-the-badge&logo=prisma&logoColor=white)

| **Category**  |        **Stack**        |
| :-----------: | :---------------------: |
| **Front-end** | `TypeScript`, `Next.js` |
|  **Styling**  |      `TailwindCSS`      |
| **Database**  |  `prisma`, `supabase`   |
|  **Backend**  |         `Rust`          |

## ✨ 리팩토링 개선사항

이 프로젝트는 클린 코드 원칙에 따라 전면적으로 리팩토링되었습니다:

### 🏗️ 아키텍처 개선

- **단일 책임 원칙**: 각 컴포넌트와 함수가 하나의 명확한 책임을 가지도록 분리
- **관심사 분리**: UI 로직, 비즈니스 로직, API 로직을 명확히 분리
- **모듈화**: 재사용 가능한 컴포넌트와 유틸리티 함수로 구성

### 📝 타입 안전성 강화

- **엄격한 TypeScript 타입 정의**: 모든 인터페이스와 타입이 명확히 정의됨
- **타입 가드 및 검증**: 런타임 타입 안전성 보장
- **제네릭 활용**: 재사용 가능한 타입 정의

### 🧩 컴포넌트 구조 개선

- **ChessGameManager**: 체스 게임 로직을 캡슐화한 클래스
- **ChessSquare**: 개별 체스판 사각형 컴포넌트
- **PgnImportDialog**: PGN 가져오기 기능을 별도 컴포넌트로 분리
- **ErrorBoundary**: 에러 처리를 위한 경계 컴포넌트

### 🎯 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useCallback**: 함수 참조 안정성 보장
- **지연 로딩**: Suspense를 활용한 코드 스플리팅

### 🔧 개발자 경험 개선

- **일관된 코딩 스타일**: 명확한 네이밍 컨벤션과 주석
- **에러 처리**: 포괄적인 에러 경계와 로깅
- **개발 도구**: 향상된 디버깅과 개발 환경 설정

### 📁 폴더 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ChessBoard.tsx   # 메인 체스보드 컴포넌트
│   ├── ChessSquare.tsx  # 개별 사각형 컴포넌트
│   ├── ChessPiece.tsx   # 체스 기물 컴포넌트
│   ├── GameInfo.tsx     # 게임 정보 패널
│   ├── PgnImportDialog.tsx # PGN 가져오기 다이얼로그
│   └── ErrorBoundary.tsx   # 에러 경계 컴포넌트
├── hooks/               # 커스텀 훅
│   ├── useChessGame.tsx # 체스 게임 상태 관리
│   ├── useCommon.ts     # 공통 유틸리티 훅
│   └── fetchOpening.ts  # 오프닝 데이터 가져오기
├── lib/                 # 유틸리티 라이브러리
│   ├── ChessGameManager.ts # 체스 게임 로직 클래스
│   ├── chess.ts         # 체스 관련 유틸리티
│   ├── api.ts           # API 호출 함수
│   ├── constants.ts     # 상수 정의
│   └── utils.ts         # 공통 유틸리티
└── types/               # 타입 정의
    └── chess.ts         # 체스 관련 타입
```

## 💻 설치 방법

1. 저장소 복제

```bash
gh repo clone RedBe-an/OpenChess
cd OpenChess
```

2. 의존성 설치

```bash
npm install
# 또는
bun install
```

3. 환경 변수 설정

```bash
cp .env.example .env.local
# 필요한 환경 변수를 설정하세요
```

4. 데이터베이스 설정

```bash
npm run db:setup
# 또는
bun db:setup
```

5. 개발 서버 실행

```bash
npm run dev
# 또는
bun dev
```

6. 빌드

```bash
# 기본 빌드 (추천)
bun run build

# 프로덕션 빌드 (전체 DB 설정 포함)
bun run build:prod

# 빠른 빌드 (DB 마이그레이션 제외)
bun run build:fast

# 번들 분석
bun run analyze

# Windows에서 빌드
build.bat

# Linux/Mac에서 빌드
./build.sh
```

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
