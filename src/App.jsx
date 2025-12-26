import React, { useState, useEffect } from 'react';
import TravelHome from './pages/TravelHome';
import TripPlanner from './pages/TripPlanner';
import { THEMES, GOOGLE_CLIENT_ID, SCOPES } from './utils/constants';
import { generateNewProjectData } from './utils/helpers';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeProject, setActiveProject] = useState(null);
  const [currentThemeId, setCurrentThemeId] = useState('mori');
  
  // --- LocalStorage Logic ---
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('tripPlanner_projects');
      return savedProjects ? JSON.parse(savedProjects) : [{ id: 1, name: '東京 5 日遊', lastModified: new Date().toISOString() }];
    } catch (e) {
      console.error("Failed to load projects", e);
      return [{ id: 1, name: '東京 5 日遊', lastModified: new Date().toISOString() }];
    }
  });

  const [allProjectsData, setAllProjectsData] = useState(() => {
    try {
      const savedData = localStorage.getItem('tripPlanner_allData');
      return savedData ? JSON.parse(savedData) : { 1: generateNewProjectData('東京 5 日遊') };
    } catch (e) {
      console.error("Failed to load project data", e);
      return { 1: generateNewProjectData('東京 5 日遊') };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tripPlanner_projects', JSON.stringify(projects));
    } catch (e) { console.error("Failed to save projects", e); }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('tripPlanner_allData', JSON.stringify(allProjectsData));
    } catch (e) { console.error("Failed to save project data", e); }
  }, [allProjectsData]);

  // --- Google API Logic ---
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) setGoogleUser({ accessToken: storedToken });

    const loadGapi = () => {
        const script = document.createElement('script');
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
            window.gapi.load('client', () => {
                window.gapi.client.init({}).then(() => {
                   Promise.all([
                       window.gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4'),
                       window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
                   ]).then(() => setGapiInited(true));
                });
            });
        };
        document.body.appendChild(script);
    };

    const loadGis = () => {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = () => {
            setGisInited(true);
        };
        document.body.appendChild(script);
    };

    loadGapi();
    loadGis();
  }, []);

  useEffect(() => {
      if (gapiInited && googleUser?.accessToken) {
          window.gapi.client.setToken({ access_token: googleUser.accessToken });
      }
  }, [gapiInited, googleUser]);

  useEffect(() => {
    if (gisInited) {
        try {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        setGoogleUser({ accessToken: tokenResponse.access_token });
                        localStorage.setItem('google_access_token', tokenResponse.access_token);
                    }
                },
            });
            setTokenClient(client);
        } catch (e) { console.error("Error initializing Google Token Client", e); }
    }
  }, [gisInited]);

  const handleGoogleLogin = () => tokenClient ? tokenClient.requestAccessToken() : alert("Google 服務尚未載入完成");
  
  const handleGoogleLogout = () => {
      const token = googleUser?.accessToken;
      if (token) {
          window.google.accounts.oauth2.revoke(token, () => {
              setGoogleUser(null);
              localStorage.removeItem('google_access_token');
              alert("已登出 Google 帳號");
          });
      } else {
          setGoogleUser(null);
          localStorage.removeItem('google_access_token');
      }
  };

  // 防呆：確保 Theme 存在，若不存在則使用預設值 mori
  const theme = (THEMES && currentThemeId && THEMES[currentThemeId]) ? THEMES[currentThemeId] : THEMES.mori; 

  const handleOpenProject = (project) => {
    const pData = allProjectsData[project.id];
    const savedThemeId = pData?.themeId || 'mori';
    setCurrentThemeId(savedThemeId);
    setActiveProject(project);
    setCurrentView('planner'); 
  };
  
  const handleBackToHome = () => { setCurrentView('home'); setActiveProject(null); };
  
  const handleAddProject = () => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const displayNum = (projects.length + 1).toString().padStart(2, '0');
    const newName = `我的旅程 ${displayNum}`;
    const newProject = { id: nextId, name: newName, lastModified: new Date().toISOString() };
    setProjects([...projects, newProject]);
    setAllProjectsData(prev => ({ ...prev, [nextId]: generateNewProjectData(newName) }));
  };
  
  const handleDeleteProject = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("確定要刪除此行程嗎？\n(若已登入 Google，雲端備份檔也會一併刪除)")) return;
    
    // Cloud Delete Logic
    if (googleUser && gapiInited) {
        const projectToDeleteData = allProjectsData[id];
        if (projectToDeleteData?.googleDriveFileId) {
             try { await window.gapi.client.drive.files.delete({ fileId: projectToDeleteData.googleDriveFileId }); } catch (err) {}
        }
    }
    setProjects(projects.filter(project => project.id !== id));
    setAllProjectsData(prev => { const newData = { ...prev }; delete newData[id]; return newData; });
  };
  
  const handleSaveProjectData = (projectId, newData) => {
    setAllProjectsData(prev => ({ ...prev, [projectId]: { ...prev[projectId], ...newData } }));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newData.tripSettings?.title || p.name, lastModified: new Date().toISOString() } : p));
    if (newData.tripSettings?.title && activeProject?.id === projectId) {
        setActiveProject(prev => ({ ...prev, name: newData.tripSettings.title })); 
    }
  };

  const handleThemeChange = (newThemeId) => {
    setCurrentThemeId(newThemeId);
    if (activeProject) {
        handleSaveProjectData(activeProject.id, { themeId: newThemeId });
    }
  };

  if (currentView === 'planner' && activeProject) {
    // 取得預設資料結構
    const defaultData = generateNewProjectData(activeProject.name);
    // 取得已儲存的資料 (若無則為空物件)
    const storedData = allProjectsData[activeProject.id] || {};
    
    // --- 嚴格的資料合併與防呆 ---
    // 確保幣別設定完整 (避免舊存檔缺少 selectedCountry 導致崩潰)
    const mergedCurrencySettings = { 
        ...defaultData.currencySettings, 
        ...(storedData.currencySettings || {}) 
    };
    if (!mergedCurrencySettings.selectedCountry) {
        mergedCurrencySettings.selectedCountry = defaultData.currencySettings.selectedCountry;
    }

    // 確保類別結構完整
    const mergedCategories = {
        itinerary: storedData.categories?.itinerary || defaultData.categories.itinerary,
        expense: storedData.categories?.expense || defaultData.categories.expense
    };

    // 合併最終的 Project Data
    const projectData = { 
        ...defaultData, 
        ...storedData, 
        tripSettings: { ...defaultData.tripSettings, ...(storedData.tripSettings || {}) }, 
        currencySettings: mergedCurrencySettings,
        categories: mergedCategories,
        // 確保列表類資料至少是空陣列/物件，避免為 null/undefined
        itineraries: storedData.itineraries || defaultData.itineraries,
        expenses: storedData.expenses || defaultData.expenses,
        packingList: storedData.packingList || defaultData.packingList,
        shoppingList: storedData.shoppingList || defaultData.shoppingList,
        foodList: storedData.foodList || defaultData.foodList,
        sightseeingList: storedData.sightseeingList || defaultData.sightseeingList,
        companions: storedData.companions || defaultData.companions
    };
    
    return (
      <TripPlanner 
        key={activeProject.id} 
        projectData={projectData} 
        onBack={handleBackToHome} 
        onSaveData={(newData) => handleSaveProjectData(activeProject.id, newData)} 
        theme={theme} 
        onChangeTheme={handleThemeChange} 
        googleUser={googleUser}
        gapiInited={gapiInited}
      />
    );
  }
  
  return (
    <TravelHome 
      projects={projects} 
      allProjectsData={allProjectsData}
      onAddProject={handleAddProject} 
      onDeleteProject={handleDeleteProject} 
      onOpenProject={handleOpenProject} 
      googleUser={googleUser}
      handleGoogleLogin={handleGoogleLogin}
      handleGoogleLogout={handleGoogleLogout}
    />
  );
}