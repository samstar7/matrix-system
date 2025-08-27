const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'matrix_system'
};

// 데이터베이스 연결
let db;

async function connectDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('MySQL 데이터베이스 연결 성공');
    
    // 테이블 생성
    await createTables();
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  }
}

// 테이블 생성
async function createTables() {
  try {
    // 프로젝트 테이블 생성 (존재하지 않을 때만)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id VARCHAR(9) PRIMARY KEY,
        customer VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sales_rep VARCHAR(10),
        proposal_pm VARCHAR(10),
        announce_date DATE,
        submit_date DATE,
        presentation_date DATE,
        status ENUM('사전영업', '제안', '수주', '실주') DEFAULT '사전영업',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 하드웨어 테이블 생성 (존재하지 않을 때만)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS hardware (
        project_id VARCHAR(9) NOT NULL,
        hardware_id INT NOT NULL,
        work_name VARCHAR(255),
        purpose VARCHAR(255),
        os VARCHAR(100),
        server_name VARCHAR(255),
        server_type VARCHAR(100),
        cores INT,
        memory VARCHAR(100),
        os_disk VARCHAR(100),
        internal_disk VARCHAR(100),
        shared_disk VARCHAR(100),
        nic_service VARCHAR(100),
        nic_backup VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, hardware_id),
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      )
    `);

    // 소프트웨어 테이블
    await db.execute(`
      CREATE TABLE IF NOT EXISTS software (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        version VARCHAR(100),
        license_key VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 구매요청 테이블
    await db.execute(`
      CREATE TABLE IF NOT EXISTS purchase_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 솔루션 테이블 생성
    await db.execute(`
      CREATE TABLE IF NOT EXISTS solutions (
        solution_id VARCHAR(20) PRIMARY KEY,
        service_area VARCHAR(100),
        solution_type VARCHAR(100),
        solution_name VARCHAR(255) NOT NULL,
        license_policy VARCHAR(255),
        vendor VARCHAR(255),
        vendor_contact VARCHAR(100),
        vendor_phone VARCHAR(50),
        vendor_email VARCHAR(255),
        supplier VARCHAR(255),
        supplier_contact VARCHAR(100),
        supplier_phone VARCHAR(50),
        supplier_email VARCHAR(255),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 솔루션서비스영역목록 테이블 생성 (존재하지 않을 때만)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS solution_service_areas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_area VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        example_solution VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 기본 데이터 삽입 (테이블이 비어있을 때만)
    const [existingData] = await db.execute('SELECT COUNT(*) as count FROM solution_service_areas');
    if (existingData[0].count === 0) {
      const defaultData = [
        ['인프라 구축', '서버, 네트워크, 스토리지 등 IT 인프라 구축 서비스', '클라우드 마이그레이션, 데이터센터 구축'],
        ['보안 솔루션', '정보보안 및 사이버 보안 솔루션', '방화벽, IDS/IPS, 보안관제'],
        ['데이터 관리', '데이터베이스 및 데이터 관리 솔루션', '데이터베이스 구축, 백업/복구, 데이터 분석'],
        ['업무 시스템', '기업 업무 효율화를 위한 시스템 구축', 'ERP, CRM, 그룹웨어'],
        ['모니터링', '시스템 및 서비스 모니터링 솔루션', 'APM, 로그 분석, 알림 시스템'],
        ['통합 관리', '다양한 시스템을 통합 관리하는 솔루션', 'ITSM, 통합 모니터링, 자동화']
      ];
      
      for (const [service_area, description, example_solution] of defaultData) {
        try {
          await db.execute(
            'INSERT INTO solution_service_areas (service_area, description, example_solution) VALUES (?, ?, ?)',
            [service_area, description, example_solution]
          );
        } catch (error) {
          console.error('서비스 영역 데이터 삽입 오류:', error);
        }
      }
      console.log('서비스 영역 기본 데이터가 삽입되었습니다.');
    }


        console.log('테이블 생성 완료');
  } catch (error) {
    console.error('테이블 생성 오류:', error);
  }
}

// API 라우트

// 하드웨어 API
app.get('/api/hardware', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT h.*, p.name as project_name, p.customer 
      FROM hardware h 
      JOIN projects p ON h.project_id = p.project_id 
      ORDER BY h.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: '하드웨어 목록 조회 실패' });
  }
});

