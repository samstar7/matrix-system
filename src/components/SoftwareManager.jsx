import React, { useState, useEffect } from "react";

function SoftwareManager({ currentView = 'list', onViewChange }) {

  const [softwareList, setSoftwareList] = useState([]);
  const [editingSoftware, setEditingSoftware] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 폼 상태
  const [form, setForm] = useState({ 
    name: "", 
    version: "", 
    license: "", 
    vendor: "",
    description: "",
    category: "",
    status: "활성"
  });
  
  // 검색 폼 상태
  const [searchForm, setSearchForm] = useState({
    name: "",
    vendor: "",
    category: "",
    status: ""
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    loadSoftwareList();
  }, []);

  // 소프트웨어 목록 로드
  const loadSoftwareList = () => {
    setLoading(true);
    // 실제 API 호출 대신 임시 데이터 사용
    setTimeout(() => {
      const mockData = [
        { id: 1, name: "Windows 11", version: "22H2", license: "Microsoft", vendor: "Microsoft", description: "최신 Windows 운영체제", category: "운영체제", status: "활성" },
        { id: 2, name: "Office 365", version: "2023", license: "Microsoft 365", vendor: "Microsoft", description: "사무용 소프트웨어 패키지", category: "사무용", status: "활성" },
        { id: 3, name: "Adobe Photoshop", version: "2024", license: "Creative Cloud", vendor: "Adobe", description: "이미지 편집 소프트웨어", category: "디자인", status: "활성" },
        { id: 4, name: "Visual Studio Code", version: "1.85", license: "MIT", vendor: "Microsoft", description: "코드 에디터", category: "개발도구", status: "활성" }
      ];
      setSoftwareList(mockData);
      setLoading(false);
    }, 500);
  };

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 검색 필드 변경 처리
  const handleSearchChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.version) return;
    
    if (editingId) {
      // 수정
      setSoftwareList(softwareList.map(sw => 
        sw.id === editingId ? { ...form, id: editingId } : sw
      ));
      setEditingId(null);
      setEditingSoftware(null);
    } else {
      // 신규 등록
      const newSoftware = { ...form, id: Date.now() };
      setSoftwareList([...softwareList, newSoftware]);
    }
    
    setForm({ name: "", version: "", license: "", vendor: "", description: "", category: "", status: "활성" });
    onViewChange('list');
  };

  // 검색 실행
  const handleSearch = () => {
    const results = softwareList.filter(sw => {
      return (!searchForm.name || sw.name.toLowerCase().includes(searchForm.name.toLowerCase())) &&
             (!searchForm.vendor || sw.vendor.toLowerCase().includes(searchForm.vendor.toLowerCase())) &&
             (!searchForm.category || sw.category === searchForm.category) &&
             (!searchForm.status || sw.status === searchForm.status);
    });
    setSearchResults(results);
    setSearchPerformed(true);
  };

  // 검색 초기화
  const handleSearchReset = () => {
    setSearchForm({ name: "", vendor: "", category: "", status: "" });
    setSearchResults([]);
    setSearchPerformed(false);
  };

  // 수정 시작
  const startEdit = (software) => {
    setEditingSoftware(software);
    setEditingId(software.id);
    setForm(software);
    setCurrentView('edit');
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingSoftware(null);
    setForm({ name: "", version: "", license: "", vendor: "", description: "", category: "", status: "활성" });
    onViewChange('list');
  };

  // 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setSoftwareList(softwareList.filter(sw => sw.id !== id));
    }
  };

  // 뷰 변경
  const handleViewChange = (view) => {
    if (view === 'list') {
      setEditingId(null);
      setEditingSoftware(null);
      setForm({ name: "", version: "", license: "", vendor: "", description: "", category: "", status: "활성" });
    }
    onViewChange(view);
  };

  // 목록 뷰 렌더링
  const renderListView = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2c3e50', textAlign: 'left' }}>
          소프트웨어 목록조회
          {searchPerformed && (searchPerformed ? searchResults : softwareList).length > 0 && (
            <span style={{ color: '#007bff', fontSize: '0.9em', fontWeight: 'normal' }}>
              ({searchPerformed ? searchResults.length : softwareList.length}건)
            </span>
          )}
        </h3>
      </div>

      {/* 검색 조건 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              소프트웨어명
            </label>
            <input
              name="name"
              value={searchForm.name}
              onChange={handleSearchChange}
              placeholder="소프트웨어명"
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
              벤더사
            </label>
            <input
              name="vendor"
              value={searchForm.vendor}
              onChange={handleSearchChange}
              placeholder="벤더사"
              style={{
                width: '100px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              카테고리
            </label>
            <select
              name="category"
              value={searchForm.category}
              onChange={handleSearchChange}
              style={{
                width: '100px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">전체</option>
              <option value="운영체제">운영체제</option>
              <option value="사무용">사무용</option>
              <option value="디자인">디자인</option>
              <option value="개발도구">개발도구</option>
              <option value="보안">보안</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              상태
            </label>
            <select
              name="status"
              value={searchForm.status}
              onChange={handleSearchChange}
              style={{
                width: '100px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">전체</option>
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
              <option value="단종">단종</option>
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
              🔄 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 소프트웨어 목록 테이블 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr style={{ backgroundColor: '#E9ECEF' }}>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '200px' }}>소프트웨어명</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '100px' }}>버전</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>라이선스</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>벤더사</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '150px' }}>카테고리</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '100px' }}>상태</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '300px' }}>설명</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', fontWeight: 'bold', minWidth: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : Array.isArray(searchPerformed ? searchResults : softwareList) && (searchPerformed ? searchResults : softwareList).length > 0 ? 
              (searchPerformed ? searchResults : softwareList).map((software, index) => (
                <tr key={software.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '200px' }}>{software.name || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '100px' }}>{software.version || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{software.license || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{software.vendor || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '150px' }}>{software.category || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '100px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: software.status === '활성' ? '#d4edda' : software.status === '비활성' ? '#fff3cd' : '#f8d7da',
                      color: software.status === '활성' ? '#155724' : software.status === '비활성' ? '#856404' : '#721c24'
                    }}>
                      {software.status || ''}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left', minWidth: '300px' }}>{software.description || ''}</td>
                  <td style={{ padding: '12px', textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button
                        onClick={() => startEdit(software)}
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
                      <button
                        onClick={() => handleDelete(software.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                    {searchPerformed ? '검색 조건에 맞는 데이터가 없습니다.' : '검색 조건을 입력하여 데이터를 조회해주세요.'}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 등록 뷰 렌더링
  const renderAddView = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2c3e50' }}>등록</h3>
        <button
          onClick={() => onViewChange('list')}
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
          ← 목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              소프트웨어명 *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              버전 *
            </label>
            <input
              name="version"
              value={form.version}
              onChange={handleChange}
              required
              maxLength={50}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              라이선스
            </label>
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              벤더사
            </label>
            <input
              name="vendor"
              value={form.vendor}
              onChange={handleChange}
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              카테고리
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">선택하세요</option>
              <option value="운영체제">운영체제</option>
              <option value="사무용">사무용</option>
              <option value="디자인">디자인</option>
              <option value="개발도구">개발도구</option>
              <option value="보안">보안</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              상태
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
              <option value="단종">단종</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left', marginTop: '8px' }}>
              설명
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
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

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {editingId ? '수정' : '등록'}
          </button>
          <button
            type="button"
            onClick={() => setForm({ name: "", version: "", license: "", vendor: "", description: "", category: "", status: "활성" })}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );

  // 수정 뷰 렌더링
  const renderEditView = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2c3e50' }}>수정</h3>
        <button
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
          ← 목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              소프트웨어명 *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              버전 *
            </label>
            <input
              name="version"
              value={form.version}
              onChange={handleChange}
              required
              maxLength={50}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              라이선스
            </label>
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              벤더사
            </label>
            <input
              name="vendor"
              value={form.vendor}
              onChange={handleChange}
              maxLength={100}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left' }}>
              카테고리
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">선택하세요</option>
              <option value="운영체제">운영체제</option>
              <option value="디자인">디자인</option>
              <option value="개발도구">개발도구</option>
              <option value="보안">보안</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'left' }}>
              상태
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
              <option value="단종">단종</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '100px', textAlign: 'left', marginTop: '8px' }}>
              설명
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
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

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            수정
          </button>
          <button
            type="button"
            onClick={handleEditCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      {currentView === 'list' && renderListView()}
      {currentView === 'add' && renderAddView()}
      {currentView === 'edit' && renderEditView()}
    </div>
  );
}

export default SoftwareManager; 