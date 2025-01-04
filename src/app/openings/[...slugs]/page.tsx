
import { notFound } from 'next/navigation'
import { getMdxContent } from '@/lib/mdx'
import prisma from '@/lib/prisma'

type OpeningPageProps = {
  params: Promise<{
    slugs: string[]
  }>
}

export default async function OpeningPage({ params }: OpeningPageProps) {
  const resolvedParams = await params;
  
  // 슬러그가 없으면 404
  if (!resolvedParams.slugs?.length) {
    console.log("No slugs found in params:", resolvedParams)
    return notFound()
  }

  const openingPath = resolvedParams.slugs.join('/').toLowerCase()
  
  try {
    // 디버깅을 위한 로그 추가
    console.log('Attempting to find opening with path:', openingPath)

    // DB에서 오프닝 정보 조회
    const opening = await prisma.openings.findUnique({
      where: {
        opening_name: openingPath
      }
    }).catch(error => {
      console.error('Database query error:', error)
      return null
    })

    // 결과 로깅
    console.log('DB query result:', opening)

    if (!opening) {
      console.error(`Opening not found in database: ${openingPath}`)
      return notFound()
    }

    // MDX 파일 존재 여부 확인
    if (!opening.description_file) {
      console.error(`Description file missing for opening: ${openingPath}`)
      return notFound()
    }

    // MDX 컨텐츠 로드
    const content = await getMdxContent(opening.description_file).catch(error => {
      console.error('MDX content loading error:', error)
      throw error
    })

    return (
      <article className="max-w-3xl mx-auto py-8 px-4">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {content}
        </div>
      </article>
    )
  } catch (error) {
    console.error('Error fetching opening:', error)
    return notFound()
  }
}