import { compileMDX } from 'next-mdx-remote/rsc'
import { supabase } from '@/lib/client' // supabase 클라이언트 import 필요
import ChessDiagram from '@/components/openings/ChessDiagram'

export async function getMdxContent(filePath: string) {
  const { data, error } = await supabase.storage
    .from('openings') // 버킷 이름을 실제 사용하는 이름으로 변경하세요
    .download(filePath)

  if (error) {
    console.error('Error fetching MDX content:', error)
    return null
  }

  // Blob 데이터를 텍스트로 변환
  const content = await data.text()
  const { content: mdxContent } = await compileMDX({ source: content, components: {ChessDiagram} })
  return mdxContent
}