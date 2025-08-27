import { useState } from 'react'
import HardwareManager from './components/HardwareManager'
import SoftwareManager from './components/SoftwareManager'
import SolutionManager from './components/SolutionManager'
import PurchaseRequestManager from './components/PurchaseRequestManager'
import ProjectManager from './components/ProjectManager'
import './App.css'

function App() {
  const [currentMenu, setCurrentMenu] = useState('project')
  const [currentSubMenu, setCurrentSubMenu] = useState('list') // list, add, edit, delete

  const renderContent = () => {
    switch (currentMenu) {
      case 'project':
        return <ProjectManager currentView={currentSubMenu} onViewChange={setCurrentSubMenu} />
      case 'hardware':
        return <HardwareManager currentView={currentSubMenu} onViewChange={setCurrentSubMenu} />
      case 'software':
        return <SoftwareManager />
      case 'solution':
        return <SolutionManager currentView={currentSubMenu} onViewChange={setCurrentSubMenu} />
      case 'purchase':
        return <PurchaseRequestManager />
      default:
        return <ProjectManager currentView={currentSubMenu} onViewChange={setCurrentSubMenu} />
    }
  }

  const menuItems = [
    { 
      id: 'project', 
      name: '프로젝트 관리', 
      icon: '📋',
      subMenus: [
        { id: 'list', name: '조회', icon: '📋' },
        { id: 'add', name: '등록', icon: '➕' },
        { id: 'edit', name: '수정', icon: '✏️' }
      ]
    },
    { 
      id: 'hardware', 
      name: '하드웨어 관리', 
      icon: '💻',
      subMenus: [
        { id: 'list', name: '조회', icon: '📋' },
        { id: 'add', name: '등록', icon: '➕' },
        { id: 'edit', name: '수정', icon: '✏️' },
        { id: 'delete', name: '삭제', icon: '🗑️' }
      ]
    },
    { id: 'software', name: '소프트웨어 관리', icon: '🖥️' },
    { 
      id: 'solution', 
      name: '솔루션 관리', 
      icon: '🔧',
      subMenus: [
        { id: 'list', name: '조회', icon: '📋' },
        { id: 'add', name: '등록', icon: '➕' },
        { id: 'edit', name: '수정', icon: '✏️' },
        { id: 'delete', name: '삭제', icon: '🗑️' },
        { id: 'service-areas', name: '서비스영역 조회', icon: '🏷️' }
      ]
    },
    { id: 'purchase', name: '구매요청 관리', icon: '📋' }
  ]

  const currentMenuItem = menuItems.find(item => item.id === currentMenu)

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
    }}>
      {/* 왼쪽 사이드바 */}
      <div style={{
        width: '280px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        {/* 로고/제목 */}
        <div style={{
          padding: '0 20px 20px 20px',
          borderBottom: '1px solid #34495e',
          marginBottom: '20px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ecf0f1'
          }}>
            Matrix System
          </h1>
          <p style={{
            margin: '5px 0 0 0',
            fontSize: '0.9rem',
            color: '#bdc3c7'
          }}>
            (하드웨어/소프트웨어)
          </p>
        </div>

        {/* 메뉴 아이템들 */}
        <nav>
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* 메인 메뉴 버튼 */}
              <button
                onClick={() => {
                  setCurrentMenu(item.id);
                  if (item.subMenus) {
                    setCurrentSubMenu('list');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: currentMenu === item.id ? '#3498db' : 'transparent',
                  color: currentMenu === item.id ? 'white' : '#ecf0f1',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  borderLeft: currentMenu === item.id ? '4px solid #2980b9' : '4px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (currentMenu !== item.id) {
                    e.target.style.backgroundColor = '#34495e'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMenu !== item.id) {
                    e.target.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.name}
              </button>

              {/* 하위메뉴 (하위메뉴가 있는 경우에만) */}
              {item.subMenus && currentMenu === item.id && (
                <div style={{
                  backgroundColor: '#34495e',
                  padding: '10px 0'
                }}>
                  {item.subMenus.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentSubMenu(subItem.id)}
                      style={{
                        width: '100%',
                        padding: '10px 20px 10px 50px',
                        backgroundColor: currentSubMenu === subItem.id ? '#2980b9' : 'transparent',
                        color: currentSubMenu === subItem.id ? 'white' : '#bdc3c7',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (currentSubMenu !== subItem.id) {
                          e.target.style.backgroundColor = '#2c3e50'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentSubMenu !== subItem.id) {
                          e.target.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{subItem.icon}</span>
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 오른쪽 메인 컨텐츠 */}
      <div style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: '30px',
        overflowY: 'auto'
      }}>
        {/* 페이지 헤더: 프로젝트 관리 > 조회에서는 숨김 */}
                    {!(currentMenu === 'project' && currentSubMenu === 'list') && !(currentMenu === 'project' && currentSubMenu === 'add') && !(currentMenu === 'project' && currentSubMenu === 'edit') && !(currentMenu === 'hardware' && currentSubMenu === 'add') && !(currentMenu === 'hardware' && currentSubMenu === 'list') && !(currentMenu === 'hardware' && currentSubMenu === 'edit') && !(currentMenu === 'hardware' && currentSubMenu === 'delete') && !(currentMenu === 'solution') && (
          <div style={{
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '2rem',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              {currentMenuItem?.name}
              {currentMenuItem?.subMenus && (
                <span style={{ fontSize: '1.5rem', color: '#6c757d', marginLeft: '10px' }}>
                  - {currentMenuItem.subMenus.find(sub => sub.id === currentSubMenu)?.name}
                </span>
              )}
            </h2>
            <p style={{
              margin: '10px 0 0 0',
              color: '#6c757d',
              fontSize: '1rem'
            }}>
              {currentMenu === 'project' && currentSubMenu === 'list' && '프로젝트 목록을 조회합니다.'}
              {currentMenu === 'project' && currentSubMenu === 'edit' && '프로젝트 정보를 수정합니다.'}
              {currentMenu === 'hardware' && currentSubMenu === 'list' && ''}
              {currentMenu === 'hardware' && currentSubMenu === 'add' && ''}
              {currentMenu === 'hardware' && currentSubMenu === 'edit' && ''}

              {currentMenu === 'software' && '소프트웨어 자산을 등록하고 관리합니다.'}
              {currentMenu === 'purchase' && '구매요청을 등록하고 관리합니다.'}
            </p>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App
