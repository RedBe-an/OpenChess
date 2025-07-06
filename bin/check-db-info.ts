import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const result = await prisma.$queryRaw`SELECT current_database() as db_name`;
    console.log('현재 연결된 데이터베이스:', result);
    
    // 스키마 정보도 확인
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('테이블 목록:', tables);
    
  } catch (error) {
    console.error('오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
