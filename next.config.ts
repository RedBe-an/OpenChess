import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  // 빌드 시 외부 의존성 처리
  transpilePackages: ["@prisma/client"],
  // 동적 라우팅 설정
  output: "standalone" as const, // 서버사이드 렌더링을 위한 설정
  
  // 이미지 최적화 설정
  images: {
    // 체스 말 이미지의 preload 경고를 방지하기 위한 설정
    unoptimized: false,
    // 이미지 도메인 설정 (필요한 경우)
    domains: [],
    // 이미지 크기 제한
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // preload 비활성화
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  
  // 실험적 기능으로 이미지 preload 최적화
  experimental: {
    optimizePackageImports: ['@/components'],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkToc, remarkGfm, remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
    providerImportSource: "@mdx-js/react",
  },
});

module.exports = withMDX(nextConfig);
