import React, { useState, useEffect } from "react";
import { hardwareAPI, getProjectList } from '../services/api';

function HardwareManager({ currentView = 'list', onViewChange }) {
  const [hardwareList, setHardwareList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [serverNameFilter, setServerNameFilter] = useState('');
  const [form, setForm] = useState({ 
    project_id: "", 
    work_name: "", 
    purpose: "", 
    os: "", 
    server_name: "", 
    server_type: "", 
    cores: "", 
    memory: "", 
    os_disk: "", 
    internal_disk: "", 
    shared_disk: "", 
    nic_service_25g_fc_2p: "", 
    nic_backup_25g_fc_2p: "",
    nic_service_10g_fc_2p: "",
    nic_backup_10g_fc_2p: "",
    nic_rac_10g_fc_2p: "",
    nic_gpfs_10g_fc_2p: "",
    hba_32g_fc_2p: "",
    remarks: ""
  });
  const [editForm, setEditForm] = useState({ 
    project_id: "", 
    hardware_id: null, 
    work_name: "", 
    purpose: "", 
    os: "", 
    server_name: "", 
    server_type: "", 
    cores: "", 
    memory: "", 
    os_disk: "", 
    internal_disk: "", 
    shared_disk: "", 
    nic_service_25g_fc_2p: "", 
    nic_backup_25g_fc_2p: "",
    nic_service_10g_fc_2p: "",
    nic_backup_10g_fc_2p: "",
    nic_rac_10g_fc_2p: "",
    nic_gpfs_10g_fc_2p: "",
    hba_32g_fc_2p: "",
    remarks: ""
  });
  const [loading, setLoading] = useState(false);
  // 정렬 상태 추가
  const [sortConfig, setSortConfig] = useState({ key: 'hardware_id', direction: 'asc' });
  // 수정화면용 상태 추가
  const [editHardwareList, setEditHardwareList] = useState([]);
  const [selectedHardwareForEdit, setSelectedHardwareForEdit] = useState(null);
  // 삭제화면용 상태 추가
  const [deleteHardwareList, setDeleteHardwareList] = useState([]);
  const [selectedHardwareForDelete, setSelectedHardwareForDelete] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState('');

  // 하드웨어 목록 로드
  const loadHardwareList = async () => {
    try {
      setLoading(true);
      const data = await hardwareAPI.getHardwareList();
      setHardwareList(data);
    } catch (error) {
      console.error('하드웨어 목록 로드 실패:', error);
      alert('하드웨어 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 목록 로드
  const loadProjectList = async () => {
    try {
      const data = await getProjectList();
      setProjectList(data);
    } catch (error) {
      console.error('프로젝트 목록 로드 실패:', error);
      alert('프로젝트 목록을 불러오는데 실패했습니다.');
    }
  };

  // 수정화면용 프로젝트별 하드웨어 목록 로드
  const loadEditHardwareList = async (projectId) => {
    if (!projectId) {
      setEditHardwareList([]);
      return;
    }
    
    try {
      setLoading(true);
      const allHardware = await hardwareAPI.getHardwareList();
      const filteredHardware = allHardware.filter(hw => hw.project_id === projectId);
      
      // 하드웨어ID 기준 오름차순 정렬
      const sortedHardware = filteredHardware.sort((a, b) => {
        const aId = parseInt(a.hardware_id) || 0;
        const bId = parseInt(b.hardware_id) || 0;
        return aId - bId;
      });
      
      setEditHardwareList(sortedHardware);
    } catch (error) {
      console.error('하드웨어 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 삭제화면용 프로젝트별 하드웨어 목록 로드
  const loadDeleteHardwareList = async (projectId) => {
    if (!projectId) {
      setDeleteHardwareList([]);
      return;
    }
    
    try {
      setLoading(true);
      const allHardware = await hardwareAPI.getHardwareList();
      const filteredHardware = allHardware.filter(hw => hw.project_id === projectId);
      
      // 하드웨어ID 기준 오름차순 정렬
      const sortedHardware = filteredHardware.sort((a, b) => {
        const aId = parseInt(a.hardware_id) || 0;
        const bId = parseInt(b.hardware_id) || 0;
        return aId - bId;
      });
      
      setDeleteHardwareList(sortedHardware);
    } catch (error) {
      console.error('하드웨어 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 하드웨어 목록 초기화
    setHardwareList([]);
    setSelectedProjectId('');
    setSortConfig({ key: null, direction: 'asc' });
    
    // 프로젝트 목록만 로드
    loadProjectList();
  }, []);

  // 정렬 및 필터링 함수
  const sortedList = React.useMemo(() => {
    if (!hardwareList) return [];
    
    // 프로젝트가 선택되지 않았으면 빈 배열 반환
    if (!selectedProjectId) {
      return [];
    }
    
    // 프로젝트 필터링
    let filtered = [...hardwareList];
    filtered = filtered.filter(hw => hw.project_id === selectedProjectId);
    
    // 서버명 필터링
    if (serverNameFilter.trim()) {
      filtered = filtered.filter(hw => 
        hw.server_name && hw.server_name.toLowerCase().includes(serverNameFilter.toLowerCase())
      );
    }
    
    // 정렬
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // 날짜 정렬
        if (sortConfig.key === 'created_at') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        // 하드웨어ID는 숫자로 정렬
        else if (sortConfig.key === 'hardware_id' || sortConfig.key === 'cores') {
          aValue = parseInt(aValue) || 0;
          bValue = parseInt(bValue) || 0;
        }
        // 문자열 정렬(대소문자 무시)
        else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [hardwareList, sortConfig, selectedProjectId, serverNameFilter]);

  // 헤더 클릭 시 정렬 토글
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // 하드웨어ID는 기본적으로 오름차순으로 시작
        return { key, direction: 'asc' };
      }
    });
  };

  // 엑셀 다운로드 기능 (HTML 테이블 방식)
  const handleExcelDownload = () => {
    if (sortedList.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    try {
      // 선택된 프로젝트 정보 가져오기
      const selectedProject = projectList.find(p => p.project_id === selectedProjectId);
      
      // HTML 테이블 생성 (스타일링 포함)
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      
      // 제목 행
      const titleRow = table.insertRow();
      const titleCell = titleRow.insertCell();
      titleCell.textContent = 'Matrix System - 하드웨어 관리 현황';
      titleCell.colSpan = 14;
      titleCell.style.textAlign = 'center';
      titleCell.style.fontWeight = 'bold';
      titleCell.style.fontSize = '16px';
      titleCell.style.padding = '10px';
      titleCell.style.backgroundColor = '#f8f9fa';
      titleCell.style.border = '1px solid #dee2e6';
      
      // 프로젝트 정보 행
      const projectRow = table.insertRow();
      const projectCell = projectRow.insertCell();
      projectCell.textContent = selectedProject 
        ? `프로젝트: ${selectedProject.project_id} - ${selectedProject.customer} (${selectedProject.name})`
        : '전체 프로젝트';
      projectCell.colSpan = 14;
      projectCell.style.fontWeight = 'bold';
      projectCell.style.padding = '5px';
      projectCell.style.border = '1px solid #dee2e6';
      
      // 요약 행
      const summaryRow = table.insertRow();
      const summaryCell = summaryRow.insertCell();
      summaryCell.textContent = `총 하드웨어 수: ${sortedList.length}개`;
      summaryCell.colSpan = 14;
      summaryCell.style.fontWeight = 'bold';
      summaryCell.style.padding = '5px';
      summaryCell.style.border = '1px solid #dee2e6';
      
      // 빈 행
      const emptyRow = table.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 14;
      emptyCell.style.height = '10px';
      emptyCell.style.border = 'none';
      
      // 헤더 추가
      const headers = ['업무명', '용도', 'OS', '서버명', '서버구분', 'Core수', '메모리(GB)', 'OS디스크(GB)', '내장디스크(GB)', '공유디스크(GB)', 'NIC(서비스)', 'NIC(백업) 25G FC Type 2port 기준수량'];
      
      // 데이터 준비
      const data = sortedList.map(hw => [
        hw.hardware_id,
        hw.work_name || '',
        hw.purpose || '',
        hw.os || '',
        hw.server_name || '',
        hw.server_type || '',
        hw.cores || '',
        hw.memory || '',
        hw.os_disk || '',
        hw.internal_disk || '',
        hw.shared_disk || '',
        hw.nic_service || '',
        hw.nic_backup || '',
        new Date(hw.created_at).toLocaleDateString('ko-KR')
      ]);
      
      // 헤더 행
      const headerRow = table.insertRow();
      headers.forEach(header => {
        const cell = headerRow.insertCell();
        cell.textContent = header;
        cell.style.backgroundColor = '#E9ECEF';
        cell.style.fontWeight = 'bold';
        cell.style.textAlign = 'center';
        cell.style.padding = '8px';
        cell.style.border = '1px solid #dee2e6';
      });
      
      // 데이터 행
      data.forEach(row => {
        const rowElement = table.insertRow();
        row.forEach((value, index) => {
          const cell = rowElement.insertCell();
          cell.textContent = value;
          cell.style.textAlign = 'center';
          cell.style.padding = '6px';
          cell.style.border = '1px solid #dee2e6';
          
          // Core수 컬럼은 숫자 컬럼이므로 오른쪽 정렬
          if (index === 6) { // Core수 컬럼
            cell.style.textAlign = 'right';
          }
        });
      });
      
      // 엑셀로 다운로드
      const html = table.outerHTML;
      const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `하드웨어목록_${selectedProject ? selectedProject.project_id : '전체'}_${new Date().toISOString().split('T')[0]}.xls`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    
    // 프로젝트가 변경되면 해당 프로젝트의 하드웨어 목록 로드
    if (name === 'project_id') {
      loadEditHardwareList(value);
      setSelectedHardwareForEdit(null); // 기존 선택 초기화
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project_id) {
      alert('프로젝트는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      await hardwareAPI.createHardware(form);
      setForm({ 
        project_id: "", 
        work_name: "", 
        purpose: "", 
        os: "", 
        server_name: "", 
        server_type: "", 
        cores: "", 
        memory: "", 
        os_disk: "", 
        internal_disk: "", 
        shared_disk: "", 
        nic_service: "", 
        nic_backup: "" 
      });
      loadHardwareList();
      alert('하드웨어가 성공적으로 등록되었습니다.');
      onViewChange('list');
    } catch (error) {
      console.error('하드웨어 등록 실패:', error);
      alert('하드웨어 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.project_id) {
      alert('프로젝트는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      await hardwareAPI.updateHardware(editForm.project_id, editForm.hardware_id, editForm);
      setEditForm({ 
        project_id: "", 
        hardware_id: null, 
        work_name: "", 
        purpose: "", 
        os: "", 
        server_name: "", 
        server_type: "", 
        cores: "", 
        memory: "", 
        os_disk: "", 
        internal_disk: "", 
        shared_disk: "", 
        nic_service: "", 
        nic_backup: "" 
      });
      loadHardwareList();
      alert('하드웨어가 성공적으로 수정되었습니다.');
      onViewChange('list');
    } catch (error) {
      console.error('하드웨어 수정 실패:', error);
      alert('하드웨어 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId, hardwareId) => {
    if (!confirm('정말로 이 하드웨어를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      await hardwareAPI.deleteHardware(projectId, hardwareId);
      loadHardwareList();
      alert('하드웨어가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('하드웨어 삭제 실패:', error);
      alert('하드웨어 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (hardware) => {
    setEditForm({
      project_id: hardware.project_id,
      hardware_id: hardware.hardware_id,
      work_name: hardware.work_name || "",
      purpose: hardware.purpose || "",
      os: hardware.os || "",
      server_name: hardware.server_name || "",
      server_type: hardware.server_type || "",
      cores: hardware.cores || "",
      memory: hardware.memory || "",
      os_disk: hardware.os_disk || "",
      internal_disk: hardware.internal_disk || "",
      shared_disk: hardware.shared_disk || "",
      nic_service: hardware.nic_service || "",
      nic_backup: hardware.nic_backup || "",
      remarks: hardware.remarks || ""
    });
    // 수정화면에서 직접 호출될 때는 하드웨어 목록도 로드
    if (currentView === 'edit') {
      loadEditHardwareList(hardware.project_id);
      setSelectedHardwareForEdit(hardware);
    }
    onViewChange('edit');
  };

  // 수정화면에서 하드웨어 선택
  const selectHardwareForEdit = (hardware) => {
    setEditForm({
      project_id: hardware.project_id,
      hardware_id: hardware.hardware_id,
      work_name: hardware.work_name || "",
      purpose: hardware.purpose || "",
      os: hardware.os || "",
      server_name: hardware.server_name || "",
      server_type: hardware.server_type || "",
      cores: hardware.cores || "",
      memory: hardware.memory || "",
      os_disk: hardware.os_disk || "",
      internal_disk: hardware.internal_disk || "",
      shared_disk: hardware.shared_disk || "",
      nic_service_25g_fc_2p: hardware.nic_service_25g_fc_2p || "",
      nic_backup_25g_fc_2p: hardware.nic_backup_25g_fc_2p || "",
      nic_service_10g_fc_2p: hardware.nic_service_10g_fc_2p || "",
      nic_backup_10g_fc_2p: hardware.nic_backup_10g_fc_2p || "",
      nic_rac_10g_fc_2p: hardware.nic_rac_10g_fc_2p || "",
      nic_gpfs_10g_fc_2p: hardware.nic_gpfs_10g_fc_2p || "",
      hba_32g_fc_2p: hardware.hba_32g_fc_2p || "",
      remarks: hardware.remarks || ""
    });
    setSelectedHardwareForEdit(hardware);
  };

  // 삭제화면에서 하드웨어 선택
  const selectHardwareForDelete = (hardware) => {
    setEditForm({
      project_id: hardware.project_id,
      hardware_id: hardware.hardware_id,
      work_name: hardware.work_name || "",
      purpose: hardware.purpose || "",
      os: hardware.os || "",
      server_name: hardware.server_name || "",
      server_type: hardware.server_type || "",
      cores: hardware.cores || "",
      memory: hardware.memory || "",
      os_disk: hardware.os_disk || "",
      internal_disk: hardware.internal_disk || "",
      shared_disk: hardware.shared_disk || "",
      nic_service_25g_fc_2p: hardware.nic_service_25g_fc_2p || "",
      nic_backup_25g_fc_2p: hardware.nic_backup_25g_fc_2p || "",
      nic_service_10g_fc_2p: hardware.nic_service_10g_fc_2p || "",
      nic_backup_10g_fc_2p: hardware.nic_backup_10g_fc_2p || "",
      nic_rac_10g_fc_2p: hardware.nic_rac_10g_fc_2p || "",
      nic_gpfs_10g_fc_2p: hardware.nic_gpfs_10g_fc_2p || "",
      hba_32g_fc_2p: hardware.hba_32g_fc_2p || "",
      remarks: hardware.remarks || ""
    });
    setSelectedHardwareForDelete(hardware);
  };

  const startDelete = (hardware) => {
    setEditForm({
      project_id: hardware.project_id,
      hardware_id: hardware.hardware_id,
      work_name: hardware.work_name || "",
      purpose: hardware.purpose || "",
      os: hardware.os || "",
      server_name: hardware.server_name || "",
      server_type: hardware.server_type || "",
      cores: hardware.cores || "",
      memory: hardware.memory || "",
      os_disk: hardware.os_disk || "",
      internal_disk: hardware.internal_disk || "",
      shared_disk: hardware.shared_disk || "",
      nic_service_25g_fc_2p: hardware.nic_service_25g_fc_2p || "",
      nic_backup_25g_fc_2p: hardware.nic_backup_25g_fc_2p || "",
      nic_service_10g_fc_2p: hardware.nic_service_10g_fc_2p || "",
      nic_backup_10g_fc_2p: hardware.nic_backup_10g_fc_2p || "",
      nic_rac_10g_fc_2p: hardware.nic_rac_10g_fc_2p || "",
      nic_gpfs_10g_fc_2p: hardware.nic_gpfs_10g_fc_2p || "",
      hba_32g_fc_2p: hardware.hba_32g_fc_2p || "",
      remarks: hardware.remarks || ""
    });
    onViewChange('delete');
  };

  // 취소 함수 추가
  const handleCancel = () => {
    console.log('취소 함수 실행됨');
    onViewChange('list');
    setEditForm({ 
      project_id: "", 
      hardware_id: null, 
      work_name: "", 
      purpose: "", 
      os: "", 
      server_name: "", 
      server_type: "", 
      cores: "", 
      memory: "", 
      os_disk: "", 
      internal_disk: "", 
      shared_disk: "", 
      nic_service_25g_fc_2p: "", 
      nic_backup_25g_fc_2p: "",
      nic_service_10g_fc_2p: "",
      nic_backup_10g_fc_2p: "",
      nic_rac_10g_fc_2p: "",
      nic_gpfs_10g_fc_2p: "",
      hba_32g_fc_2p: "",
      remarks: ""
    });
  };

  // 템플릿 다운로드
  const handleTemplateDownload = () => {
    const headers = [
      '프로젝트ID', '업무명', '용도', 'OS', '서버명', '서버타입', 'CPU코어', '메모리', 'OS디스크', '내장디스크', '공유디스크', 
      'NIC(서비스)25G FC', 'NIC(백업)25G FC', 'NIC(서비스)10G FC', 'NIC(백업)10G FC', 'NIC(RAC)10G FC', 'NIC(GPFS)10G FC', 'HBA 32G FC'
    ];
    
    // BOM 추가 및 샘플 데이터 포함
    const bom = '\uFEFF';
    const sampleData = [
      'P001', '웹서버', '웹서비스', 'Windows Server 2019', 'WEB-SRV-01', 'VM', '4', '8GB', '100GB', '500GB', '', 
      '2', '1', '1', '1', '1', '1', '2'
    ];
    
    const csvContent = bom + headers.join(',') + '\n' + sampleData.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '하드웨어_등록_템플릿.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV 파일 업로드 및 파싱
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 확장자 검증
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('CSV 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        
        // BOM 제거
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1);
        }
        
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          alert('CSV 파일에 데이터가 없습니다.');
          return;
        }
        
        const headers = lines[0].split(',').map(header => header.trim());
        const expectedHeaders = [
          '프로젝트ID', '업무명', '용도', 'OS', '서버명', '서버타입', 'CPU코어', '메모리', 'OS디스크', '내장디스크', '공유디스크', 
          'NIC(서비스)25G FC', 'NIC(백업)25G FC', 'NIC(서비스)10G FC', 'NIC(백업)10G FC', 'NIC(RAC)10G FC', 'NIC(GPFS)10G FC', 'HBA 32G FC'
        ];
        
        // 헤더 검증
        if (headers.length !== expectedHeaders.length) {
          alert(`CSV 파일의 컬럼 수가 맞지 않습니다. (예상: ${expectedHeaders.length}, 실제: ${headers.length})`);
          return;
        }
        
        const hardwareData = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(value => value.trim());
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            hardwareData.push(row);
          }
        }
        
        // CSV 데이터를 하드웨어 목록에 추가
        if (hardwareData.length > 0) {
          const newHardwareList = hardwareData.map((item, index) => ({
            project_id: item['프로젝트ID'] || '',
            work_name: item['업무명'] || '',
            purpose: item['용도'] || '',
            os: item['OS'] || '',
            server_name: item['서버명'] || '',
            server_type: item['서버타입'] || '',
            cores: item['CPU코어'] || '',
            memory: item['메모리'] || '',
            os_disk: item['OS디스크'] || '',
            internal_disk: item['내장디스크'] || '',
            shared_disk: item['공유디스크'] || '',
            nic_service_25g_fc_2p: item['NIC(서비스)25G FC'] || '',
            nic_backup_25g_fc_2p: item['NIC(백업)25G FC'] || '',
            nic_service_10g_fc_2p: item['NIC(서비스)10G FC'] || '',
            nic_backup_10g_fc_2p: item['NIC(백업)10G FC'] || '',
            nic_rac_10g_fc_2p: item['NIC(RAC)10G FC'] || '',
            nic_gpfs_10g_fc_2p: item['NIC(GPFS)10G FC'] || '',
            hba_32g_fc_2p: item['HBA 32G FC'] || ''
          }));
          
          // 기존 하드웨어 목록에 추가
          setHardwareList(prev => [...prev, ...newHardwareList]);
          alert(`${hardwareData.length}건의 하드웨어가 일괄 등록되었습니다.`);
        } else {
          alert('업로드된 CSV 파일에 유효한 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('CSV 파싱 오류:', error);
        alert('CSV 파일 처리 중 오류가 발생했습니다.');
      }
    };
    
    reader.onerror = () => {
      alert('파일 읽기 중 오류가 발생했습니다.');
    };
    
    reader.readAsText(file, 'UTF-8');
    
    // 파일 입력 초기화
    event.target.value = '';
  };

  // 등록 함수 추가
  const handleAdd = async () => {
    if (!form.project_id) {
      alert('프로젝트는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      await hardwareAPI.createHardware(form);
      setForm({ 
        project_id: "", 
        work_name: "", 
        purpose: "", 
        os: "", 
        server_name: "", 
        server_type: "", 
        cores: "", 
        memory: "", 
        os_disk: "", 
        internal_disk: "", 
        shared_disk: "", 
        nic_service_25g_fc_2p: "", 
        nic_backup_25g_fc_2p: "",
        nic_service_10g_fc_2p: "",
        nic_backup_10g_fc_2p: "",
        nic_rac_10g_fc_2p: "",
        nic_gpfs_10g_fc_2p: "",
        hba_32g_fc_2p: "",
        remarks: ""
      });
      loadHardwareList();
      alert('하드웨어가 성공적으로 등록되었습니다.');
      onViewChange('list');
    } catch (error) {
      console.error('하드웨어 등록 실패:', error);
      alert('하드웨어 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 삭제 함수 추가
  const handleDeleteConfirm = async () => {
    if (!confirm('정말로 이 하드웨어를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      await hardwareAPI.deleteHardware(editForm.project_id, editForm.hardware_id);
      loadHardwareList();
      alert('하드웨어가 성공적으로 삭제되었습니다.');
      onViewChange('list');
      setEditForm({ 
        project_id: "", 
        hardware_id: null, 
        work_name: "", 
        purpose: "", 
        os: "", 
        server_name: "", 
        server_type: "", 
        cores: "", 
        memory: "", 
        os_disk: "", 
        internal_disk: "", 
        shared_disk: "", 
        nic_service_25g_fc_2p: "", 
        nic_backup_25g_fc_2p: "",
        nic_service_10g_fc_2p: "",
        nic_backup_10g_fc_2p: "",
        nic_rac_10g_fc_2p: "",
        nic_gpfs_10g_fc_2p: "",
        hba_32g_fc_2p: "",
        remarks: ""
      });
    } catch (error) {
      console.error('하드웨어 삭제 실패:', error);
      alert('하드웨어 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 목록 조회 화면
  const renderListView = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>하드웨어 목록조회</h3>
          <button
            onClick={handleExcelDownload}
            disabled={!selectedProjectId}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedProjectId ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedProjectId ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              opacity: selectedProjectId ? 1 : 0.6
            }}
          >
            📊 엑셀 다운로드
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
            프로젝트:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              const projectId = e.target.value;
              setSelectedProjectId(projectId);
              setServerNameFilter(''); // 프로젝트 변경 시 서버명 필터 초기화
              
              if (projectId) {
                // 프로젝트가 선택된 경우에만 하드웨어 목록 로드
                loadHardwareList();
              } else {
                // 프로젝트가 선택되지 않은 경우 하드웨어 목록 초기화
                setHardwareList([]);
              }
              
              // 프로젝트 변경 시 하드웨어ID 오름차순으로 정렬 초기화
              setSortConfig({ key: 'hardware_id', direction: 'asc' });
            }}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            <option value="">프로젝트를 선택하세요</option>
            {projectList.map(project => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_id} - {project.customer} ({project.name})
              </option>
            ))}
          </select>
          {selectedProjectId && (
            <>
              <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '20px' }}>
                서버명 검색:
              </label>
              <input
                type="text"
                placeholder="서버명을 입력하세요"
                value={serverNameFilter}
                onChange={(e) => setServerNameFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              />
            </>
          )}
        </div>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div style={{ overflowX: 'auto', maxWidth: '100%', border: '1px solid #ddd' }}>
          <table style={{
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
            marginTop: '10px',
            tableLayout: 'fixed',
            width: '1710px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>

                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px'
                }} onClick={() => handleSort('work_name')}>
                  업무명 {sortConfig.key === 'work_name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px'
                }} onClick={() => handleSort('purpose')}>
                  용도 {sortConfig.key === 'purpose' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '150px',
                  minWidth: '150px',
                  maxWidth: '150px'
                }} onClick={() => handleSort('server_name')}>
                  서버명 {sortConfig.key === 'server_name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '50px',
                  minWidth: '50px',
                  maxWidth: '50px'
                }} onClick={() => handleSort('cores')}>
                  Core수 {sortConfig.key === 'cores' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '50px',
                  minWidth: '50px',
                  maxWidth: '50px'
                }} onClick={() => handleSort('memory')}>
                  메모리<br />(GB) {sortConfig.key === 'memory' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '60px',
                  minWidth: '60px',
                  maxWidth: '60px'
                }} onClick={() => handleSort('os')}>
                  OS {sortConfig.key === 'os' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '60px',
                  minWidth: '60px',
                  maxWidth: '60px'
                }} onClick={() => handleSort('server_type')}>
                  서버구분 {sortConfig.key === 'server_type' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px'
                }} onClick={() => handleSort('os_disk')}>
                  OS디스크<br />(GB) {sortConfig.key === 'os_disk' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px'
                }} onClick={() => handleSort('internal_disk')}>
                  내장디스크<br />(GB) {sortConfig.key === 'internal_disk' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px'
                }} onClick={() => handleSort('shared_disk')}>
                  공유디스크<br />(GB) {sortConfig.key === 'shared_disk' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_service_25g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(서비스)</div>
                    <div>25G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_service_25g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_backup_25g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(백업)</div>
                    <div>25G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_backup_25g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_service_10g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(서비스)</div>
                    <div>10G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_service_10g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_backup_10g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(백업)</div>
                    <div>10G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_backup_10g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_rac_10g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(RAC)</div>
                    <div>10G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_rac_10g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('nic_gpfs_10g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>NIC(GPFS)</div>
                    <div>10G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'nic_gpfs_10g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px'
                }} onClick={() => handleSort('hba_32g_fc_2p')}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div>HBA</div>
                    <div>32G FC Type</div>
                    <div>2port 기준수량</div>
                  </div>
                  {sortConfig.key === 'hba_32g_fc_2p' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: '200px',
                  minWidth: '200px',
                  maxWidth: '200px'
                }} onClick={() => handleSort('remarks')}>
                  비고 {sortConfig.key === 'remarks' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>

              </tr>
            </thead>
            <tbody>
              {sortedList.length === 0 ? (
                <tr>
                  <td colSpan="16" style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    {!selectedProjectId 
                      ? '프로젝트를 선택하면 하드웨어 목록이 표시됩니다.' 
                      : '선택된 프로젝트에 등록된 하드웨어가 없습니다.'
                    }
                  </td>
                </tr>
              ) : (
                sortedList.map((hw) => (
                  <tr key={`${hw.project_id}-${hw.hardware_id}`} style={{ backgroundColor: 'white' }}>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '80px',
                      minWidth: '80px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.work_name || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '80px',
                      minWidth: '80px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.purpose || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '150px',
                      minWidth: '150px',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.server_name || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '50px',
                      minWidth: '50px',
                      maxWidth: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.cores || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '50px',
                      minWidth: '50px',
                      maxWidth: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.memory || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '60px',
                      minWidth: '60px',
                      maxWidth: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.os || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '60px',
                      minWidth: '60px',
                      maxWidth: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.server_type || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '80px',
                      minWidth: '80px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.os_disk || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '80px',
                      minWidth: '80px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.internal_disk || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '80px',
                      minWidth: '80px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.shared_disk || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_service_25g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_backup_25g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_service_10g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_backup_10g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_rac_10g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.nic_gpfs_10g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '120px',
                      minWidth: '120px',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.hba_32g_fc_2p || '-'}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '200px',
                      minWidth: '200px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{hw.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 등록 화면
  const renderAddView = () => (
    <div style={{ maxWidth: '100%', overflow: 'hidden', padding: '0 10px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ textAlign: 'left', margin: 0 }}>하드웨어 등록</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleTemplateDownload}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📥 템플릿 다운로드
          </button>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="csvFileInput"
            />
            <label
              htmlFor="csvFileInput"
              style={{
                padding: '8px 16px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'inline-block'
              }}
            >
              📤 CSV 일괄등록
            </label>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '100%', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
            프로젝트 *
          </label>
          <select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">프로젝트를 선택하세요</option>
            {projectList.map(project => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_id} - {project.customer} ({project.name})
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              업무명
            </label>
            <input
              name="work_name"
              placeholder="업무명을 입력하세요"
              value={form.work_name}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              용도
            </label>
            <input
              name="purpose"
              placeholder="용도를 입력하세요"
              value={form.purpose}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              OS
            </label>
            <input
              name="os"
              placeholder="운영체제를 입력하세요"
              value={form.os}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              서버명
            </label>
            <input
              name="server_name"
              placeholder="서버명을 입력하세요"
              value={form.server_name}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              서버구분
            </label>
            <input
              name="server_type"
              placeholder="서버구분을 입력하세요"
              value={form.server_type}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              Core수
            </label>
            <input
              name="cores"
              placeholder="Core수를 입력하세요"
              value={form.cores}
              onChange={handleChange}
              disabled={loading}
              type="number"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              메모리
            </label>
            <input
              name="memory"
              placeholder="메모리를 입력하세요"
              value={form.memory}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              OS디스크
            </label>
            <input
              name="os_disk"
              placeholder="OS디스크"
              value={form.os_disk}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              내장디스크
            </label>
            <input
              name="internal_disk"
              placeholder="내장디스크"
              value={form.internal_disk}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              공유디스크
            </label>
            <input
              name="shared_disk"
              placeholder="공유디스크"
              value={form.shared_disk}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(서비스) 25G FC
            </label>
            <input
              name="nic_service_25g_fc_2p"
              placeholder="NIC(서비스) 25G FC를 입력하세요"
              value={form.nic_service_25g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(백업) 25G FC
            </label>
            <input
              name="nic_backup_25g_fc_2p"
              placeholder="NIC(백업) 25G FC를 입력하세요"
              value={form.nic_backup_25g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(서비스) 10G FC
            </label>
            <input
              name="nic_service_10g_fc_2p"
              placeholder="NIC(서비스) 10G FC를 입력하세요"
              value={form.nic_service_10g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(백업) 10G FC
            </label>
            <input
              name="nic_backup_10g_fc_2p"
              placeholder="NIC(백업) 10G FC를 입력하세요"
              value={form.nic_backup_10g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(RAC) 10G FC
            </label>
            <input
              name="nic_rac_10g_fc_2p"
              placeholder="NIC(RAC) 10G FC를 입력하세요"
              value={form.nic_rac_10g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(GPFS) 10G FC
            </label>
            <input
              name="nic_gpfs_10g_fc_2p"
              placeholder="NIC(GPFS) 10G FC를 입력하세요"
              value={form.nic_gpfs_10g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              HBA 32G FC
            </label>
            <input
              name="hba_32g_fc_2p"
              placeholder="HBA 32G FC를 입력하세요"
              value={form.hba_32g_fc_2p}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              비고
            </label>
            <textarea
              name="remarks"
              placeholder="비고를 입력하세요"
              value={form.remarks}
              onChange={handleChange}
              disabled={loading}
              rows="3"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </form>
      
      {/* 등록 및 취소 버튼을 form 밖으로 이동 */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '등록 중...' : '등록'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          취소
        </button>
      </div>
    </div>
  );

  // 수정 화면
    const renderEditView = () => (
    <div style={{ maxWidth: '100%', overflow: 'hidden', padding: '0 10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'left' }}>하드웨어 수정</h3>
      </div>
      <form onSubmit={handleEdit} style={{ maxWidth: '100%', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
            프로젝트 *
          </label>
          <select
            name="project_id"
            value={editForm.project_id}
            onChange={handleEditChange}
            required
            disabled={loading}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">프로젝트를 선택하세요</option>
            {projectList.map(project => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_id} - {project.customer} ({project.name})
              </option>
            ))}
          </select>
        </div>
        
        {/* 선택된 프로젝트의 하드웨어 목록 */}
        {editForm.project_id && editHardwareList.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
              등록된 하드웨어 목록 (클릭하여 수정)
            </h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>수정대상</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>업무명</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>용도</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>서버명</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>Core수</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>메모리</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>OS</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>서버구분</th>
                  </tr>
                </thead>
                <tbody>
                  {editHardwareList.map((hw) => (
                    <tr 
                      key={`${hw.project_id}-${hw.hardware_id}`}
                      style={{ 
                        backgroundColor: selectedHardwareForEdit?.hardware_id === hw.hardware_id ? '#e3f2fd' : 'white'
                      }}
                    >
                      <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                        <input
                          type="radio"
                          name="editTarget"
                          value={`${hw.project_id}-${hw.hardware_id}`}
                          checked={selectedHardwareForEdit?.hardware_id === hw.hardware_id}
                          onChange={() => selectHardwareForEdit(hw)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                        {hw.work_name || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                        {hw.purpose || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                        {hw.server_name || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                        {hw.cores || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                        {hw.memory || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                        {hw.os || '-'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                        {hw.server_type || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {editForm.project_id && editHardwareList.length === 0 && !loading && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            textAlign: 'center',
            color: '#666'
          }}>
            선택된 프로젝트에 등록된 하드웨어가 없습니다.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              업무명
            </label>
            <input
              name="work_name"
              placeholder="업무명을 입력하세요"
              value={editForm.work_name}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              용도
            </label>
            <input
              name="purpose"
              placeholder="용도를 입력하세요"
              value={editForm.purpose}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              OS
            </label>
            <input
              name="os"
              placeholder="운영체제를 입력하세요"
              value={editForm.os}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              서버명
            </label>
            <input
              name="server_name"
              placeholder="서버명을 입력하세요"
              value={editForm.server_name}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              서버구분
            </label>
            <input
              name="server_type"
              placeholder="서버구분을 입력하세요"
              value={editForm.server_type}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                maxWidth: '400px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              Core수
            </label>
            <input
              name="cores"
              placeholder="Core수를 입력하세요"
              value={editForm.cores}
              onChange={handleEditChange}
              disabled={loading}
              type="number"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              메모리
            </label>
            <input
              name="memory"
              placeholder="메모리를 입력하세요"
              value={editForm.memory}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                maxWidth: '400px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              OS디스크
            </label>
            <input
              name="os_disk"
              placeholder="OS디스크"
              value={editForm.os_disk}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              내장디스크
            </label>
            <input
              name="internal_disk"
              placeholder="내장디스크"
              value={editForm.internal_disk}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', minWidth: '70px' }}>
              공유디스크
            </label>
            <input
              name="shared_disk"
              placeholder="공유디스크"
              value={editForm.shared_disk}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(서비스) 25G FC
            </label>
            <input
              name="nic_service_25g_fc_2p"
              placeholder="NIC(서비스) 25G FC를 입력하세요"
              value={editForm.nic_service_25g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(백업) 25G FC
            </label>
            <input
              name="nic_backup_25g_fc_2p"
              placeholder="NIC(백업) 25G FC를 입력하세요"
              value={editForm.nic_backup_25g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(서비스) 10G FC
            </label>
            <input
              name="nic_service_10g_fc_2p"
              placeholder="NIC(서비스) 10G FC를 입력하세요"
              value={editForm.nic_service_10g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(백업) 10G FC
            </label>
            <input
              name="nic_backup_10g_fc_2p"
              placeholder="NIC(백업) 10G FC를 입력하세요"
              value={editForm.nic_backup_10g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(RAC) 10G FC
            </label>
            <input
              name="nic_rac_10g_fc_2p"
              placeholder="NIC(RAC) 10G FC를 입력하세요"
              value={editForm.nic_rac_10g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              NIC(GPFS) 10G FC
            </label>
            <input
              name="nic_gpfs_10g_fc_2p"
              placeholder="NIC(GPFS) 10G FC를 입력하세요"
              value={editForm.nic_gpfs_10g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              HBA 32G FC
            </label>
            <input
              name="hba_32g_fc_2p"
              placeholder="HBA 32G FC를 입력하세요"
              value={editForm.hba_32g_fc_2p}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              비고
            </label>
            <textarea
              name="remarks"
              placeholder="비고를 입력하세요"
              value={editForm.remarks}
              onChange={handleEditChange}
              disabled={loading}
              rows="3"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? '수정 중...' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );

  // 삭제 화면
  const renderDeleteView = () => (
    <div style={{ maxWidth: '100%', overflow: 'hidden', padding: '0 10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'left' }}>하드웨어 삭제</h3>
      </div>
      
      {/* 프로젝트 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
          프로젝트 *
        </label>
        <select
          value={deleteProjectId}
          onChange={(e) => {
            setDeleteProjectId(e.target.value);
            loadDeleteHardwareList(e.target.value);
            setSelectedHardwareForDelete(null);
          }}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">프로젝트를 선택하세요</option>
          {projectList.map(project => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_id} - {project.customer} ({project.name})
            </option>
          ))}
        </select>
      </div>
      
      {/* 선택된 프로젝트의 하드웨어 목록 */}
      {deleteProjectId && deleteHardwareList.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
            등록된 하드웨어 목록 (클릭하여 삭제)
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>삭제대상</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>업무명</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>용도</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>서버명</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>Core수</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>메모리</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>OS</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>서버구분</th>
                </tr>
              </thead>
              <tbody>
                {deleteHardwareList.map((hw) => (
                  <tr 
                    key={`${hw.project_id}-${hw.hardware_id}`}
                    style={{ 
                      backgroundColor: selectedHardwareForDelete?.hardware_id === hw.hardware_id ? '#ffebee' : 'white'
                    }}
                  >
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                      <input
                        type="radio"
                        name="deleteTarget"
                        value={`${hw.project_id}-${hw.hardware_id}`}
                        checked={selectedHardwareForDelete?.hardware_id === hw.hardware_id}
                        onChange={() => selectHardwareForDelete(hw)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                      {hw.work_name || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                      {hw.purpose || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                      {hw.server_name || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                      {hw.cores || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>
                      {hw.memory || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                      {hw.os || '-'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                      {hw.server_type || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteProjectId && deleteHardwareList.length === 0 && !loading && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          textAlign: 'center',
          color: '#666'
        }}>
          선택된 프로젝트에 등록된 하드웨어가 없습니다.
        </div>
      )}

      {/* 선택된 하드웨어 삭제 확인 */}
      {selectedHardwareForDelete && (
        <div style={{
          padding: '20px',
          border: '1px solid #dc3545',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <h4>다음 하드웨어를 삭제하시겠습니까?</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '6px', lineHeight: '0.8' }}>
            <p><strong>업무명:</strong> {editForm.work_name || '-'}</p>
            <p><strong>용도:</strong> {editForm.purpose || '-'}</p>
            <p><strong>서버명:</strong> {editForm.server_name || '-'}</p>
            <p><strong>서버구분:</strong> {editForm.server_type || '-'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '6px', lineHeight: '0.8' }}>
            <p><strong>Core수:</strong> {editForm.cores || '-'}</p>
            <p><strong>메모리:</strong> {editForm.memory || '-'}</p>
            <p><strong>OS:</strong> {editForm.os || '-'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '6px', lineHeight: '0.8' }}>
            <p><strong>OS디스크:</strong> {editForm.os_disk || '-'}</p>
            <p><strong>내장디스크:</strong> {editForm.internal_disk || '-'}</p>
            <p><strong>공유디스크:</strong> {editForm.shared_disk || '-'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '6px', lineHeight: '0.8' }}>
            <p><strong>NIC(서비스) 25G FC:</strong> {editForm.nic_service_25g_fc_2p || '-'}</p>
            <p><strong>NIC(백업) 25G FC:</strong> {editForm.nic_backup_25g_fc_2p || '-'}</p>
            <p><strong>NIC(서비스) 10G FC:</strong> {editForm.nic_service_10g_fc_2p || '-'}</p>
            <p><strong>NIC(백업) 10G FC:</strong> {editForm.nic_backup_10g_fc_2p || '-'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '10px', lineHeight: '0.8' }}>
            <p><strong>NIC(RAC) 10G FC:</strong> {editForm.nic_rac_10g_fc_2p || '-'}</p>
            <p><strong>NIC(GPFS) 10G FC:</strong> {editForm.nic_gpfs_10g_fc_2p || '-'}</p>
            <p><strong>HBA 32G FC:</strong> {editForm.hba_32g_fc_2p || '-'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px', marginBottom: '10px', lineHeight: '0.8' }}>
            <p><strong>비고:</strong> {editForm.remarks || '-'}</p>
          </div>
          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
            ⚠️ 이 작업은 되돌릴 수 없습니다!
          </p>
        </div>
      )}

      {/* 삭제 및 취소 버튼 */}
      {selectedHardwareForDelete && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleDeleteConfirm}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? '삭제 중...' : '삭제'}
          </button>
          <button
            onClick={() => {
              setSelectedHardwareForDelete(null);
              setEditForm({ 
                project_id: "", 
                hardware_id: null, 
                work_name: "", 
                purpose: "", 
                os: "", 
                server_name: "", 
                server_type: "", 
                cores: "", 
                memory: "", 
                os_disk: "", 
                internal_disk: "", 
                shared_disk: "", 
                nic_service_25g_fc_2p: "", 
                nic_backup_25g_fc_2p: "",
                nic_service_10g_fc_2p: "",
                nic_backup_10g_fc_2p: "",
                nic_rac_10g_fc_2p: "",
                nic_gpfs_10g_fc_2p: "",
                hba_32g_fc_2p: ""
              });
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {currentView === 'list' && renderListView()}
      {currentView === 'add' && renderAddView()}
      {currentView === 'edit' && renderEditView()}
      {currentView === 'delete' && renderDeleteView()}
    </div>
  );
}

export default HardwareManager; 