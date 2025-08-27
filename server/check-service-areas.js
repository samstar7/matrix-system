const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkServiceAreas() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrix_system'
  };

  try {
    console.log('🔍 서비스 영역 데이터 확인 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 데이터베이스 연결 성공!\n');

    // 테이블 존재 확인
    console.log('📋 solution_service_areas 테이블 확인:');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'solution_service_areas'");
    if (tables.length === 0) {
      console.log('❌ solution_service_areas 테이블이 존재하지 않습니다.');
      return;
    }
    console.log('✅ solution_service_areas 테이블이 존재합니다.\n');

    // 데이터 개수 확인
    console.log('📊 데이터 개수:');
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM solution_service_areas');
    console.log(`  - 서비스 영역: ${countResult[0].count}개\n`);

    // 데이터 목록 확인
    console.log('📋 서비스 영역 목록:');
    const [areas] = await connection.execute('SELECT * FROM solution_service_areas ORDER BY id');
    areas.forEach((area, index) => {
      console.log(`  ${index + 1}. ${area.service_area} - ${area.description}`);
    });

    await connection.end();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

checkServiceAreas(); 