import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { normalizeFileName } from "@/lib/utils";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const prisma = new PrismaClient();

async function syncOpenings() {
  try {
    // openings 폴더의 모든 MDX 파일 읽기
    const files = await readdir("./openings");
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    for (const file of mdxFiles) {
      const fileContent = await readFile(join("./openings", file));
      const fileName = file.replace(".mdx", "");
      const normalizedFileName = normalizeFileName(fileName);

      // Supabase Storage에 파일 업로드
      const { data, error } = await supabase.storage
        .from("openings")
        .upload(`mdx/${normalizedFileName}.mdx`, fileContent, {
          contentType: "text/markdown",
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${file}:`, error);
        continue;
      }

      // 파일의 공개 URL 가져오기
      const publicUrl = `mdx/${normalizedFileName}.mdx`;

      // Database에 정보 저장
      await prisma.openings.upsert({
        where: { opening_name: normalizedFileName },
        update: {
          description_file: publicUrl,
          updated_at: new Date(),
        },
        create: {
          opening_name: normalizedFileName,
          description_file: publicUrl,
        },
      });

      console.log(`Successfully synced ${fileName}`);
    }
  } catch (error) {
    console.error("Sync failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncOpenings();
