import { notFound } from 'next/navigation'
import { getMdxContent } from '@/lib/mdx'
import prisma from '@/lib/prisma'

export default async function OpeningPage({
  params
}: {
  params: { slugs: string[] }
}) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.slugs?.length) {
    return notFound()
  }

  const openingName = resolvedParams.slugs.join('/')
    
  const opening = await prisma.opening.findUnique({
    where: { 
      opening_name: openingName.toLowerCase()
    }
  })

  if (!opening) {
    console.error('Opening not found:', openingName)
    return notFound()
  }

  const content = await getMdxContent(opening.description_file)
      
  if (!content) {
    console.error('MDX content not found for:', opening.description_file)
    return notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  )
}