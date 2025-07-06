import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const count = await prisma.opening.count();
    console.log(`총 ${count}개의 오프닝 데이터가 있습니다.`);
    
    const sample = await prisma.opening.findMany({
      take: 5,
      select: {
        eco: true,
        name: true,
        urlName: true,
        mdx: true
      }
    });
    
    console.log('샘플 데이터:');
    sample.forEach((opening, index) => {
      console.log(`${index + 1}. ${opening.eco} - ${opening.name}`);
      console.log(`   urlName: ${opening.urlName}`);
      console.log(`   mdx: ${opening.mdx}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
