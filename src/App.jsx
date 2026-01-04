import React, { useState, useEffect } from 'react';
import TravelHome from './pages/TravelHome';
import TripPlanner from './pages/TripPlanner';
import { THEMES, GOOGLE_CLIENT_ID, SCOPES } from './utils/constants';
import { generateNewProjectData, parseProjectDataFromGAPI } from './utils/helpers';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeProject, setActiveProject] = useState(null);
  // DEFAULT THEME SET TO CHIHIRO
  const [currentThemeId, setCurrentThemeId] = useState('chihiro');
  const [isImporting, setIsImporting] = useState(false);
  
  // --- Global Styles for Spirited Away Animations ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }
      @keyframes soot-run {
        0% { transform: translateX(0) scale(1); }
        10% { transform: translateX(5px) scale(0.9, 1.1); }
        20% { transform: translateX(0) scale(1); }
        100% { transform: translateX(0); }
      }
      @keyframes lantern-sway {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes steam {
        0% { opacity: 0; transform: translateY(0) scale(1); }
        50% { opacity: 0.5; transform: translateY(-20px) scale(1.2); }
        100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
      }
      @keyframes haku-fly {
        0% { transform: translateX(-100vw) translateY(20vh) rotate(5deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateX(100vw) translateY(-20vh) rotate(-5deg); opacity: 0; }
      }
      @keyframes bounce-heads {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      @keyframes no-face-fade {
        0%, 100% { opacity: 0.1; transform: scale(0.95); }
        50% { opacity: 0.3; transform: scale(1); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-soot { animation: soot-run 2s ease-in-out infinite; }
      .animate-lantern { animation: lantern-sway 4s ease-in-out infinite; }
      .animate-steam { animation: steam 3s ease-out infinite; }
      .animate-haku { animation: haku-fly 20s linear infinite; }
      .animate-heads { animation: bounce-heads 2s ease-in-out infinite; }
      .animate-noface { animation: no-face-fade 8s ease-in-out infinite; }
      
      /* Scrollbar Styling */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { bg: transparent; }
      ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #999; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // --- LocalStorage Logic ---
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('tripPlanner_projects');
      return savedProjects ? JSON.parse(savedProjects) : [{ id: 1, name: '神隱之旅', lastModified: new Date().toISOString() }];
    } catch (e) {
      console.error("Failed to load projects", e);
      return [{ id: 1, name: '神隱之旅', lastModified: new Date().toISOString() }];
    }
  });

  const [allProjectsData, setAllProjectsData] = useState(() => {
    try {
      const savedData = localStorage.getItem('tripPlanner_allData');
      return savedData ? JSON.parse(savedData) : { 1: generateNewProjectData('神隱之旅') };
    } catch (e) {
      console.error("Failed to load project data", e);
      return { 1: generateNewProjectData('神隱之旅') };
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

  // --- Cloud Import Logic ---
  const handleImportFromCloud = async () => {
    if (!googleUser || !gapiInited) {
        alert("請先登入 Google 帳號才能使用雲端匯入功能。");
        return;
    }

    setIsImporting(true);
    let importedCount = 0;

    try {
        const q = "name contains 'TravelApp_' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
        const response = await window.gapi.client.drive.files.list({
            q: q,
            fields: 'files(id, name, modifiedTime, mimeType)',
            orderBy: 'modifiedTime desc',
            pageSize: 50
        });

        const files = response.result.files;
        if (!files || files.length === 0) {
            alert("在雲端硬碟中找不到任何包含 'TravelApp_' 的 Google 試算表。\n\n提示：\n1. 如果您剛複製檔案，請稍等幾秒再試。\n2. 請確認檔案是 Google 試算表格式，而非直接上傳的 .xlsx 檔。");
            setIsImporting(false);
            return;
        }

        const newProjects = [];
        const newProjectsData = {};
        
        const existingFileIds = new Set(
            Object.values(allProjectsData)
                .map(p => p.googleDriveFileId)
                .filter(id => id)
        );

        for (const file of files) {
            if (existingFileIds.has(file.id)) {
                continue; 
            }

            console.log(`Processing file: ${file.name} (${file.id})`);

            try {
                const ranges = [
                    "專案概覽!A:B", "行程表!A:H", "費用!A:I", 
                    "管理類別!A:E", "行李!A:B", "購物!A:F", "美食!A:F", "景點!A:F"
                ];
                
                const sheetRes = await window.gapi.client.sheets.spreadsheets.values.batchGet({
                    spreadsheetId: file.id,
                    ranges: ranges,
                    valueRenderOption: 'FORMATTED_VALUE'
                });

                const projectData = parseProjectDataFromGAPI(file.id, file.name, sheetRes.result.valueRanges);
                
                const currentMaxId = Math.max(
                    ...projects.map(p => p.id), 
                    ...newProjects.map(p => p.id), 
                    0
                );
                const nextId = currentMaxId + 1;

                const newProjectHeader = {
                    id: nextId,
                    name: projectData.tripSettings.title,
                    lastModified: file.modifiedTime
                };

                newProjects.push(newProjectHeader);
                newProjectsData[nextId] = projectData;
                importedCount++;
            } catch (err) {
                console.warn(`Failed to parse file ${file.name}:`, err);
            }
        }

        if (importedCount > 0) {
            setProjects(prev => [...prev, ...newProjects]);
            setAllProjectsData(prev => ({ ...prev, ...newProjectsData }));
            alert(`掃描完成！成功匯入 ${importedCount} 個新旅程。`);
        } else {
            alert(`掃描完成，未發現新檔案。\n(找到 ${files.length} 個檔案，但它們都已經在您的列表中了)`);
        }

    } catch (error) {
        console.error("Cloud Import Error:", error);
        if (error.result?.error?.code === 403 || error.status === 403) {
            alert("權限不足。我們更新了 Google Drive 存取權限設定以支援掃描功能。\n\n請登出 Google 帳號後，重新登入並授權即可解決。");
        } else {
            alert("匯入失敗，請檢查網路連線。");
        }
    } finally {
        setIsImporting(false);
    }
  };

  // Get current Theme object (Defaults to Chihiro)
  const theme = (THEMES && currentThemeId && THEMES[currentThemeId]) ? THEMES[currentThemeId] : THEMES.chihiro; 

  const handleOpenProject = (project) => {
    const pData = allProjectsData[project.id];
    // Default to chihiro if no theme saved
    const savedThemeId = pData?.themeId || 'chihiro';
    setCurrentThemeId(savedThemeId);
    setActiveProject(project);
    setCurrentView('planner'); 
  };
  
  const handleBackToHome = () => { setCurrentView('home'); setActiveProject(null); };
  
  const handleAddProject = () => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const displayNum = (projects.length + 1).toString().padStart(2, '0');
    const newName = `神隱之旅 ${displayNum}`;
    const newProject = { id: nextId, name: newName, lastModified: new Date().toISOString() };
    setProjects([...projects, newProject]);
    setAllProjectsData(prev => ({ ...prev, [nextId]: generateNewProjectData(newName) }));
  };
  
  const handleDeleteProject = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("確定要刪除此行程嗎？\n(若已登入 Google，雲端備份檔也會一併刪除)")) return;
    
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
    const defaultData = generateNewProjectData(activeProject.name);
    const storedData = allProjectsData[activeProject.id] || {};
    
    const mergedCurrencySettings = { 
        ...defaultData.currencySettings, 
        ...(storedData.currencySettings || {}) 
    };
    if (!mergedCurrencySettings.selectedCountry) {
        mergedCurrencySettings.selectedCountry = defaultData.currencySettings.selectedCountry;
    }

    const mergedCategories = {
        itinerary: storedData.categories?.itinerary || defaultData.categories.itinerary,
        expense: storedData.categories?.expense || defaultData.categories.expense
    };

    const projectData = { 
        ...defaultData, 
        ...storedData, 
        tripSettings: { ...defaultData.tripSettings, ...(storedData.tripSettings || {}) }, 
        currencySettings: mergedCurrencySettings,
        categories: mergedCategories,
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
      onImportCloud={handleImportFromCloud}
      isImporting={isImporting}
    />
  );
}