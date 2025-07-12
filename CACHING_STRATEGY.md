# Prisma Accelerate Caching Strategy

이 프로젝트에서는 Prisma Accelerate의 `cacheStrategy` 기능을 활용하여 데이터베이스 쿼리 성능을 최적화합니다.

## 설정

### Prisma Client 구성

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());
```

### 환경 변수

```env
OPENCHESS_DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
OPENCHESS_DIRECT_URL="postgres://..."
```

## 캐시 전략

### 기본 캐시 전략 (`src/lib/cache.ts`)

```typescript
export const cacheStrategies = {
  short: { ttl: 60 }, // 1분 - 자주 변경되는 데이터
  medium: { ttl: 300 }, // 5분 - 일반적인 읽기 작업
  long: { ttl: 1800 }, // 30분 - 거의 변경되지 않는 데이터
  static: { ttl: 3600 }, // 1시간 - 정적 데이터

  // 특정 용도별
  opening: { ttl: 600 }, // 10분 - 체스 오프닝 데이터
  count: { ttl: 120 }, // 2분 - 카운트 쿼리
  sync: { ttl: 30 }, // 30초 - 동기화 작업
};
```

### 모델별 캐시 전략

```typescript
export const modelCacheStrategies = {
  opening: {
    list: createCacheStrategy(600, ["openings"]), // 10분 - 오프닝 목록
    detail: createCacheStrategy(1800, ["openings"]), // 30분 - 오프닝 상세
    count: createCacheStrategy(300, ["openings"]), // 5분 - 카운트
  },
  user: {
    profile: createCacheStrategy(300, ["users"]), // 5분 - 사용자 프로필
    list: createCacheStrategy(120, ["users"]), // 2분 - 사용자 목록
  },
  game: {
    recent: createCacheStrategy(60, ["games"]), // 1분 - 최근 게임
    history: createCacheStrategy(600, ["games"]), // 10분 - 게임 기록
  },
};
```

## 사용 예시

### 1. 기본 캐시 전략

```typescript
const opening = await prisma.opening.findFirst({
  where: { name: "Italian Game" },
  cacheStrategy: { ttl: 300 }, // 5분 캐시
});
```

### 2. 태그를 포함한 캐시 전략

```typescript
const openings = await prisma.opening.findMany({
  cacheStrategy: modelCacheStrategies.opening.list,
});
```

### 3. 검색 쿼리 캐싱

```typescript
const searchResults = await prisma.opening.findMany({
  where: {
    name: {
      contains: searchTerm,
      mode: "insensitive",
    },
  },
  cacheStrategy: createCacheStrategy(180), // 3분 캐시
});
```

### 4. 카운트 쿼리 캐싱

```typescript
const count = await prisma.opening.count({
  cacheStrategy: modelCacheStrategies.opening.count,
});
```

### 5. 조건부 캐싱

```typescript
export async function getPopularOpenings(useCache: boolean = true) {
  const query = {
    take: 10,
    select: { eco: true, name: true, urlName: true },
  };

  if (useCache) {
    return await prisma.opening.findMany({
      ...query,
      cacheStrategy: createCacheStrategy(900), // 15분
    });
  } else {
    return await prisma.opening.findMany(query);
  }
}
```

## 적용된 파일들

### 메인 애플리케이션

- `src/lib/prisma.ts` - Prisma Client 설정
- `src/lib/cache.ts` - 캐시 전략 정의
- `src/lib/queries.ts` - 쿼리 함수 예시
- `src/hooks/fetchOpening.ts` - 오프닝 조회 훅
- `src/app/openings/[...slugs]/page.tsx` - 오프닝 페이지

### 유틸리티 스크립트

- `bin/check-data.ts` - 데이터 확인 스크립트
- `bin/check-db-info.ts` - 데이터베이스 정보 확인
- `bin/sync-openings.ts` - 오프닝 동기화 스크립트

## 캐시 무효화

Prisma Accelerate는 태그 기반 캐시 무효화를 지원합니다:

```typescript
// 데이터 업데이트 후 관련 캐시 무효화
const updated = await prisma.opening.update({
  where: { pgn: openingPgn },
  data: { mdx: mdxPath },
});

// 캐시 무효화는 태그를 통해 자동으로 처리됩니다
```

## 성능 이점

1. **응답 시간 단축**: 자주 조회되는 데이터의 응답 시간을 크게 단축
2. **데이터베이스 부하 감소**: 반복적인 쿼리의 데이터베이스 부하 감소
3. **확장성 향상**: 높은 트래픽에서도 안정적인 성능 유지
4. **비용 절약**: 데이터베이스 연결 및 쿼리 비용 절감

## 모니터링

Prisma Accelerate 대시보드에서 캐시 히트율과 성능 메트릭을 모니터링할 수 있습니다.