app.post('/api/hardware', async (req, res) => {
  try {
    const { 
      project_id, 
      work_name, 
      purpose, 
      os, 
      server_name, 
      server_type, 
      cores, 
      memory, 
      os_disk, 
      internal_disk, 
      shared_disk, 
      nic_service, 
      nic_backup 
    } = req.body;
    
    // undefined를 null로 변환하는 함수
    const toNull = (value) => value === undefined || value === '' ? null : value;
    
    // 해당 프로젝트의 마지막 하드웨어 번호 조회
    const [existingHardware] = await db.execute(
      'SELECT hardware_id FROM hardware WHERE project_id = ? ORDER BY hardware_id DESC LIMIT 1',
      [project_id]
    );
    
    let nextHardwareId = 1;
    if (existingHardware.length > 0) {
      nextHardwareId = existingHardware[0].hardware_id + 1;
    }
    
    const [result] = await db.execute(
      `INSERT INTO hardware (
        project_id, hardware_id, work_name, purpose, os, server_name, 
        server_type, cores, memory, os_disk, internal_disk, shared_disk, 
        nic_service, nic_backup
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id, 
        nextHardwareId, 
        toNull(work_name), 
        toNull(purpose), 
        toNull(os), 
        toNull(server_name),
        toNull(server_type), 
        toNull(cores), 
        toNull(memory), 
        toNull(os_disk), 
        toNull(internal_disk), 
        toNull(shared_disk),
        toNull(nic_service), 
        toNull(nic_backup)
      ]
    );
    
    res.json({ 
      project_id: project_id,
      hardware_id: nextHardwareId, 
      work_name: toNull(work_name), 
      purpose: toNull(purpose), 
      os: toNull(os), 
      server_name: toNull(server_name), 
      server_type: toNull(server_type), 
      cores: toNull(cores), 
      memory: toNull(memory), 
      os_disk: toNull(os_disk), 
      internal_disk: toNull(internal_disk), 
      shared_disk: toNull(shared_disk), 
      nic_service: toNull(nic_service), 
      nic_backup: toNull(nic_backup)
    });
  } catch (error) {
    console.error('하드웨어 등록 오류:', error);
    res.status(500).json({ error: '하드웨어 등록 실패' });
  }
});

app.put('/api/hardware/:projectId/:hardwareId', async (req, res) => {
  try {
    const { projectId, hardwareId } = req.params;
    const { 
      work_name, 
      purpose, 
      os, 
      server_name, 
      server_type, 
      cores, 
      memory, 
      os_disk, 
      internal_disk, 
      shared_disk, 
      nic_service, 
      nic_backup 
    } = req.body;
    
    // undefined를 null로 변환하는 함수
    const toNull = (value) => value === undefined || value === '' ? null : value;
    
    const [result] = await db.execute(
      `UPDATE hardware SET 
        work_name = ?, purpose = ?, os = ?, server_name = ?, 
        server_type = ?, cores = ?, memory = ?, os_disk = ?, 
        internal_disk = ?, shared_disk = ?, nic_service = ?, nic_backup = ? 
      WHERE project_id = ? AND hardware_id = ?`,
      [
        toNull(work_name), 
        toNull(purpose), 
        toNull(os), 
        toNull(server_name),
        toNull(server_type), 
        toNull(cores), 
        toNull(memory), 
        toNull(os_disk), 
        toNull(internal_disk), 
        toNull(shared_disk),
        toNull(nic_service), 
        toNull(nic_backup),
        projectId, 
        hardwareId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '하드웨어를 찾을 수 없습니다.' });
    }
    
    res.json({ 
      project_id: projectId, 
      hardware_id: hardwareId, 
      work_name: toNull(work_name), 
      purpose: toNull(purpose), 
      os: toNull(os), 
      server_name: toNull(server_name), 
      server_type: toNull(server_type), 
      cores: toNull(cores), 
      memory: toNull(memory), 
      os_disk: toNull(os_disk), 
      internal_disk: toNull(internal_disk), 
      shared_disk: toNull(shared_disk), 
      nic_service: toNull(nic_service), 
      nic_backup: toNull(nic_backup)
    });
  } catch (error) {
    console.error('하드웨어 수정 오류:', error);
    res.status(500).json({ error: '하드웨어 수정 실패' });
  }
});

app.delete('/api/hardware/:projectId/:hardwareId', async (req, res) => {
  try {
    const { projectId, hardwareId } = req.params;
    
    const [result] = await db.execute(
      'DELETE FROM hardware WHERE project_id = ? AND hardware_id = ?',
      [projectId, hardwareId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '하드웨어를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '하드웨어가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '하드웨어 삭제 실패' });
  }
});

// 소프트웨어 API
app.get('/api/software', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM software ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: '소프트웨어 목록 조회 실패' });
  }
});

app.post('/api/software', async (req, res) => {
  try {
    const { name, version, license } = req.body;
    const [result] = await db.execute(
      'INSERT INTO software (name, version, license) VALUES (?, ?, ?)',
      [name, version, license]
    );
    res.json({ id: result.insertId, name, version, license });
  } catch (error) {
    res.status(500).json({ error: '소프트웨어 등록 실패' });
  }
});

// 구매요청 API
app.get('/api/purchase-requests', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM purchase_requests ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: '구매요청 목록 조회 실패' });
  }
});

app.post('/api/purchase-requests', async (req, res) => {
  try {
    const { hardware, software, reason, requester, request_date } = req.body;
    const [result] = await db.execute(
      'INSERT INTO purchase_requests (hardware, software, reason, requester, request_date) VALUES (?, ?, ?, ?, ?)',
      [hardware, software, reason, requester, request_date]
    );
    res.json({ 
      id: result.insertId, 
      hardware, 
      software, 
      reason, 
      requester, 
      request_date 
    });
  } catch (error) {
    res.status(500).json({ error: '구매요청 등록 실패' });
  }
});

// 프로젝트 API
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error);
    res.status(500).json({ error: '프로젝트 목록 조회 실패' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { customer, name, description, sales_rep, proposal_pm, announce_date, submit_date, presentation_date, status } = req.body;
    
    console.log('받은 status 값:', status);
    
    // status 값 검증
    const validStatuses = ['사전영업', '제안', '수주', '실주'];
    const processedStatus = validStatuses.includes(status) ? status : '사전영업';
    
    // 빈 날짜 문자열을 NULL로 변환
    const processedAnnounceDate = announce_date && announce_date.trim() !== '' ? announce_date : null;
    const processedSubmitDate = submit_date && submit_date.trim() !== '' ? submit_date : null;
    const processedPresentationDate = presentation_date && presentation_date.trim() !== '' ? presentation_date : null;
    
    // project_id 생성 (YYYY-NNNN 형태)
    const currentYear = new Date().getFullYear();
    const yearPrefix = currentYear.toString();
    
    // 해당 년도의 마지막 프로젝트 번호 조회
    const [existingProjects] = await db.execute(
      'SELECT project_id FROM projects WHERE project_id LIKE ? ORDER BY project_id DESC LIMIT 1',
      [`${yearPrefix}-%`]
    );
    
    let nextSerial = 1;
    if (existingProjects.length > 0) {
      const lastProjectId = existingProjects[0].project_id;
      const lastSerial = parseInt(lastProjectId.split('-')[1]);
      nextSerial = lastSerial + 1;
    }
    
    const serialNumber = nextSerial.toString().padStart(4, '0');
    const projectId = `${yearPrefix}-${serialNumber}`;
    
    console.log('생성된 project_id:', projectId);
    console.log('처리된 데이터:', {
      project_id: projectId,
      customer, name, description, sales_rep, proposal_pm,
      announce_date: processedAnnounceDate,
      submit_date: processedSubmitDate,
      presentation_date: processedPresentationDate,
      status: processedStatus
    });
    
    const [result] = await db.execute(
      'INSERT INTO projects (project_id, customer, name, description, sales_rep, proposal_pm, announce_date, submit_date, presentation_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [projectId, customer, name, description, sales_rep, proposal_pm, processedAnnounceDate, processedSubmitDate, processedPresentationDate, processedStatus]
    );
    res.json({ id: projectId, message: '프로젝트 등록 성공' });
  } catch (error) {
    console.error('프로젝트 등록 오류:', error);
    res.status(500).json({ error: '프로젝트 등록 실패' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, name, description, sales_rep, proposal_pm, announce_date, submit_date, presentation_date, status } = req.body;
    
    // status 값 검증
    const validStatuses = ['사전영업', '제안', '수주', '실주'];
    const processedStatus = validStatuses.includes(status) ? status : '사전영업';
    
    // 빈 날짜 문자열을 NULL로 변환
    const processedAnnounceDate = announce_date && announce_date.trim() !== '' ? announce_date : null;
    const processedSubmitDate = submit_date && submit_date.trim() !== '' ? submit_date : null;
    const processedPresentationDate = presentation_date && presentation_date.trim() !== '' ? presentation_date : null;
    
    await db.execute(
      'UPDATE projects SET customer=?, name=?, description=?, sales_rep=?, proposal_pm=?, announce_date=?, submit_date=?, presentation_date=?, status=? WHERE project_id=?',
      [customer, name, description, sales_rep, proposal_pm, processedAnnounceDate, processedSubmitDate, processedPresentationDate, processedStatus, id]
    );
    res.json({ message: '프로젝트 수정 성공' });
  } catch (error) {
    console.error('프로젝트 수정 오류:', error);
    res.status(500).json({ error: '프로젝트 수정 실패' });
  }
});

// 솔루션 API
app.get('/api/solutions', async (req, res) => {
  try {
    const { service_area, solution_type, solution_name } = req.query;
    
    // 검색 조건에 따른 WHERE 절 구성
    let whereConditions = [];
    let queryParams = [];
    
    if (service_area && service_area !== '__ALL__') {
      whereConditions.push('s.service_area LIKE ?');
      queryParams.push(`%${service_area}%`);
    }
    
    if (solution_type && solution_type !== '__ALL__') {
      whereConditions.push('s.solution_type LIKE ?');
      queryParams.push(`%${solution_type}%`);
    }
    
    if (solution_name) {
      whereConditions.push('s.solution_name LIKE ?');
      queryParams.push(`%${solution_name}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // 서비스영역 ID순서별로, 솔루션구분 이름순으로 정렬
    const query = `
      SELECT s.*, sa.id as service_area_id, sa.service_area as service_area_name
      FROM solutions s 
      LEFT JOIN solution_service_areas sa ON s.service_area = sa.service_area 
      ${whereClause}
      ORDER BY sa.id ASC, s.solution_type ASC
    `;
    
    console.log('실행할 쿼리:', query);
    console.log('쿼리 파라미터:', queryParams);
    
    const [rows] = await db.execute(query, queryParams);
    
    // 서비스영역별로 그룹화
    const groupedSolutions = {};
    rows.forEach(solution => {
      const serviceAreaId = solution.service_area_id || 0;
      const serviceAreaName = solution.service_area_name || solution.service_area || '기타';
      
      if (!groupedSolutions[serviceAreaId]) {
        groupedSolutions[serviceAreaId] = {
          service_area_id: serviceAreaId,
          service_area_name: serviceAreaName,
          solutions: []
        };
      }
      groupedSolutions[serviceAreaId].solutions.push(solution);
    });
    
    // 서비스영역 ID 순서대로 정렬된 배열로 변환
    const sortedGroups = Object.values(groupedSolutions).sort((a, b) => a.service_area_id - b.service_area_id);
    
    res.json({
      grouped: sortedGroups,
      flat: rows // 기존 호환성을 위한 평면 배열도 포함
    });
  } catch (error) {
    console.error('솔루션 목록 조회 오류:', error);
    res.status(500).json({ error: '솔루션 목록 조회 실패' });
  }
});

app.post('/api/solutions', async (req, res) => {
  try {
    const { 
      service_area, 
      solution_type, 
      solution_name, 
      license_policy, 
      vendor, 
      vendor_contact, 
      vendor_phone, 
      vendor_email, 
      supplier, 
      supplier_contact, 
      supplier_phone, 
      supplier_email, 
      remarks 
    } = req.body;
    
    // undefined를 null로 변환하는 함수
    const toNull = (value) => value === undefined || value === '' ? null : value;
    
    // solution_id 생성 (SOL-YYYY-NNNN 형태)
    const currentYear = new Date().getFullYear();
    const yearPrefix = currentYear.toString();
    
    // 해당 년도의 마지막 솔루션 번호 조회
    const [existingSolutions] = await db.execute(
      'SELECT solution_id FROM solutions WHERE solution_id LIKE ? ORDER BY solution_id DESC LIMIT 1',
      [`SOL-${yearPrefix}-%`]
    );
    
    let nextSerial = 1;
    if (existingSolutions.length > 0) {
      const lastSolutionId = existingSolutions[0].solution_id;
      const lastSerial = parseInt(lastSolutionId.split('-')[2]);
      nextSerial = lastSerial + 1;
    }
    
    const serialNumber = nextSerial.toString().padStart(4, '0');
    const solutionId = `SOL-${yearPrefix}-${serialNumber}`;
    
    const [result] = await db.execute(
      `INSERT INTO solutions (
        solution_id, service_area, solution_type, solution_name, license_policy,
        vendor, vendor_contact, vendor_phone, vendor_email,
        supplier, supplier_contact, supplier_phone, supplier_email, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        solutionId,
        toNull(service_area),
        toNull(solution_type),
        solution_name,
        toNull(license_policy),
        toNull(vendor),
        toNull(vendor_contact),
        toNull(vendor_phone),
        toNull(vendor_email),
        toNull(supplier),
        toNull(supplier_contact),
        toNull(supplier_phone),
        toNull(supplier_email),
        toNull(remarks)
      ]
    );
    
    res.json({ 
      solution_id: solutionId,
      service_area: toNull(service_area),
      solution_type: toNull(solution_type),
      solution_name,
      license_policy: toNull(license_policy),
      vendor: toNull(vendor),
      vendor_contact: toNull(vendor_contact),
      vendor_phone: toNull(vendor_phone),
      vendor_email: toNull(vendor_email),
      supplier: toNull(supplier),
      supplier_contact: toNull(supplier_contact),
      supplier_phone: toNull(supplier_phone),
      supplier_email: toNull(supplier_email),
      remarks: toNull(remarks)
    });
  } catch (error) {
    console.error('솔루션 등록 오류:', error);
    res.status(500).json({ error: '솔루션 등록 실패' });
  }
});

app.put('/api/solutions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      service_area, 
      solution_type, 
      solution_name, 
      license_policy, 
      vendor, 
      vendor_contact, 
      vendor_phone, 
      vendor_email, 
      supplier, 
      supplier_contact, 
      supplier_phone, 
      supplier_email, 
      remarks 
    } = req.body;
    
    // undefined를 null로 변환하는 함수
    const toNull = (value) => value === undefined || value === '' ? null : value;
    
    await db.execute(
      `UPDATE solutions SET 
        service_area=?, solution_type=?, solution_name=?, license_policy=?,
        vendor=?, vendor_contact=?, vendor_phone=?, vendor_email=?,
        supplier=?, supplier_contact=?, supplier_phone=?, supplier_email=?, remarks=?
      WHERE solution_id=?`,
      [
        toNull(service_area),
        toNull(solution_type),
        solution_name,
        toNull(license_policy),
        toNull(vendor),
        toNull(vendor_contact),
        toNull(vendor_phone),
        toNull(vendor_email),
        toNull(supplier),
        toNull(supplier_contact),
        toNull(supplier_phone),
        toNull(supplier_email),
        toNull(remarks),
        id
      ]
    );
    res.json({ message: '솔루션 수정 성공' });
  } catch (error) {
    console.error('솔루션 수정 오류:', error);
    res.status(500).json({ error: '솔루션 수정 실패' });
  }
});

app.delete('/api/solutions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM solutions WHERE solution_id = ?', [id]);
    res.json({ message: '솔루션 삭제 성공' });
  } catch (error) {
    console.error('솔루션 삭제 오류:', error);
    res.status(500).json({ error: '솔루션 삭제 실패' });
  }
});

// 서비스 영역 목록 조회 API
app.get('/api/service-areas', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM solution_service_areas ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('서비스 영역 목록 조회 오류:', error);
    res.status(500).json({ error: '서비스 영역 목록 조회 실패' });
  }
});

// 서비스영역 등록 API
app.post('/api/service-areas', async (req, res) => {
  try {
    const { service_area, description, example_solution } = req.body;
    
    if (!service_area) {
      return res.status(400).json({ error: '서비스영역명은 필수입니다.' });
    }
    
    await db.execute(
      'INSERT INTO solution_service_areas (service_area, description, example_solution) VALUES (?, ?, ?)',
      [service_area, description || null, example_solution || null]
    );
    
    res.json({ message: '서비스영역 등록 성공' });
  } catch (error) {
    console.error('서비스영역 등록 오류:', error);
    res.status(500).json({ error: '서비스영역 등록 실패' });
  }
});

// 서비스영역 수정 API
app.put('/api/service-areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { service_area, description, example_solution } = req.body;
    
    if (!service_area) {
      return res.status(400).json({ error: '서비스영역명은 필수입니다.' });
    }
    
    await db.execute(
      'UPDATE solution_service_areas SET service_area=?, description=?, example_solution=? WHERE id=?',
      [service_area, description || null, example_solution || null, id]
    );
    
    res.json({ message: '서비스영역 수정 성공' });
  } catch (error) {
    console.error('서비스영역 수정 오류:', error);
    res.status(500).json({ error: '서비스영역 수정 실패' });
  }
});

// 서비스영역 삭제 API
app.delete('/api/service-areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 해당 서비스영역을 사용하는 솔루션이 있는지 확인
    const [solutions] = await db.execute(
      'SELECT COUNT(*) as count FROM solutions WHERE service_area = (SELECT service_area FROM solution_service_areas WHERE id = ?)',
      [id]
    );
    
    if (solutions[0].count > 0) {
      return res.status(400).json({ 
        error: '이 서비스영역을 사용하는 솔루션이 있어 삭제할 수 없습니다.' 
      });
    }
    
    await db.execute('DELETE FROM solution_service_areas WHERE id = ?', [id]);
    res.json({ message: '서비스영역 삭제 성공' });
  } catch (error) {
    console.error('서비스영역 삭제 오류:', error);
    res.status(500).json({ error: '서비스영역 삭제 실패' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  connectDB();
}); 