import React, { useState } from 'react';
import { Plus, ChevronRight, X, LogIn, CloudDownload, Loader2, Sparkles, Scroll, Footprints } from 'lucide-react';
import { THEMES } from '../utils/constants';
import { formatLastModified } from '../utils/helpers';

const TravelHome = ({ projects, allProjectsData, onAddProject, onDeleteProject, onOpenProject, googleUser, handleGoogleLogin, handleGoogleLogout, onImportCloud, isImporting }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickingId, setClickingId] = useState(null);
  
  // Use Magic theme as default for Home
  const theme = THEMES.magic;

  const handleProjectClick = (project) => {
    setClickingId(project.id);
    setTimeout(() => {
      onOpenProject(project);
      setClickingId(null);
    }, 150);
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#2A2A2A] font-serif ${theme.selection} flex flex-col overflow-x-hidden relative`}>
      
      {/* 魔法動畫樣式定義 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes snitch-fly {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(100px, -40px) rotate(10deg); }
          50% { transform: translate(20px, 20px) rotate(-5deg); }
          75% { transform: translate(-50px, -20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes wing-flap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.2); }
        }
        @keyframes footprint-walk {
          0% { opacity: 0; }
          20% { opacity: 0.6; }
          60% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        .magic-float { animation: float 6s ease-in-out infinite; }
        .magic-twinkle { animation: twinkle 4s ease-in-out infinite; }
        .snitch-body { animation: snitch-fly 12s linear infinite; }
        .snitch-wing { animation: wing-flap 0.15s linear infinite; }
        
        /* 足跡動畫延遲序列 */
        .footprint-step { opacity: 0; animation: footprint-walk 5s linear infinite; }
        .step-1 { animation-delay: 0s; }
        .step-2 { animation-delay: 1s; }
        .step-3 { animation-delay: 2s; }
        .step-4 { animation-delay: 3s; }
      `}</style>

      {/* Magic Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
         {/* 1. 環境光暈 (Ambient Glows) */}
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#740001]/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
         
         {/* 2. 漂浮魔法物件 */}
         <div className="absolute top-20 left-10 text-[#740001] opacity-20 magic-float" style={{animationDelay: '0s'}}>
             <Scroll size={64} strokeWidth={1} />
         </div>
         <div className="absolute bottom-32 right-16 text-[#5C5548] opacity-10 magic-float" style={{animationDelay: '2s'}}>
             <Sparkles size={80} strokeWidth={0.5} />
         </div>
         <div className="absolute top-1/2 left-20 text-[#D4AF37] opacity-30 magic-twinkle" style={{animationDelay: '1s'}}>
             <Sparkles size={24} />
         </div>
         <div className="absolute top-1/4 right-1/4 text-[#740001] opacity-10 magic-twinkle" style={{animationDelay: '3s'}}>
             <Sparkles size={16} />
         </div>

         {/* 3. 劫盜地圖足跡 (Marauder's Map Footprints) */}
         <div className="absolute bottom-1/3 left-1/4 transform -rotate-12 opacity-40 text-[#4A2E1F]">
            <div className="relative w-40 h-40">
                <div className="absolute bottom-0 left-0 footprint-step step-1 transform -rotate-12">
                   <Footprints size={24} fill="currentColor" strokeWidth={0} />
                </div>
                <div className="absolute bottom-[40px] left-[30px] footprint-step step-2 transform rotate-6">
                   <Footprints size={24} fill="currentColor" strokeWidth={0} />
                </div>
                <div className="absolute bottom-[90px] left-[50px] footprint-step step-3 transform -rotate-6">
                   <Footprints size={24} fill="currentColor" strokeWidth={0} />
                </div>
                <div className="absolute bottom-[130px] left-[90px] footprint-step step-4 transform rotate-12">
                   <Footprints size={24} fill="currentColor" strokeWidth={0} />
                </div>
            </div>
         </div>

         {/* 4. 金探子 (Golden Snitch) */}
         <div className="absolute top-1/3 right-1/3 snitch-body opacity-90 z-0">
            <div className="relative flex items-center justify-center">
                {/* 左翅膀 */}
                <div className="w-8 h-3 bg-white/40 rounded-full snitch-wing origin-right absolute right-3 rotate-12"></div>
                {/* 本體 */}
                <div className="w-4 h-4 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] z-10 relative border border-[#B8860B]/50">
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                </div>
                {/* 右翅膀 */}
                <div className="w-8 h-3 bg-white/40 rounded-full snitch-wing origin-left absolute left-3 -rotate-12" style={{animationDelay: '-0.07s'}}></div>
            </div>
         </div>
      </div>

      <nav className={`w-full px-4 md:px-8 py-6 flex justify-between items-center border-b ${theme.border}/50 z-10 relative`}>
        <div className="flex items-center gap-2 group cursor-default">
            <div className={`w-8 h-8 ${theme.primaryBg} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-500`}>
                <Scroll size={16} />
            </div>
            <span className={`text-xl tracking-widest font-bold ${theme.primary} font-serif drop-shadow-sm`}> 𝐓𝐑𝐈𝐏 </span>
        </div>
        <div className="flex items-center gap-3">
            {googleUser && (
                <button 
                  onClick={onImportCloud} 
                  disabled={isImporting}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFCF5] border ${theme.border} text-xs font-bold ${theme.primary} hover:bg-[#E6DCC3] transition-colors shadow-sm`}
                  title="掃描 Google Drive 中開頭為 TravelApp_ 的檔案"
                >
                    {isImporting ? <Loader2 size={14} className="animate-spin"/> : <CloudDownload size={14} />}
                    {isImporting ? "施法召喚中..." : "召喚雲端卷軸"}
                </button>
            )}
            {googleUser ? (
                <button onClick={handleGoogleLogout} className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFCF5] border ${theme.border} text-xs font-bold text-[#888] hover:bg-[#E6DCC3] transition-colors shadow-sm`}>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> 巫師已登入
                </button>
            ) : (
                <button onClick={handleGoogleLogin} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.primaryBg} text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md border border-[#5C0922]`}>
                    <LogIn size={14} /> 登入魔法部
                </button>
            )}
        </div>
      </nav>
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative z-10">
        
        <div className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-2xl">
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold ${theme.primary} leading-tight tracking-widest mb-2 font-serif drop-shadow-md`}>𝔐𝔞𝔤𝔦𝔠𝔞𝔩 𝔍𝔬𝔲𝔯𝔫𝔢𝔶</h1>
          <p className="text-[#5C5548] text-sm md:text-base tracking-[0.4em] font-bold uppercase mb-8 flex items-center gap-4 opacity-80">
             <span className="h-px w-12 bg-[#C0B283]"></span> 
             𝐒𝐞𝐥𝐞𝐜𝐭 𝐘𝐨𝐮𝐫 𝐓𝐫𝐚𝐯𝐞𝐥 
             <span className="h-px w-12 bg-[#C0B283]"></span>
          </p>
          
          <div className="w-full max-w-sm flex flex-col gap-4 my-4 relative">
            {/* 列表背景裝飾 */}
            <div className="absolute -inset-4 bg-[#FFFDF9]/50 blur-xl -z-10 rounded-full"></div>
            
            {projects.map((project) => {
              // Retrieve project-specific theme
              const pData = allProjectsData[project.id] || {};
              const settings = pData.tripSettings || {};
              const projectThemeId = pData.themeId || 'magic'; // Default to magic
              const pTheme = THEMES[projectThemeId] || THEMES.magic;
              const isClicking = clickingId === project.id;
              
              const startDate = settings.startDate ? settings.startDate.replace(/-/g, '/') : '????/??/??';
              const endDate = settings.endDate ? settings.endDate.replace(/-/g, '/') : '????/??/??';

              return (
                <div 
                  key={project.id} 
                  onClick={() => handleProjectClick(project)} 
                  className={`group relative py-4 px-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex justify-between items-center overflow-hidden border backdrop-blur-sm
                    ${isClicking ? `${pTheme.primaryBg} border-transparent scale-[0.98]` : `bg-[#FFFCF5]/90 ${theme.border} hover:border-[#D4AF37] hover:bg-[#FFFDF9]`}
                  `}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-colors"></div>

                  <div className="flex flex-col items-start gap-1 pl-2">
                    <span className={`tracking-[0.1em] font-bold font-serif transition-colors text-left text-lg
                       ${isClicking ? 'text-white' : `text-[#2A2A2A] group-hover:${pTheme.primary}`}
                    `}>
                      {project.name}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-serif tracking-widest whitespace-nowrap ${isClicking ? 'text-white/80' : 'text-[#8C867A]'}`}>
                       {startDate} ⇢ {endDate} <span className="mx-1 opacity-40">|</span> {formatLastModified(project.lastModified)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className={`transition-all duration-300 ${isClicking ? 'text-white' : 'text-[#C0B283] group-hover:text-[#D4AF37] absolute right-8'}`} />
                    {!isClicking && (
                      <button 
                        onClick={(e) => onDeleteProject(e, project.id)} 
                        className={`opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFE5E5] text-[#C0B283] hover:text-[#8B0000]`} 
                        title="去去武器走 (刪除)"
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
            <button onClick={onAddProject} className={`group relative flex items-center gap-3 ${theme.primaryBg} text-white px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden border-2 border-[#5C0922]`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {/* Button Magic Shine Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              
              <span className="relative z-10 font-bold tracking-[0.2em] text-sm md:text-base font-serif">展開新冒險</span>
              <div className={`relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ${isHovered ? 'rotate-180 scale-110' : 'rotate-0'}`}>
                  <Plus size={16} />
              </div>
            </button>
          </div>
        </div>
      </main>
      <footer className={`w-full py-8 text-center text-[#8C867A] text-xs border-t ${theme.border} mt-auto font-serif relative z-10 bg-[#F2E8C4]/50 backdrop-blur-sm`}>
        <p className="tracking-widest opacity-80 flex items-center justify-center gap-2"> 
            <Sparkles size={10} /> I solemnly swear that I am up to no good. <Sparkles size={10} />
        </p>
      </footer>
    </div>
  );
};

export default TravelHome;