-- Hardware 테이블 컬럼 속성 변경 스크립트
-- cores 컬럼을 varchar(10)으로 변경
ALTER TABLE hardware MODIFY COLUMN cores VARCHAR(10);

-- memory 컬럼을 varchar(20)으로 변경
ALTER TABLE hardware MODIFY COLUMN memory VARCHAR(20);

-- os_disk 컬럼을 varchar(20)으로 변경
ALTER TABLE hardware MODIFY COLUMN os_disk VARCHAR(20);

-- internal_disk 컬럼을 varchar(20)으로 변경
ALTER TABLE hardware MODIFY COLUMN internal_disk VARCHAR(20);

-- shared_disk 컬럼을 varchar(20)으로 변경
ALTER TABLE hardware MODIFY COLUMN shared_disk VARCHAR(20);

-- nic_service 컬럼을 varchar(10)으로 변경
ALTER TABLE hardware MODIFY COLUMN nic_service VARCHAR(10);

-- nic_backup 컬럼을 varchar(10)으로 변경
ALTER TABLE hardware MODIFY COLUMN nic_backup VARCHAR(10);

-- 비고 컬럼 추가
ALTER TABLE hardware ADD COLUMN remarks TEXT;

-- 변경된 컬럼 구조 확인
DESCRIBE hardware; 