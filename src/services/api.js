const API_BASE_URL = 'http://localhost:3001/api';

// 하드웨어 API
export const hardwareAPI = {
  // 하드웨어 목록 조회
  getHardwareList: async () => {
    const response = await fetch(`${API_BASE_URL}/hardware`);
    if (!response.ok) throw new Error('하드웨어 목록 조회 실패');
    return response.json();
  },

  // 하드웨어 등록
  createHardware: async (hardwareData) => {
    const response = await fetch(`${API_BASE_URL}/hardware`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hardwareData),
    });
    if (!response.ok) throw new Error('하드웨어 등록 실패');
    return response.json();
  },

  // 하드웨어 수정
  updateHardware: async (projectId, hardwareId, hardwareData) => {
    const response = await fetch(`${API_BASE_URL}/hardware/${projectId}/${hardwareId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hardwareData),
    });
    if (!response.ok) throw new Error('하드웨어 수정 실패');
    return response.json();
  },

  // 하드웨어 삭제
  deleteHardware: async (projectId, hardwareId) => {
    const response = await fetch(`${API_BASE_URL}/hardware/${projectId}/${hardwareId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('하드웨어 삭제 실패');
    return response.json();
  },
};

// 소프트웨어 API
export const softwareAPI = {
  // 소프트웨어 목록 조회
  getSoftwareList: async () => {
    const response = await fetch(`${API_BASE_URL}/software`);
    if (!response.ok) throw new Error('소프트웨어 목록 조회 실패');
    return response.json();
  },

  // 소프트웨어 등록
  createSoftware: async (softwareData) => {
    const response = await fetch(`${API_BASE_URL}/software`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(softwareData),
    });
    if (!response.ok) throw new Error('소프트웨어 등록 실패');
    return response.json();
  },
};

// 구매요청 API
export const purchaseRequestAPI = {
  // 구매요청 목록 조회
  getPurchaseRequestList: async () => {
    const response = await fetch(`${API_BASE_URL}/purchase-requests`);
    if (!response.ok) throw new Error('구매요청 목록 조회 실패');
    return response.json();
  },

  // 구매요청 등록
  createPurchaseRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/purchase-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('구매요청 등록 실패');
    return response.json();
  },
};

// 솔루션 API
export const solutionAPI = {
  // 솔루션 목록 조회
  getSolutionList: async () => {
    const response = await fetch(`${API_BASE_URL}/solutions`);
    if (!response.ok) throw new Error('솔루션 목록 조회 실패');
    return response.json();
  },

  // 서비스 영역 목록 조회
  getServiceAreas: async () => {
    const response = await fetch(`${API_BASE_URL}/service-areas`);
    if (!response.ok) throw new Error('서비스 영역 목록 조회 실패');
    return response.json();
  },

  // 솔루션 등록
  createSolution: async (solutionData) => {
    const response = await fetch(`${API_BASE_URL}/solutions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solutionData),
    });
    if (!response.ok) throw new Error('솔루션 등록 실패');
    return response.json();
  },

  // 솔루션 수정
  updateSolution: async (id, solutionData) => {
    console.log('API 호출 - 솔루션 수정:', { id, solutionData })
    const response = await fetch(`${API_BASE_URL}/solutions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solutionData),
    });
    console.log('API 응답 상태:', response.status, response.statusText)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API 오류 응답:', errorText)
      throw new Error('솔루션 수정 실패')
    }
    const result = await response.json()
    console.log('API 성공 응답:', result)
    return result
  },

  // 솔루션 삭제
  deleteSolution: async (id) => {
    const response = await fetch(`${API_BASE_URL}/solutions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('솔루션 삭제 실패');
    return response.json();
  },
};

// 서비스영역 API
export const serviceAreaAPI = {
  // 서비스영역 목록 조회
  getServiceAreaList: async () => {
    const response = await fetch(`${API_BASE_URL}/service-areas`);
    if (!response.ok) throw new Error('서비스영역 목록 조회 실패');
    return response.json();
  },

  // 서비스영역 등록
  createServiceArea: async (serviceAreaData) => {
    const response = await fetch(`${API_BASE_URL}/service-areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceAreaData),
    });
    if (!response.ok) throw new Error('서비스영역 등록 실패');
    return response.json();
  },

  // 서비스영역 수정
  updateServiceArea: async (id, serviceAreaData) => {
    const response = await fetch(`${API_BASE_URL}/service-areas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceAreaData),
    });
    if (!response.ok) throw new Error('서비스영역 수정 실패');
    return response.json();
  },

  // 서비스영역 삭제
  deleteServiceArea: async (id) => {
    const response = await fetch(`${API_BASE_URL}/service-areas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('서비스영역 삭제 실패');
    return response.json();
  },
};

// 프로젝트 API
export const getProjectList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('프로젝트 목록 조회 실패');
    return await response.json();
  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    console.log('프로젝트 등록 요청 데이터:', projectData);
    console.log('API URL:', `${API_BASE_URL}/projects`);
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    console.log('응답 상태:', response.status);
    console.log('응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('서버 응답 오류:', errorText);
      throw new Error(`프로젝트 등록 실패: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('등록 성공 결과:', result);
    return result;
  } catch (error) {
    console.error('프로젝트 등록 오류:', error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('프로젝트 수정 실패');
    return await response.json();
  } catch (error) {
    console.error('프로젝트 수정 오류:', error);
    throw error;
  }
}; 