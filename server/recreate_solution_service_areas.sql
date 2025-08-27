-- solution_service_areas 테이블 재생성 스크립트

-- 기존 테이블 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP TABLE IF EXISTS solution_service_areas;

-- 테이블 재생성
CREATE TABLE solution_service_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_area VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  example_solution VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 데이터 삽입 (선택사항)
INSERT INTO solution_service_areas (service_area, description, example_solution) VALUES
('인프라 구축', '서버, 네트워크, 스토리지 등 IT 인프라 구축 서비스', '클라우드 마이그레이션, 데이터센터 구축'),
('보안 솔루션', '정보보안 및 사이버 보안 솔루션', '방화벽, IDS/IPS, 보안관제'),
('데이터 관리', '데이터베이스 및 데이터 관리 솔루션', '데이터베이스 구축, 백업/복구, 데이터 분석'),
('업무 시스템', '기업 업무 효율화를 위한 시스템 구축', 'ERP, CRM, 그룹웨어'),
('모니터링', '시스템 및 서비스 모니터링 솔루션', 'APM, 로그 분석, 알림 시스템'),
('통합 관리', '다양한 시스템을 통합 관리하는 솔루션', 'ITSM, 통합 모니터링, 자동화');

-- 테이블 생성 확인
SELECT * FROM solution_service_areas; 