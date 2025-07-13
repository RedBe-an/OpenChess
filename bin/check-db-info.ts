import prisma from "../src/lib/prisma";

interface DatabaseInfo {
  name: string;
  tables: string[];
}

interface QueryResult {
  db_name: string;
}

interface TableResult {
  table_name: string;
}

class DatabaseChecker {
  private async getCurrentDatabase(): Promise<string> {
    const result = await prisma.$queryRaw<QueryResult[]>`
      SELECT current_database() as db_name
    `;
    return result[0]?.db_name || "unknown";
  }

  private async getTableList(): Promise<string[]> {
    const tables = await prisma.$queryRaw<TableResult[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    return tables.map((table) => table.table_name);
  }

  private displayDatabaseInfo(info: DatabaseInfo): void {
    console.log("\n=== 데이터베이스 정보 ===");
    console.log(`📊 데이터베이스: ${info.name}`);
    console.log(`📋 테이블 개수: ${info.tables.length}`);

    if (info.tables.length > 0) {
      console.log("\n📁 테이블 목록:");
      info.tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table}`);
      });
    } else {
      console.log("⚠️  테이블이 없습니다.");
    }
    console.log("========================\n");
  }

  async checkDatabase(): Promise<void> {
    try {
      console.log("🔍 데이터베이스 정보를 확인하는 중...\n");

      const [dbName, tables] = await Promise.all([
        this.getCurrentDatabase(),
        this.getTableList(),
      ]);

      const databaseInfo: DatabaseInfo = {
        name: dbName,
        tables,
      };

      this.displayDatabaseInfo(databaseInfo);
    } catch (error) {
      console.error("❌ 데이터베이스 정보 확인 중 오류 발생:");
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
      console.log("✅ 데이터베이스 연결이 종료되었습니다.");
    } catch (error) {
      console.error("⚠️  데이터베이스 연결 종료 중 오류:", error);
    }
  }
}

// 스크립트 실행
async function main(): Promise<void> {
  const checker = new DatabaseChecker();
  await checker.checkDatabase();
}

// 스크립트가 직접 실행될 때만 실행
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 예상치 못한 오류:", error);
    process.exit(1);
  });
}

export default DatabaseChecker;
