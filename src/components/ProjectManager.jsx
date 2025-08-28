import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { getProjectList, createProject, updateProject } from '../services/api';

function ProjectManager({ currentView = 'list', onViewChange }) {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    customer: '',
    name: '',
    description: '',
    salesRep: '',
    proposalPM: '',
    announceDate: '',
    submitDate: '',
    presentationDate: '',
    status: '사전영업'
  });

  const [editForm, setEditForm] = useState({
    customer: '',
    name: '',
    description: '',
    salesRep: '',
    proposalPM: '',
    announceDate: '',
    submitDate: '',
    presentationDate: '',
    status: '사전영업'
  });

  const [searchForm, setSearchForm] = useState({
    name: '',
    customer: '',
    salesRep: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [previousView, setPreviousView] = useState('list');
  const [salesRepList, setSalesRepList] = useState([]);

  // 영업대표 목록 추출
  const extractSalesRepList = (projects) => {
    const salesReps = [...new Set(projects.map(project => project.sales_rep).filter(Boolean))];
    console.log('추출된 영업대표 목록:', salesReps);
    console.log('영업대표 목록 길이:', salesReps.length);
    console.log('영업대표 목록 내용:', JSON.stringify(salesReps));
    return salesReps.sort();
  };



  // 프로젝트 목록 로드
  const loadProjectList = async () => {
    setLoading(true);
    try {
      const data = await getProjectList();
      setProjectList(data);
      // projects 테이블에서 영업대표 목록 추출 (중복 제거)
      const salesReps = extractSalesRepList(data);
      setSalesRepList(salesReps);
    } catch (error) {
      console.error('프로젝트 목록 로드 오류:', error);
      alert('프로젝트 목록을 불러오는데 실패했습니다.');
      // API 실패 시 빈 배열로 설정
      setSalesRepList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectList();
  }, []);

  // 디버깅용: salesRepList 상태 변화 추적
  useEffect(() => {
    console.log('salesRepList 상태 변화:', salesRepList);
  }, [salesRepList]);

  // 정렬된 목록
  const sortedList = React.useMemo(() => {
    let sortableItems = [...projectList];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [projectList, sortConfig]);

  // 정렬 처리
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 폼 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 폼 변경 처리
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 검색 폼 변경 처리
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 프로젝트 검색
  const handleSearch = () => {
    const { name, customer, salesRep } = searchForm;
    
    // 검색 조건이 하나라도 입력된 경우에만 검색
    if (!name && !customer && !salesRep) {
      alert('검색 조건을 하나 이상 입력해주세요.');
      return;
    }

    const results = projectList.filter(project => {
      const nameMatch = !name || project.name.toLowerCase().includes(name.toLowerCase());
      const customerMatch = !customer || project.customer.toLowerCase().includes(customer.toLowerCase());
      const salesRepMatch = !salesRep || project.sales_rep.toLowerCase().includes(salesRep.toLowerCase());
      
      return nameMatch && customerMatch && salesRepMatch;
    });

    setSearchResults(results);
    setSearchPerformed(true);
  };

  // 검색 초기화
  const handleSearchReset = () => {
    setSearchForm({
      name: '',
      customer: '',
      salesRep: ''
    });
    setSearchResults([]);
    setSearchPerformed(false);
  };

  // 폼 리셋
  const resetForm = () => {
    setForm({
      customer: '',
      name: '',
      description: '',
      salesRep: '',
      proposalPM: '',
      announceDate: '',
      submitDate: '',
      presentationDate: '',
      status: '사전영업'
    });
  };

  // 프로젝트 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수항목 검증
    const missingFields = [];
    
    if (!form.customer || form.customer.trim() === '') {
      missingFields.push('고객사');
    }
    
    if (!form.name || form.name.trim() === '') {
      missingFields.push('프로젝트명');
    }
    
    if (!form.salesRep || form.salesRep.trim() === '') {
      missingFields.push('영업대표');
    }
    
    if (missingFields.length > 0) {
      alert(`다음 필수항목을 입력해주세요:\n${missingFields.join(', ')}`);
      return;
    }

    try {
      await createProject({
        customer: form.customer,
        name: form.name,
        description: form.description,
        sales_rep: form.salesRep,
        proposal_pm: form.proposalPM,
        announce_date: form.announceDate,
        submit_date: form.submitDate,
        presentation_date: form.presentationDate,
        status: form.status
      });
      
      alert('프로젝트가 등록되었습니다.');
      setForm({
        customer: '',
        name: '',
        description: '',
        salesRep: '',
        proposalPM: '',
        announceDate: '',
        submitDate: '',
        presentationDate: '',
        status: '사전영업'
      });
      loadProjectList();
      onViewChange('list');
    } catch (error) {
      alert('프로젝트 등록에 실패했습니다.');
    }
  };

  // 수정 시작
  const startEdit = (project) => {
    setEditingId(project.project_id);
    setEditForm({
      customer: project.customer,
      name: project.name,
      description: project.description || '',
      salesRep: project.sales_rep || '',
      proposalPM: project.proposal_pm || '',
      announceDate: project.announce_date || '',
      submitDate: project.submit_date || '',
      presentationDate: project.presentation_date || '',
      status: project.status
    });
    // 현재 화면을 이전 화면으로 저장
    setPreviousView(currentView);
    // 영업대표 목록 업데이트 (projects 테이블에서 중복 제거)
    const salesReps = extractSalesRepList(projectList);
    setSalesRepList(salesReps);
    console.log('수정화면 진입 시 영업대표 목록:', salesReps);
    onViewChange('edit');
  };

  // 프로젝트 수정
  const handleEdit = async (e) => {
    e.preventDefault();
    
    // 필수항목 검증
    const missingFields = [];
    
    if (!editForm.customer || editForm.customer.trim() === '') {
      missingFields.push('고객사');
    }
    
    if (!editForm.name || editForm.name.trim() === '') {
      missingFields.push('프로젝트명');
    }
    
    if (!editForm.salesRep || editForm.salesRep.trim() === '') {
      missingFields.push('영업대표');
    }
    
    if (missingFields.length > 0) {
      alert(`다음 필수항목을 입력해주세요:\n${missingFields.join(', ')}`);
      return;
    }

    try {
      await updateProject(editingId, {
        customer: editForm.customer,
        name: editForm.name,
        description: editForm.description,
        sales_rep: editForm.salesRep,
        proposal_pm: editForm.proposalPM,
        announce_date: editForm.announceDate,
        submit_date: editForm.submitDate,
        presentation_date: editForm.presentationDate,
        status: editForm.status
      });
      
      alert('프로젝트가 수정되었습니다.');
      setEditingId(null);
      loadProjectList();
      // 검색 결과와 검색 폼도 초기화
      setSearchResults([]);
      setSearchPerformed(false);
      setSearchForm({
        name: '',
        customer: '',
        salesRep: ''
      });
      // 목록 화면으로 돌아가기
      onViewChange('list');
    } catch (error) {
      alert('프로젝트 수정에 실패했습니다.');
    }
  };

  // 취소
  const handleCancel = () => {
    setEditingId(null);
    setForm({
      customer: '',
      name: '',
      description: '',
      salesRep: '',
      proposalPM: '',
      announceDate: '',
      submitDate: '',
      presentationDate: '',
      status: '사전영업'
    });
    onViewChange('list');
  };

  // 수정화면 취소 (이전 화면으로 돌아가기)
  const handleEditCancel = () => {
    console.log('취소 버튼 클릭됨, 현재 editingId:', editingId);
    setEditingId(null);
    setEditForm({
      customer: '',
      name: '',
      description: '',
      salesRep: '',
      proposalPM: '',
      announceDate: '',
      submitDate: '',
      presentationDate: '',
      status: '사전영업'
    });
    // 검색 결과와 검색 폼도 초기화
    setSearchResults([]);
    setSearchPerformed(false);
    setSearchForm({
      name: '',
      customer: '',
      salesRep: ''
    });
    console.log('editingId가 null로 설정됨, editingId:', editingId);
    // 이전 화면으로 돌아가기
    onViewChange(previousView);
  };

  // 등록 화면으로 이동
  const handleAdd = () => {
    setForm({
      customer: '',
      name: '',
      description: '',
      salesRep: '',
      proposalPM: '',
      announceDate: '',
      submitDate: '',
      presentationDate: '',
      status: '사전영업'
    });
    onViewChange('add');
  };

  // 엑셀 다운로드 기능 (HTML 테이블 방식)
  const handleExcelDownload = () => {
    if (sortedList.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    try {
      // HTML 테이블 생성 (스타일링 포함)
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      
      // 제목 행
      const titleRow = table.insertRow();
      const titleCell = titleRow.insertCell();
      titleCell.textContent = 'Matrix System - 프로젝트 관리 현황';
      titleCell.colSpan = 10;
      titleCell.style.textAlign = 'center';
      titleCell.style.fontWeight = 'bold';
      titleCell.style.fontSize = '16px';
      titleCell.style.padding = '10px';
      titleCell.style.backgroundColor = '#f8f9fa';
      titleCell.style.border = '1px solid #dee2e6';
      
      // 요약 행
      const summaryRow = table.insertRow();
      const summaryCell = summaryRow.insertCell();
      summaryCell.textContent = `총 프로젝트 수: ${sortedList.length}개`;
      summaryCell.colSpan = 10;
      summaryCell.style.fontWeight = 'bold';
      summaryCell.style.padding = '5px';
      summaryCell.style.border = '1px solid #dee2e6';
      
      // 상태 요약 행
      const statusRow = table.insertRow();
      const statusCell = statusRow.insertCell();
      const statusSummary = [
        `제안: ${sortedList.filter(p => p.status === '제안').length}개`,
        `수주: ${sortedList.filter(p => p.status === '수주').length}개`,
        `실주: ${sortedList.filter(p => p.status === '실주').length}개`
      ].join(' | ');
      statusCell.textContent = statusSummary;
      statusCell.colSpan = 10;
      statusCell.style.padding = '5px';
      statusCell.style.border = '1px solid #dee2e6';
      
      // 빈 행
      const emptyRow = table.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 10;
      emptyCell.style.height = '10px';
      emptyCell.style.border = 'none';
      
      // 헤더 추가
      const headers = ['프로젝트ID', '고객사', '프로젝트명', '영업대표', '상태', '제안PM', '공고일', '제출일', '설명회일', '설명'];
      
      // 데이터 준비
      const data = sortedList.map(project => [
        project.project_id,
        project.customer,
        project.name,
        project.sales_rep,
        project.status,
        project.proposal_pm,
        project.announce_date,
        project.submit_date,
        project.presentation_date,
        project.description
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
          
          // 설명 컬럼은 왼쪽 정렬
          if (index === 9) { // 설명 컬럼은 항상 9번째
            cell.style.textAlign = 'left';
          }
          
          // 상태 컬럼 색상 처리
          if (index === 4) { // 상태 컬럼은 항상 4번째
            if (value === '실주') {
              cell.style.backgroundColor = '#D4EDDA';
              cell.style.fontWeight = 'bold';
            } else if (value === '제안') {
              cell.style.backgroundColor = '#FFF3CD';
              cell.style.fontWeight = 'bold';
            } else if (value === '수주') {
              cell.style.backgroundColor = '#F8D7DA';
              cell.style.fontWeight = 'bold';
            } else if (value === '사전영업') {
              cell.style.backgroundColor = '#E2E3E5';
              cell.style.fontWeight = 'bold';
            }
          }
        });
      });
      
      // HTML을 문자열로 변환
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>프로젝트 목록</title>
          </head>
          <body>
            ${table.outerHTML}
          </body>
        </html>
      `;
      
      // Blob 생성
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
      
      // 다운로드
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `프로젝트목록_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('HTML 테이블 Excel 파일 다운로드 완료');
      
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('파일 생성 중 오류가 발생했습니다.');
    }
  };

  // 목록 조회 화면
  const renderListView = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>프로젝트 목록조회</h3>
        <button
          onClick={handleExcelDownload}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          📊 엑셀 다운로드
        </button>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
            marginTop: '10px',
            minWidth: '1000px'
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
                  minWidth: '60px'
                                  }} onClick={() => handleSort('project_id')}>
                    프로젝트ID {sortConfig.key === 'project_id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '120px'
                }} onClick={() => handleSort('customer')}>
                  고객사 {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '150px'
                }} onClick={() => handleSort('name')}>
                  프로젝트명 {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }} onClick={() => handleSort('sales_rep')}>
                  영업대표 {sortConfig.key === 'sales_rep' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '80px'
                }} onClick={() => handleSort('status')}>
                  상태 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }} onClick={() => handleSort('proposal_pm')}>
                  제안PM {sortConfig.key === 'proposal_pm' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }} onClick={() => handleSort('announce_date')}>
                  공고일 {sortConfig.key === 'announce_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }} onClick={() => handleSort('submit_date')}>
                  제출일 {sortConfig.key === 'submit_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }} onClick={() => handleSort('presentation_date')}>
                  설명회일 {sortConfig.key === 'presentation_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: '200px'
                }} onClick={() => handleSort('description')}>
                  설명 {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedList.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    등록된 프로젝트가 없습니다.
                  </td>
                </tr>
              ) : (
                sortedList.map((project) => (
                  <tr key={project.project_id} style={{ backgroundColor: 'white' }}>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.project_id}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.customer}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.name}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.sales_rep}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: 
                          project.status === '실주' ? '#D4EDDA' :
                          project.status === '제안' ? '#FFF3CD' :
                          project.status === '수주' ? '#F8D7DA' :
                          project.status === '사전영업' ? '#E2E3E5' : '#f8f9fa',
                        color: 
                          project.status === '실주' ? '#155724' :
                          project.status === '제안' ? '#856404' :
                          project.status === '수주' ? '#721c24' :
                          project.status === '사전영업' ? '#6c757d' : '#6c757d'
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.proposal_pm}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.announce_date}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.submit_date}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{project.presentation_date}</td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: '12px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px'
                    }} title={project.description}>{project.description}</td>
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>프로젝트 등록</h3>
      </div>
      <form id="projectForm" onSubmit={handleSubmit} style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', textAlign: 'left' }}>
              고객사 *
            </label>
            <input
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
              maxLength={50}
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
              프로젝트명 *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                textAlign: 'left'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '50px', textAlign: 'left' }}>
              상태
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="사전영업">사전영업</option>
              <option value="제안">제안</option>
              <option value="수주">수주</option>
              <option value="실주">실주</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              영업대표 *
            </label>
            <input
              name="salesRep"
              value={form.salesRep}
              onChange={handleChange}
              required
              maxLength={10}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                textAlign: 'left'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              제안PM
            </label>
            <input
              name="proposalPM"
              value={form.proposalPM}
              onChange={handleChange}
              maxLength={10}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              공고일
            </label>
            <input
              name="announceDate"
              type="date"
              value={form.announceDate}
              onChange={handleChange}
              maxLength={10}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              제출일
            </label>
            <input
              name="submitDate"
              type="date"
              value={form.submitDate}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              설명회일
            </label>
            <input
              name="presentationDate"
              type="date"
              value={form.presentationDate}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
            설명
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>
       </form>
       
       {/* 등록 및 취소 버튼을 form 밖으로 이동 */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          form="projectForm"
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
          onClick={resetForm}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
                          초기화
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>프로젝트 수정</h3>
      </div>
      
      {/* 프로젝트 검색 섹션 */}
      {!editingId && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>수정할 프로젝트를 검색하세요</h4>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  프로젝트명
                </label>
                <input
                  name="name"
                  value={searchForm.name}
                  onChange={handleSearchChange}
                  placeholder="프로젝트명"
                  style={{
                    width: '120px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  고객사
                </label>
                <input
                  name="customer"
                  value={searchForm.customer}
                  onChange={handleSearchChange}
                  placeholder="고객사"
                  style={{
                    width: '100px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  영업대표
                </label>
                <select
                  name="salesRep"
                  value={searchForm.salesRep}
                  onChange={handleSearchChange}
                  style={{
                    width: '100px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">전체</option>
                  {salesRepList.map((salesRep, index) => (
                    <option key={index} value={salesRep}>{salesRep}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={handleSearch}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🔍 검색
                </button>
                <button
                  type="button"
                  onClick={handleSearchReset}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                }}
              >
                초기화
              </button>
              </div>
            </div>
          </div>
          
          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ marginBottom: '15px', color: '#2c3e50' }}>검색 결과</h5>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #ddd',
                  minWidth: '800px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>프로젝트ID</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>고객사</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>프로젝트명</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>영업대표</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>상태</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((project) => (
                      <tr key={project.project_id} style={{ backgroundColor: 'white' }}>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{project.project_id}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{project.customer}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{project.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{project.sales_rep}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: 
                              project.status === '사전영업' ? '#e3f2fd' :
                              project.status === '제안' ? '#fff3e0' :
                              project.status === '수주' ? '#e8f5e8' : '#ffebee',
                            color: 
                              project.status === '사전영업' ? '#1976d2' :
                              project.status === '제안' ? '#f57c00' :
                              project.status === '수주' ? '#388e3c' : '#d32f2f'
                          }}>
                            {project.status}
                          </span>
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => startEdit(project)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ffc107',
                              color: '#212529',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            수정
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* 검색 결과가 없을 때 */}
          {searchPerformed && searchResults.length === 0 && (
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <p style={{ margin: 0, color: '#6c757d' }}>검색 조건에 맞는 프로젝트가 없습니다.</p>
            </div>
          )}
        </div>
      )}
      
      {/* 수정 폼 */}
      {editingId && (
        <form onSubmit={handleEdit} style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 0.6fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '60px', textAlign: 'left' }}>
              고객사 *
            </label>
            <input
              name="customer"
              value={editForm.customer}
              onChange={handleEditChange}
              required
              maxLength={50}
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
              프로젝트명 *
            </label>
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
              maxLength={100}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                textAlign: 'left'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '50px', textAlign: 'left' }}>
              상태
            </label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="사전영업">사전영업</option>
              <option value="제안">제안</option>
              <option value="수주">수주</option>
              <option value="실주">실주</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', whiteSpace: 'nowrap', textAlign: 'left' }}>
              영업대표 *
            </label>
            <input
              name="salesRep"
              value={editForm.salesRep}
              onChange={handleEditChange}
              required
              maxLength={20}
              disabled={loading}
              placeholder="영업대표를 입력하세요"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                textAlign: 'left',
                backgroundColor: 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              제안PM
            </label>
            <input
              name="proposalPM"
              value={editForm.proposalPM}
              onChange={handleEditChange}
              maxLength={10}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              공고일
            </label>
            <input
              name="announceDate"
              type="date"
              value={editForm.announceDate}
              onChange={handleEditChange}
              maxLength={10}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              제출일
            </label>
            <input
              name="submitDate"
              type="date"
              value={editForm.submitDate}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '70px', textAlign: 'left' }}>
              설명회일
            </label>
            <input
              name="presentationDate"
              type="date"
              value={editForm.presentationDate}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
            설명
          </label>
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
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
          <button
            type="button"
            onClick={handleEditCancel}
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
      </form>
      )}
    </div>
  );

  return (
    <div>
      {currentView === 'list' && renderListView()}
      {currentView === 'add' && renderAddView()}
      {currentView === 'edit' && renderEditView()}
    </div>
  );
}

export default ProjectManager; 