import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { compileMDX } from "next-mdx-remote/rsc";
import { supabase } from "@/lib/client";
import ChessDiagram from "@/components/openings/ChessDiagram";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type OpeningPageProps = {
  params: Promise<{
    slugs: string[];
  }>;
};

async function getOpeningFromPath(openingPath: string) {
  if (!prisma?.opening) {
    console.error("Prisma or Opening model is not initialized.");
    return null;
  }

  try {
    const opening = await prisma.opening.findFirst({
      where: { urlName: openingPath },
    });

    console.log("DB query result:", opening);
    return opening;
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}

async function getOpeningContent(mdxPath: string | null) {
  if (!mdxPath) {
    return <p>이 오프닝에 대한 설명이 없습니다.</p>;
  }

  try {
    const { data, error } = await supabase.storage
      .from("openings")
      .download(mdxPath);

    if (error) {
      console.error("MDX 파일을 가져오는데 실패했습니다:", error);
      return <p>오프닝 내용을 불러오는데 실패했습니다.</p>;
    }

    const content = await data.text();
    const { content: mdxContent } = await compileMDX({
      source: content,
      components: {
        ChessDiagram,
      },
      options: {
        mdxOptions: {
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
        },
      },
    });

    return mdxContent;
  } catch (error) {
    console.error("MDX 컨텐츠 로딩 에러:", error);
    return <p>오프닝 내용을 불러오는데 실패했습니다.</p>;
  }
}

export default async function OpeningPage({ params }: OpeningPageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.slugs?.length) {
    console.log("슬러그를 찾을 수 없습니다:", resolvedParams);
    return notFound();
  }

  const openingPath = resolvedParams.slugs.join("/").toLowerCase();
  console.log("오프닝 경로 검색 중:", openingPath);

  const opening = await getOpeningFromPath(openingPath);
  if (!opening) {
    console.error(`데이터베이스에서 오프닝을 찾을 수 없습니다: ${openingPath}`);
    return notFound();
  }

  const content = await getOpeningContent(opening.mdx);

  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  );
}
