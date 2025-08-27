const mysql = require('mysql2/promise');
require('dotenv').config();

async function createSolutionData() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrix_system'
  };

  try {
    console.log('🔍 데이터베이스 연결 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 데이터베이스 연결 성공!\n');

    // 솔루션 테이블 생성
    console.log('📋 솔루션 테이블 생성 중...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS solutions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_area VARCHAR(100) NOT NULL,
        solution_type VARCHAR(100) NOT NULL,
        solution_name VARCHAR(200) NOT NULL,
        license_policy VARCHAR(200),
        vendor VARCHAR(100),
        vendor_contact VARCHAR(100),
        vendor_phone VARCHAR(50),
        vendor_email VARCHAR(100),
        supplier VARCHAR(100),
        supplier_contact VARCHAR(100),
        supplier_phone VARCHAR(50),
        supplier_email VARCHAR(100),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 솔루션 테이블 생성 완료!\n');

    // 서비스 영역 테이블 생성
    console.log('📋 서비스 영역 테이블 생성 중...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS solution_service_areas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_area VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        example_solution VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 서비스 영역 테이블 생성 완료!\n');

    // 서비스 영역 데이터 삽입
    console.log('📝 서비스 영역 데이터 삽입 중...');
    const serviceAreas = [
      {
        service_area: '인프라 관리',
        description: '서버, 네트워크, 클라우드 인프라 관리 솔루션',
        example_solution: 'VMware vSphere, AWS CloudFormation'
      },
      {
        service_area: '보안 관리',
        description: '네트워크 보안, 엔드포인트 보안, 데이터 보안 솔루션',
        example_solution: 'Symantec Endpoint Protection, Palo Alto Networks'
      },
      {
        service_area: '데이터 관리',
        description: '데이터베이스, 데이터 웨어하우스, 빅데이터 관리 솔루션',
        example_solution: 'Oracle Database, Apache Hadoop'
      },
      {
        service_area: '개발 도구',
        description: '소프트웨어 개발, 테스트, 배포 도구',
        example_solution: 'Visual Studio, Jenkins, GitLab'
      },
      {
        service_area: '비즈니스 애플리케이션',
        description: 'ERP, CRM, HRM 등 비즈니스 프로세스 관리 솔루션',
        example_solution: 'SAP ERP, Salesforce CRM'
      }
    ];

    for (const area of serviceAreas) {
      await connection.execute(
        'INSERT IGNORE INTO solution_service_areas (service_area, description, example_solution) VALUES (?, ?, ?)',
        [area.service_area, area.description, area.example_solution]
      );
    }
    console.log('✅ 서비스 영역 데이터 삽입 완료!\n');

    // 솔루션 데이터 삽입
    console.log('📝 솔루션 데이터 삽입 중...');
    const solutions = [
      {
        service_area: '인프라 관리',
        solution_type: '가상화',
        solution_name: 'VMware vSphere',
        license_policy: 'CPU 기반 라이선스',
        vendor: 'VMware Inc.',
        vendor_contact: '김영수',
        vendor_phone: '02-1234-5678',
        vendor_email: 'ys.kim@vmware.com',
        supplier: '한국VMware',
        supplier_contact: '박민수',
        supplier_phone: '02-2345-6789',
        supplier_email: 'ms.park@vmware.co.kr',
        remarks: '엔터프라이즈 가상화 플랫폼'
      },
      {
        service_area: '인프라 관리',
        solution_type: '클라우드',
        solution_name: 'AWS CloudFormation',
        license_policy: '사용량 기반 과금',
        vendor: 'Amazon Web Services',
        vendor_contact: '이준호',
        vendor_phone: '02-3456-7890',
        vendor_email: 'jh.lee@aws.com',
        supplier: 'AWS Korea',
        supplier_contact: '최지영',
        supplier_phone: '02-4567-8901',
        supplier_email: 'jy.choi@aws.co.kr',
        remarks: '인프라 자동화 및 관리'
      },
      {
        service_area: '보안 관리',
        solution_type: '엔드포인트 보안',
        solution_name: 'Symantec Endpoint Protection',
        license_policy: '사용자 기반 라이선스',
        vendor: 'Broadcom',
        vendor_contact: '정수진',
        vendor_phone: '02-5678-9012',
        vendor_email: 'sj.jung@broadcom.com',
        supplier: '한국시만텍',
        supplier_contact: '강동현',
        supplier_phone: '02-6789-0123',
        supplier_email: 'dh.kang@symantec.co.kr',
        remarks: '통합 엔드포인트 보안 솔루션'
      },
      {
        service_area: '보안 관리',
        solution_type: '네트워크 보안',
        solution_name: 'Palo Alto Networks Firewall',
        license_policy: '장비 기반 라이선스',
        vendor: 'Palo Alto Networks',
        vendor_contact: '윤서연',
        vendor_phone: '02-7890-1234',
        vendor_email: 'sy.yoon@paloaltonetworks.com',
        supplier: '팔로알토네트웍스코리아',
        supplier_contact: '임태호',
        supplier_phone: '02-8901-2345',
        supplier_email: 'th.lim@paloaltonetworks.co.kr',
        remarks: '차세대 방화벽 솔루션'
      },
      {
        service_area: '데이터 관리',
        solution_type: '데이터베이스',
        solution_name: 'Oracle Database',
        license_policy: '프로세서 기반 라이선스',
        vendor: 'Oracle Corporation',
        vendor_contact: '한미영',
        vendor_phone: '02-9012-3456',
        vendor_email: 'my.han@oracle.com',
        supplier: '오라클코리아',
        supplier_contact: '송현우',
        supplier_phone: '02-0123-4567',
        supplier_email: 'hw.song@oracle.co.kr',
        remarks: '엔터프라이즈 데이터베이스'
      },
      {
        service_area: '개발 도구',
        solution_type: 'IDE',
        solution_name: 'Visual Studio',
        license_policy: '사용자 기반 라이선스',
        vendor: 'Microsoft',
        vendor_contact: '조성민',
        vendor_phone: '02-1234-5678',
        vendor_email: 'sm.cho@microsoft.com',
        supplier: '마이크로소프트코리아',
        supplier_contact: '백지원',
        supplier_phone: '02-2345-6789',
        supplier_email: 'jw.baek@microsoft.co.kr',
        remarks: '통합 개발 환경'
      },
      {
        service_area: '비즈니스 애플리케이션',
        solution_type: 'ERP',
        solution_name: 'SAP ERP',
        license_policy: '사용자 기반 라이선스',
        vendor: 'SAP SE',
        vendor_contact: '유재석',
        vendor_phone: '02-3456-7890',
        vendor_email: 'js.yoo@sap.com',
        supplier: 'SAP Korea',
        supplier_contact: '김태희',
        supplier_phone: '02-4567-8901',
        supplier_email: 'th.kim@sap.co.kr',
        remarks: '전사적 자원 관리 시스템'
      }
    ];

    for (const solution of solutions) {
      await connection.execute(
        `INSERT INTO solutions (
          service_area, solution_type, solution_name, license_policy,
          vendor, vendor_contact, vendor_phone, vendor_email,
          supplier, supplier_contact, supplier_phone, supplier_email, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          solution.service_area, solution.solution_type, solution.solution_name, solution.license_policy,
          solution.vendor, solution.vendor_contact, solution.vendor_phone, solution.vendor_email,
          solution.supplier, solution.supplier_contact, solution.supplier_phone, solution.supplier_email, solution.remarks
        ]
      );
    }
    console.log('✅ 솔루션 데이터 삽입 완료!\n');

    // 데이터 확인
    console.log('📊 삽입된 데이터 확인:');
    const [solutionCount] = await connection.execute('SELECT COUNT(*) as count FROM solutions');
    const [areaCount] = await connection.execute('SELECT COUNT(*) as count FROM solution_service_areas');
    
    console.log(`  - 솔루션: ${solutionCount[0].count}개`);
    console.log(`  - 서비스 영역: ${areaCount[0].count}개`);

    const [recentSolutions] = await connection.execute('SELECT * FROM solutions ORDER BY created_at DESC LIMIT 3');
    console.log('\n🆕 최근 등록된 솔루션:');
    recentSolutions.forEach(sol => {
      console.log(`  - ${sol.solution_name} (${sol.service_area} / ${sol.solution_type})`);
    });

    await connection.end();
    console.log('\n✅ 솔루션 데이터 생성 완료!');

  } catch (error) {
    console.error('❌ 솔루션 데이터 생성 실패:', error.message);
  }
}

createSolutionData(); 