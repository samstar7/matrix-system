import React, { useState, useEffect } from 'react'
import { solutionAPI, serviceAreaAPI } from '../services/api'

const SolutionManager = ({ currentView, onViewChange }) => {
  const [solutions, setSolutions] = useState([])
  const [groupedSolutions, setGroupedSolutions] = useState([])
  const [serviceAreas, setServiceAreas] = useState([])
  const [serviceAreaList, setServiceAreaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchForm, setSearchForm] = useState({
    service_area: '',
    solution_type: '',
    solution_name: ''
  })
  const [searchResults, setSearchResults] = useState([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [filteredSolutionTypes, setFilteredSolutionTypes] = useState([])
  const [form, setForm] = useState({
    service_area: '',
    solution_type: '',
    solution_name: '',
    license_policy: '',
    vendor: '',
    vendor_contact: '',
    vendor_phone: '',
    vendor_email: '',
    supplier: '',
    supplier_contact: '',
    supplier_phone: '',
    supplier_email: '',
    remarks: ''
  })

  useEffect(() => {
    loadServiceAreas()
    if (currentView === 'service-areas') {
      loadServiceAreaList()
    }
  }, [currentView])

  const loadServiceAreas = async () => {
    try {
      const data = await solutionAPI.getServiceAreas()
      console.log('로드된 서비스 영역 데이터:', data)
      
      // 데이터가 배열인지 확인하고 처리
      let areasArray = []
      if (Array.isArray(data)) {
        areasArray = data
      } else if (data && data.serviceAreas) {
        areasArray = data.serviceAreas
      } else if (data && data.data) {
        areasArray = data.data
      } else if (data && typeof data === 'object') {
        // 객체인 경우 배열로 변환 시도
        areasArray = Object.values(data)
      } else {
        console.error('예상치 못한 서비스 영역 데이터 형식:', data)
        areasArray = []
      }
      
      console.log('처리된 서비스 영역 배열:', areasArray)
      setServiceAreas(areasArray)
    } catch (error) {
      console.error('서비스 영역 로드 실패:', error)
      setServiceAreas([])
    }
  }

  const loadServiceAreaList = async () => {
    try {
      const data = await serviceAreaAPI.getServiceAreaList()
      console.log('로드된 서비스 영역 목록 데이터:', data)
      
      // 데이터가 배열인지 확인하고 처리
      let areasArray = []
      if (Array.isArray(data)) {
        areasArray = data
      } else if (data && data.serviceAreas) {
        areasArray = data.serviceAreas
      } else if (data && data.data) {
        areasArray = data.data
      } else if (data && typeof data === 'object') {
        // 객체인 경우 배열로 변환 시도
        areasArray = Object.values(data)
      } else {
        console.error('예상치 못한 서비스 영역 목록 데이터 형식:', data)
        areasArray = []
      }
      
      console.log('처리된 서비스 영역 목록 배열:', areasArray)
      setServiceAreaList(areasArray)
    } catch (error) {
      console.error('서비스 영역 목록 로드 실패:', error)
      setServiceAreaList([])
    }
  }

  const loadSolutions = async () => {
    setLoading(true)
    try {
      const data = await solutionAPI.getSolutionList()
      console.log('로드된 솔루션 데이터:', data)
      
      // 데이터가 배열인지 확인하고 처리
      let solutionsArray = []
      if (Array.isArray(data)) {
        solutionsArray = data
      } else if (data && data.flat) {
        // 서버에서 flat 배열로 반환하는 경우
        solutionsArray = data.flat
      } else if (data && data.solutions) {
        solutionsArray = data.solutions
      } else if (data && data.data) {
        solutionsArray = data.data
      } else if (data && typeof data === 'object') {
        // 객체인 경우 배열로 변환 시도
        solutionsArray = Object.values(data)
      } else {
        console.error('예상치 못한 데이터 형식:', data)
        solutionsArray = []
      }
      
      // 서비스영역 ID순서로 정렬
      const sortedSolutions = solutionsArray.sort((a, b) => {
        const aId = a.service_area_id || 0
        const bId = b.service_area_id || 0
        if (aId !== bId) {
          return aId - bId
        }
        // 서비스영역이 같으면 솔루션구분으로 정렬
        return (a.solution_type || '').localeCompare(b.solution_type || '')
      })
      
      console.log('정렬된 솔루션 배열:', sortedSolutions)
      setSolutions(sortedSolutions)
      setGroupedSolutions(sortedSolutions)
      return sortedSolutions
    } catch (error) {
      console.error('솔루션 로드 실패:', error)
      setSolutions([])
      setGroupedSolutions([])
      return []
    } finally {
      setLoading(false)
    }
  }

  // 서비스영역 선택을 위한 데이터만 로드하는 함수 (그리드 업데이트 없음)
  const loadSolutionsForDropdown = async () => {
    try {
      const data = await solutionAPI.getSolutionList()
      console.log('드롭다운용 솔루션 데이터 로드:', data)
      
      // 데이터가 배열인지 확인하고 처리
      let solutionsArray = []
      if (Array.isArray(data)) {
        solutionsArray = data
      } else if (data && data.flat) {
        // 서버에서 flat 배열로 반환하는 경우
        solutionsArray = data.flat
      } else if (data && data.solutions) {
        solutionsArray = data.solutions
      } else if (data && data.data) {
        solutionsArray = data.data
      } else if (data && typeof data === 'object') {
        // 객체인 경우 배열로 변환 시도
        solutionsArray = Object.values(data)
      } else {
        console.error('예상치 못한 데이터 형식:', data)
        solutionsArray = []
      }
      
      // 서비스영역 ID순서로 정렬
      const sortedSolutions = solutionsArray.sort((a, b) => {
        const aId = a.service_area_id || 0
        const bId = b.service_area_id || 0
        if (aId !== bId) {
          return aId - bId
        }
        // 서비스영역이 같으면 솔루션구분으로 정렬
        return (a.solution_type || '').localeCompare(b.solution_type || '')
      })
      
      console.log('드롭다운용 정렬된 솔루션 배열:', sortedSolutions)
      // solutions 상태도 업데이트하지 않음 (그리드에 표시되지 않도록)
      return sortedSolutions
    } catch (error) {
      console.error('드롭다운용 솔루션 로드 실패:', error)
      return []
    }
  }

  const handleSearchChange = async (e) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 서비스영역이 변경되면 솔루션구분 필터링
    if (name === 'service_area') {
      if (value && value !== '__ALL__') {
        // 데이터가 없으면 먼저 로드 (그리드에는 표시하지 않음)
        let currentSolutions = solutions
        if (solutions.length === 0) {
          console.log('서비스영역 선택을 위해 데이터를 로드합니다.')
          currentSolutions = await loadSolutionsForDropdown()
        }
        
        // 선택된 서비스영역의 솔루션구분만 필터링
        const filteredTypes = currentSolutions
          .filter(solution => solution.service_area === value)
          .map(solution => solution.solution_type)
          .filter((type, index, arr) => arr.indexOf(type) === index) // 중복 제거
        setFilteredSolutionTypes(filteredTypes)
      } else {
        // 전체 선택이거나 선택하지 않은 경우 빈 배열
        setFilteredSolutionTypes([])
      }
      // 서비스영역이 변경되면 솔루션구분 초기화
      setSearchForm(prev => ({
        ...prev,
        solution_type: ''
      }))
    }
  }

  const handleSearch = async () => {
    const { service_area, solution_type, solution_name } = searchForm
    
    console.log('검색 시작')
    console.log('검색 조건:', { service_area, solution_type, solution_name })
    
    // 검색 조건이 모두 비어있는지 확인 (서비스영역 '전체' 포함)
    const hasSearchConditions = service_area || solution_type || solution_name
    
    if (!hasSearchConditions) {
      // 검색 조건이 없으면 유의사항 팝업만 표시하고 데이터는 표시하지 않음
      alert('검색 조건을 하나 이상 선택하여 주시기 바랍니다.\n\n• 서비스영역: 드롭다운에서 선택\n• 솔루션명: 텍스트 입력')
      setSearchResults([])
      setSearchPerformed(false)
      console.log('검색 조건 없음 - 유의사항 팝업만 표시')
      return
    }
    
    // 검색 조건이 있을 때만 데이터 로드
    let currentSolutions = solutions
    if (solutions.length === 0) {
      console.log('데이터가 없어서 먼저 로드합니다.')
      currentSolutions = await loadSolutions()
    }
    
    // 클라이언트 사이드 검색
    let filteredResults = [...currentSolutions] // 배열 복사
    
    // 서비스영역 필터링
    if (service_area && service_area !== '__ALL__') {
      filteredResults = filteredResults.filter(solution => 
        solution.service_area === service_area
      )
      console.log('서비스영역 필터링 후:', filteredResults.length, '개')
    }
    
    // 솔루션구분 필터링
    if (solution_type) {
      filteredResults = filteredResults.filter(solution => 
        solution.solution_type === solution_type
      )
      console.log('솔루션구분 필터링 후:', filteredResults.length, '개')
    }
    
    // 솔루션명 필터링 (Like 검색 - 대소문자 구분 없이 부분 일치, 와일드카드 지원)
    if (solution_name) {
      const searchTerm = solution_name.toLowerCase().trim()
      // 와일드카드(*)를 정규식 패턴으로 변환
      const regexPattern = searchTerm.replace(/\*/g, '.*')
      const regex = new RegExp(regexPattern, 'i') // 'i' 플래그로 대소문자 구분 없음
      
      filteredResults = filteredResults.filter(solution => 
        solution.solution_name && 
        regex.test(solution.solution_name)
      )
      console.log('솔루션명 Like 검색 후:', filteredResults.length, '개')
    }
    
    setSearchResults(filteredResults)
    setSearchPerformed(true)
    
    console.log('최종 검색 결과:', filteredResults.length, '개')
    console.log('검색 결과 데이터:', filteredResults)
    
    // 검색 결과가 없으면 알림
    if (filteredResults.length === 0) {
      alert('검색 조건에 맞는 데이터가 없습니다.')
    }
  }

  const handleExcelDownload = () => {
    const dataToExport = searchPerformed ? searchResults : solutions
    
    if (dataToExport.length === 0) {
      alert('다운로드할 데이터가 없습니다.')
      return
    }

    try {
      // HTML 테이블 생성 (스타일링 포함)
      const table = document.createElement('table')
      table.style.borderCollapse = 'collapse'
      table.style.width = '100%'
      
      // 제목 행
      const titleRow = table.insertRow()
      const titleCell = titleRow.insertCell()
      titleCell.textContent = 'Matrix System - 솔루션 관리 현황'
      titleCell.colSpan = 13
      titleCell.style.textAlign = 'center'
      titleCell.style.fontWeight = 'bold'
      titleCell.style.fontSize = '16px'
      titleCell.style.padding = '10px'
      titleCell.style.backgroundColor = '#f8f9fa'
      titleCell.style.border = '1px solid #dee2e6'
      
      // 검색 조건 정보 행
      const searchInfoRow = table.insertRow()
      const searchInfoCell = searchInfoRow.insertCell()
      const searchConditions = []
      if (searchForm.service_area && searchForm.service_area !== '__ALL__') searchConditions.push('서비스영역: ' + searchForm.service_area)
      if (searchForm.solution_type) searchConditions.push('솔루션구분: ' + searchForm.solution_type)
      if (searchForm.solution_name) searchConditions.push('솔루션명: ' + searchForm.solution_name)
      
      if (searchPerformed) {
        const conditionText = searchConditions.length > 0 ? searchConditions.join(', ') : '전체'
        searchInfoCell.textContent = '검색 조건: ' + conditionText
      } else {
        searchInfoCell.textContent = '전체 데이터'
      }
      searchInfoCell.colSpan = 13
      searchInfoCell.style.fontWeight = 'bold'
      searchInfoCell.style.padding = '5px'
      searchInfoCell.style.border = '1px solid #dee2e6'
      
      // 요약 행
      const summaryRow = table.insertRow()
      const summaryCell = summaryRow.insertCell()
      summaryCell.textContent = '총 솔루션 수: ' + dataToExport.length + '개'
      summaryCell.colSpan = 13
      summaryCell.style.fontWeight = 'bold'
      summaryCell.style.padding = '5px'
      summaryCell.style.border = '1px solid #dee2e6'
      
      // 빈 행
      const emptyRow = table.insertRow()
      const emptyCell = emptyRow.insertCell()
      emptyCell.colSpan = 13
      emptyCell.style.height = '10px'
      emptyCell.style.border = 'none'
      
      // 헤더 추가
      const headers = ['서비스영역', '솔루션구분', '솔루션명', '라이선스 정책', '벤더사', '벤더사담당자', '벤더사연락처', '벤더사메일', '납품업체', '납품업체담당자', '납품업체연락처', '납품업체메일', '비고']
      
      // 데이터 준비
      const data = dataToExport.map(solution => [
        solution.service_area || '',
        solution.solution_type || '',
        solution.solution_name || '',
        solution.license_policy || '',
        solution.vendor || '',
        solution.vendor_contact || '',
        solution.vendor_phone || '',
        solution.vendor_email || '',
        solution.supplier || '',
        solution.supplier_contact || '',
        solution.supplier_phone || '',
        solution.supplier_email || '',
        solution.remarks || ''
      ])
      
      // 헤더 행
      const headerRow = table.insertRow()
      headers.forEach(header => {
        const cell = headerRow.insertCell()
        cell.textContent = header
        cell.style.backgroundColor = '#E9ECEF'
        cell.style.fontWeight = 'bold'
        cell.style.textAlign = 'center'
        cell.style.padding = '8px'
        cell.style.border = '1px solid #dee2e6'
      })
      
      // 데이터 행
      data.forEach(row => {
        const rowElement = table.insertRow()
        row.forEach((value, index) => {
          const cell = rowElement.insertCell()
          cell.textContent = value
          cell.style.textAlign = 'center'
          cell.style.padding = '6px'
          cell.style.border = '1px solid #dee2e6'
        })
      })
      
      // 엑셀로 다운로드
      const html = table.outerHTML
      const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      const searchInfo = searchPerformed ? '_검색결과' : '_전체'
      const fileName = '솔루션목록' + searchInfo + '_' + new Date().toISOString().split('T')[0] + '.xls'
      link.download = fileName
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error)
      alert('엑셀 다운로드에 실패했습니다.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await solutionAPI.createSolution(form)
      alert('솔루션이 등록되었습니다.')
      setForm({
        service_area: '',
        solution_type: '',
        solution_name: '',
        license_policy: '',
        vendor: '',
        vendor_contact: '',
        vendor_phone: '',
        vendor_email: '',
        supplier: '',
        supplier_contact: '',
        supplier_phone: '',
        supplier_email: '',
        remarks: ''
      })
      onViewChange('list')
    } catch (error) {
      console.error('솔루션 등록 실패:', error)
      alert('솔루션 등록에 실패했습니다.')
    }
  }

  const renderAddView = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>솔루션 등록</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>서비스영역</label>
            <select name="service_area" value={form.service_area} onChange={handleChange}>
              <option value="">선택하세요</option>
              {serviceAreas.map(area => (
                <option key={area.id} value={area.service_area}>{area.service_area}</option>
              ))}
            </select>
          </div>
          <div>
            <label>솔루션구분</label>
            <input type="text" name="solution_type" value={form.solution_type} onChange={handleChange} />
          </div>
          <div>
            <label>솔루션명 *</label>
            <input type="text" name="solution_name" value={form.solution_name} onChange={handleChange} required />
          </div>
          <div>
            <label>라이선스 정책</label>
            <input type="text" name="license_policy" value={form.license_policy} onChange={handleChange} />
          </div>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  )

  const renderListView = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2c3e50' }}>솔루션 목록조회</h3>
        <button
          onClick={handleExcelDownload}
          disabled={(searchPerformed ? searchResults : solutions).length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: (searchPerformed ? searchResults : solutions).length > 0 ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (searchPerformed ? searchResults : solutions).length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            opacity: (searchPerformed ? searchResults : solutions).length > 0 ? 1 : 0.6
          }}
        >
          📊 엑셀 다운로드
        </button>
      </div>
      
      {/* 검색 조건 */}
      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '14px' }}>서비스영역:</label>
            <select
              name="service_area"
              value={searchForm.service_area}
              onChange={handleSearchChange}
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minWidth: '100px',
                fontSize: '14px'
              }}
            >
              <option value="">선택하세요</option>
              <option value="__ALL__">전체</option>
              {serviceAreas.map(area => (
                <option key={area.id} value={area.service_area}>{area.service_area}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '14px' }}>솔루션구분:</label>
            <select
              name="solution_type"
              value={searchForm.solution_type}
              onChange={handleSearchChange}
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minWidth: '100px',
                fontSize: '14px'
              }}
              disabled={!searchForm.service_area || searchForm.service_area === '__ALL__'}
            >
              <option value="">선택하세요</option>
              {filteredSolutionTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '14px' }}>솔루션명:</label>
            <input
              type="text"
              name="solution_name"
              value={searchForm.solution_name}
              onChange={handleSearchChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '120px',
                fontSize: '14px'
              }}
              placeholder="솔루션명"
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              검색
            </button>
            <button
              onClick={() => {
                setSearchForm({
                  service_area: '',
                  solution_type: '',
                  solution_name: ''
                })
                setSearchResults([])
                setSearchPerformed(false)
                setFilteredSolutionTypes([])
                setSolutions([])
                setGroupedSolutions([])
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 테이블 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div style={{
          border: '1px solid #e9ecef',
          borderRadius: '5px',
          overflow: 'hidden',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#E9ECEF' }}>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>서비스영역</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>솔루션구분</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '200px' }}>솔루션명</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>라이선스 정책</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>벤더사</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '120px' }}>벤더사담당자</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '120px' }}>벤더사연락처</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>벤더사메일</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>납품업체</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>납품업체담당자</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '120px' }}>납품업체연락처</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>납품업체메일</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', width: '300px', minWidth: '300px' }}>비고</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(searchPerformed ? searchResults : solutions) ? 
                (searchPerformed ? searchResults : solutions).map((solution, index) => (
                  <tr key={solution.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{solution.service_area || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{solution.solution_type || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '200px' }}>{solution.solution_name || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{solution.license_policy || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{solution.vendor || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '120px' }}>{solution.vendor_contact || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '120px' }}>{solution.vendor_phone || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{solution.vendor_email || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{solution.supplier || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{solution.supplier_contact || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center', minWidth: '120px' }}>{solution.supplier_phone || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{solution.supplier_email || ''}</td>
                    <td style={{ padding: '12px', textAlign: 'left', width: '300px', minWidth: '300px' }}>{solution.remarks || ''}</td>
                  </tr>
                )) : 
                <tr>
                  <td colSpan="13" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderServiceAreaView = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>서비스영역 조회</h3>
        </div>
      </div>
      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '5px',
        overflow: 'hidden',
        overflowX: 'auto',
        backgroundColor: '#f8f9fa'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#E9ECEF' }}>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>서비스영역</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>설명</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold' }}>예시 솔루션</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(serviceAreaList) ? 
              serviceAreaList.map((area, index) => (
                <tr key={area.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{area.id || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{area.service_area || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>{area.description || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>{area.example_solution || ''}</td>
                </tr>
              )) : 
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {currentView === 'add' && renderAddView()}
      {currentView === 'list' && renderListView()}
      {currentView === 'service-areas' && renderServiceAreaView()}
    </div>
  )
}

export default SolutionManager 