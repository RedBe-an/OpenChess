import { notFound } from 'next/navigation'
import { getMdxContent } from '@/lib/mdx'
import prisma from '@/lib/prisma'

type OpeningPageProps = {
  params: Promise<{
    slugs: string[]
  }>
}

export default async function OpeningPage({ params }: OpeningPageProps) {
  // params를 await
  const resolvedParams = await params
  
  // 슬러그가 없으면 404
  if (!resolvedParams.slugs?.length) {
    return notFound()
  }

  // 슬러그를 경로로 변환
  const openingPath = resolvedParams.slugs.join('/').toLowerCase()
  
  try {
    // DB에서 오프닝 정보 조회
    const opening = await prisma.opening.findUnique({
      where: { 
        opening_name: openingPath
      }
    })

    if (!opening) {
      console.error(`Opening not found: ${openingPath}`)
      return notFound()
    }

    // MDX 컨텐츠 로드
    const content = await getMdxContent(opening.description_file)
    
    if (!content) {
      console.error(`MDX content not found: ${opening.description_file}`)
      return notFound()
    }

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