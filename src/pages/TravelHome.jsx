import React, { useState } from 'react';
import { Plus, ChevronRight, X, LogIn, CloudDownload, Loader2 } from 'lucide-react';
import { THEMES } from '../utils/constants';
import { formatLastModified } from '../utils/helpers';

const TravelHome = ({ projects, allProjectsData, onAddProject, onDeleteProject, onOpenProject, googleUser, handleGoogleLogin, handleGoogleLogout, onImportCloud, isImporting }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickingId, setClickingId] = useState(null);
  
  // Requirement: Force Home Page to use 'Mori' theme always
  const theme = THEMES.mori;

  const handleProjectClick = (project) => {
    setClickingId(project.id);
    setTimeout(() => {
      onOpenProject(project);
      setClickingId(null);
    }, 150);
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-serif ${theme.selection} flex flex-col`}>
      <nav className={`w-full px-4 md:px-8 py-6 flex justify-between items-center border-b ${theme.border}/50`}>
        <div className="flex items-center gap-2"><div className={`w-4 h-4 ${theme.primaryBg} rounded-full opacity-80`}></div><span className={`text-xl tracking-widest font-bold ${theme.primary}`}> 𝐓𝐑𝐀𝐕𝐄𝐋 </span></div>
        <div className="flex items-center gap-3">
            {googleUser && (
                <button 
                  onClick={onImportCloud} 
                  disabled={isImporting}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E6E2D3] text-xs font-bold text-[#5F6F52] hover:bg-[#F2F0EB] transition-colors`}
                  title="掃描 Google Drive 中開頭為 TravelApp_ 的檔案"
                >
                    {isImporting ? <Loader2 size={14} className="animate-spin"/> : <CloudDownload size={14} />}
                    {isImporting ? "掃描匯入中..." : "雲端掃描匯入"}
                </button>
            )}
            {googleUser ? (
                <button onClick={handleGoogleLogout} className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E6E2D3] text-xs font-bold text-[#888] hover:bg-[#F2F0EB] transition-colors`}>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Google 已登入
                </button>
            ) : (
                <button onClick={handleGoogleLogin} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.primaryBg} text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm`}>
                    <LogIn size={14} /> 登入 Google
                </button>
            )}
        </div>
      </nav>
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
        <div className={`absolute top-10 left-10 w-64 h-64 rounded-full ${theme.bg === 'bg-[#EAEAEA]' ? 'bg-[#CCCCCC]' : 'bg-[#E6E2D3]'} opacity-20 blur-3xl -z-10 animate-pulse`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full ${theme.primaryBg} opacity-5 blur-3xl -z-10`}></div>
        <div className="flex flex-col items-center justify-center space-y-8 z-10 text-center w-full max-w-2xl">
          <h1 className={`text-3xl md:text-6xl lg:text-7xl font-light ${theme.primary} leading-tight tracking-widest mb-2`}>我的旅程</h1>
          <p className="text-[#888888] text-sm md:text-base tracking-[0.4em] font-light uppercase mb-8">SELECT YOUR JOURNEY</p>
          <div className="w-full max-w-sm flex flex-col gap-4 my-4">
            {projects.map((project) => {
              // Retrieve project-specific theme
              const pData = allProjectsData[project.id] || {};
              const settings = pData.tripSettings || {};
              const projectThemeId = pData.themeId || 'mori';
              const pTheme = THEMES[projectThemeId] || THEMES.mori;
              const isClicking = clickingId === project.id;
              
              const startDate = settings.startDate ? settings.startDate.replace(/-/g, '/') : '????/??/??';
              const endDate = settings.endDate ? settings.endDate.replace(/-/g, '/') : '????/??/??';

              return (
                <div 
                  key={project.id} 
                  onClick={() => handleProjectClick(project)} 
                  className={`group relative py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex justify-between items-center overflow-hidden border
                    ${isClicking ? `${pTheme.primaryBg} border-transparent scale-[0.98]` : `bg-[#FFFFFF] ${theme.border} hover:bg-[#F2F0EB]`}
                  `}
                >
                  {/* Hover indicator strip using Project's color */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${pTheme.primaryBg.replace('bg-', 'bg-opacity-80 bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="flex flex-col items-start gap-1 pl-2">
                    <span className={`tracking-[0.2em] font-light transition-colors text-left
                       ${isClicking ? 'text-white' : `text-[#464646] group-hover:${pTheme.primary}`}
                    `}>
                      {project.name}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-sans tracking-widest whitespace-nowrap ${isClicking ? 'text-white/80' : 'text-[#888888]'}`}>
                       {startDate} ⇢ {endDate} <span className="mx-1 opacity-40">|</span> {formatLastModified(project.lastModified)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className={`transition-all duration-300 ${isClicking ? 'text-white' : 'text-[#E6E2D3] group-hover:opacity-0 absolute right-8'}`} />
                    {!isClicking && (
                      <button 
                        onClick={(e) => onDeleteProject(e, project.id)} 
                        className={`opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFF0F0] text-[#E6E2D3] hover:text-[#C55A5A]`} 
                        title="刪除"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-8">
            <button onClick={onAddProject} className={`group relative flex items-center gap-3 ${theme.primaryBg} text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-500 ease-out overflow-hidden`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span><span className="relative z-10 font-medium tracking-widest text-sm md:text-base">新增旅程</span><div className={`relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ${isHovered ? 'rotate-90' : 'rotate-0'}`}><Plus size={16} /></div>
            </button>
          </div>
        </div>
      </main>
      <footer className={`w-full py-8 text-center text-[#888888] text-xs border-t ${theme.border} mt-auto`}><p className="tracking-widest"> © 𝟤𝟢𝟤𝟧 ꜱʜᴜᴜ ᴄᴢʜ. </p></footer>
    </div>
  );
};

export default TravelHome;