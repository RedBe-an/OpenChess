import { notFound } from 'next/navigation'
import { getMdxContent } from '@/lib/mdx'
import prisma from '@/lib/prisma'

interface PageProps {
  params: {
    slugs: string[];
  }
}

export default async function OpeningPage({
  params
}: PageProps) {
  const { slugs } = await params;

  const openingName = slugs.join('/')
    
  const opening = await prisma.opening.findUnique({
    where: { 
      opening_name: openingName.toLowerCase()
    }
  })

  if (!opening) {
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