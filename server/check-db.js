const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrix_system'
  };

  try {
    console.log('🔍 데이터베이스 연결 확인 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 데이터베이스 연결 성공!\n');

    // 테이블 목록 확인
    console.log('📋 테이블 목록:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    console.log('');

    // 각 테이블의 데이터 개수 확인
    console.log('📊 데이터 개수:');
    const [hardwareCount] = await connection.execute('SELECT COUNT(*) as count FROM hardware');
    const [softwareCount] = await connection.execute('SELECT COUNT(*) as count FROM software');
    const [purchaseCount] = await connection.execute('SELECT COUNT(*) as count FROM purchase_requests');
    
    console.log(`  - 하드웨어: ${hardwareCount[0].count}개`);
    console.log(`  - 소프트웨어: ${softwareCount[0].count}개`);
    console.log(`  - 구매요청: ${purchaseCount[0].count}개`);
    console.log('');

    // 최근 데이터 확인
    console.log('🆕 최근 등록된 데이터:');
    
    const [recentHardware] = await connection.execute('SELECT * FROM hardware ORDER BY created_at DESC LIMIT 3');
    console.log('  하드웨어:');
    recentHardware.forEach(hw => {
      console.log(`    - ${hw.name} (${hw.model}) - ${new Date(hw.created_at).toLocaleString()}`);
    });

    const [recentSoftware] = await connection.execute('SELECT * FROM software ORDER BY created_at DESC LIMIT 3');
    console.log('  소프트웨어:');
    recentSoftware.forEach(sw => {
      console.log(`    - ${sw.name} v${sw.version} - ${new Date(sw.created_at).toLocaleString()}`);
    });

    const [recentPurchase] = await connection.execute('SELECT * FROM purchase_requests ORDER BY created_at DESC LIMIT 3');
    console.log('  구매요청:');
    recentPurchase.forEach(req => {
      console.log(`    - ${req.hardware} / ${req.software} (${req.requester}) - ${new Date(req.created_at).toLocaleString()}`);
    });

    await connection.end();
    console.log('\n✅ 데이터베이스 확인 완료!');

  } catch (error) {
    console.error('❌ 데이터베이스 확인 실패:', error.message);
  }
}

checkDatabase(); 