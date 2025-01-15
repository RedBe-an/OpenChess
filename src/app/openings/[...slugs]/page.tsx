import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getMdxContent } from "@/lib/mdx";

type OpeningPageProps = {
  params: Promise<{
    slugs: string[];
  }>;
};

export default async function OpeningPage({ params }: OpeningPageProps) {
  const resolvedParams = await params;

  // 슬러그가 없으면 404
  if (!resolvedParams.slugs?.length) {
    console.log("No slugs found in params:", resolvedParams);
    return notFound();
  }

  const openingPath = resolvedParams.slugs.join("/").toLowerCase();

  try {
    // 디버깅을 위한 로그 추가
    console.log("Attempting to find opening with path:", openingPath);

    // Check if Prisma is initialized
    if (!prisma || !prisma.opening) {
      console.error("Prisma or Opening model is not initialized.");
      return notFound();
    }

    // DB에서 오프닝 정보 조회
    const opening = await prisma.opening.findFirst({
      where: {
        urlName: openingPath,
      },
    }).catch((error) => {
      console.error("Database query error:", error);
      return null;
    });

    console.log("DB query result:", opening);

    if (!opening) {
      console.error(`Opening not found in database: ${openingPath}`);
      return notFound();
    }

    // MDX 컨텐츠 로드 (mdx 필드가 없을 경우 대체 로직 추가)
    let content = null;
    if (opening.mdx) {
      content = await getMdxContent(opening.mdx).catch((error) => {
        console.error("MDX content loading error:", error);
        return null;
      });
    } else {
      // mdx 필드가 없을 경우 기본 설명 표시
      content = <p>No description available for this opening.</p>;
    }

    return (
      <article className="max-w-3xl mx-auto py-8 px-4">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {content}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error fetching opening:", error);
    return notFound();
  }
}