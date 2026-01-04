import React, { useState } from 'react';
import { Plus, ChevronRight, X, LogIn, CloudDownload, Loader2, Sparkles, Scroll, Ghost } from 'lucide-react';
import { THEMES } from '../utils/constants';
import { formatLastModified } from '../utils/helpers';

const TravelHome = ({ projects, allProjectsData, onAddProject, onDeleteProject, onOpenProject, googleUser, handleGoogleLogin, handleGoogleLogout, onImportCloud, isImporting }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickingId, setClickingId] = useState(null);
  
  // 使用湯屋主題作為首頁預設風格 (Red/Gold)
  const theme = THEMES.bathhouse;

  const handleProjectClick = (project) => {
    setClickingId(project.id);
    setTimeout(() => {
      onOpenProject(project);
      setClickingId(null);
    }, 150);
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#2A2A2A] font-serif ${theme.selection} flex flex-col overflow-x-hidden relative`}>
      
      {/* 神隱少女動畫樣式定義 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes soot-move {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -10px) scale(0.9); }
          50% { transform: translate(40px, 0px) scale(1); }
          75% { transform: translate(20px, 10px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes star-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes steam-rise {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.6; transform: translateY(-20px) scale(1.5); }
          100% { opacity: 0; transform: translateY(-40px) scale(2); }
        }
        .magic-float { animation: float 6s ease-in-out infinite; }
        .soot-sprite { animation: soot-move 8s ease-in-out infinite; }
        .star-candy { animation: star-spin 10s linear infinite; }
        .bath-steam { animation: steam-rise 4s ease-out infinite; }
      `}</style>

      {/* Background Decorations - 湯屋與神靈世界 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
         {/* 1. 環境氛圍 - 油屋燈籠光暈 */}
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#C62828]/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#FFB300]/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
         
         {/* 2. 煤炭精靈 (Susuwatari) */}
         <div className="absolute top-20 left-10 opacity-80 soot-sprite" style={{animationDelay: '0s'}}>
             <div className="w-8 h-8 bg-[#212121] rounded-full blur-[1px] relative">
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full">
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full">
                     <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
             </div>
         </div>
         <div className="absolute bottom-32 right-16 opacity-60 soot-sprite" style={{animationDelay: '2s'}}>
             <div className="w-12 h-12 bg-[#212121] rounded-full blur-[1px] relative flex items-center justify-center">
                 {/* 抱著星星糖 */}
                 <div className="w-4 h-4 bg-[#FFEB3B] rotate-45 star-candy shadow-[0_0_10px_#FFEB3B]"></div>
             </div>
         </div>
         <div className="absolute top-1/2 left-20 opacity-40 soot-sprite" style={{animationDelay: '1s'}}>
             <div className="w-6 h-6 bg-[#212121] rounded-full blur-[1px]"></div>
         </div>

         {/* 3. 紙人 (Paper Birds) - 追逐白龍 */}
         <div className="absolute top-1/4 right-1/4 opacity-30 magic-float" style={{animationDelay: '3s'}}>
             <Ghost size={24} className="transform rotate-12 text-white fill-current" />
         </div>
         <div className="absolute top-1/3 right-1/3 opacity-20 magic-float" style={{animationDelay: '4s'}}>
             <Ghost size={16} className="transform -rotate-12 text-white fill-current" />
         </div>

         {/* 4. 湯屋蒸汽 */}
         <div className="absolute bottom-0 w-full flex justify-around opacity-30">
             <div className="w-8 h-8 bg-white/50 rounded-full blur-xl bath-steam" style={{animationDelay: '0s'}}></div>
             <div className="w-12 h-12 bg-white/50 rounded-full blur-xl bath-steam" style={{animationDelay: '1.5s'}}></div>
             <div className="w-10 h-10 bg-white/50 rounded-full blur-xl bath-steam" style={{animationDelay: '3s'}}></div>
         </div>
      </div>

      <nav className={`w-full px-4 md:px-8 py-6 flex justify-between items-center border-b ${theme.border}/50 z-10 relative bg-white/30 backdrop-blur-sm`}>
        <div className="flex items-center gap-2 group cursor-default">
            <span className={`text-xl tracking-widest font-bold ${theme.primary} font-serif drop-shadow-sm`}> 𝚃𝚛𝚊𝚟𝚎𝚕 </span>
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
                    {isImporting ? "契約召喚中..." : "讀取契約"}
                </button>
            )}
            {googleUser ? (
                <button onClick={handleGoogleLogout} className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFCF5] border ${theme.border} text-xs font-bold text-[#888] hover:bg-[#E6DCC3] transition-colors shadow-sm`}>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> 湯屋員工
                </button>
            ) : (
                <button onClick={handleGoogleLogin} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.primaryBg} text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md border border-[#B71C1C]`}>
                    <LogIn size={14} /> 簽署契約 (登入)
                </button>
            )}
        </div>
      </nav>
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative z-10">
        
        <div className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-2xl">
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold ${theme.primary} leading-tight tracking-widest mb-2 font-serif drop-shadow-md flex items-center gap-4`}>
              <span className="text-4xl opacity-50 block md:hidden">♨️</span>
              奇幻の旅程
          </h1>
          <p className="text-[#5C5548] text-sm md:text-base tracking-[0.4em] font-bold uppercase mb-8 flex items-center gap-4 opacity-80">
             <span className="h-px w-12 bg-[#C62828]"></span> 
             𝖲𝖤𝖫𝖤𝖢𝖳 𝖸𝖮𝖴𝖱 𝖳𝖱𝖠𝖵𝖤𝖫
             <span className="h-px w-12 bg-[#C62828]"></span>
          </p>
          
          <div className="w-full max-w-sm flex flex-col gap-4 my-4 relative">
            {/* 列表背景裝飾 */}
            <div className="absolute -inset-4 bg-[#FFFDF9]/50 blur-xl -z-10 rounded-full"></div>
            
            {projects.map((project) => {
              // Retrieve project-specific theme
              const pData = allProjectsData[project.id] || {};
              const settings = pData.tripSettings || {};
              const projectThemeId = pData.themeId || 'chihiro'; // Default to chihiro
              const pTheme = THEMES[projectThemeId] || THEMES.chihiro;
              const isClicking = clickingId === project.id;
              
              const startDate = settings.startDate ? settings.startDate.replace(/-/g, '.') : '????.??.??';
              const endDate = settings.endDate ? settings.endDate.replace(/-/g, '.') : '????.??.??';

              // Determine icon based on theme
              const ThemeIcon = projectThemeId === 'noface' ? Ghost : 
                                projectThemeId === 'haku' ? Scroll :
                                projectThemeId === 'bathhouse' ? Sparkles : Scroll;

              return (
                <div 
                  key={project.id} 
                  onClick={() => handleProjectClick(project)} 
                  className={`group relative py-4 px-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex justify-between items-center overflow-hidden border backdrop-blur-sm
                    ${isClicking ? `${pTheme.primaryBg} border-transparent scale-[0.98]` : `bg-white/90 ${theme.border} hover:border-[#FFB300] hover:bg-[#FFFDF9]`}
                  `}
                >
                  {/* Decorative corner - Bath Ticket style */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${pTheme.primaryBg} opacity-20 group-hover:opacity-100 transition-opacity`}></div>

                  <div className="flex flex-col items-start gap-1 pl-4">
                    <div className="flex items-center gap-2">
                         <span className={`text-xs px-1.5 py-0.5 rounded border ${pTheme.border} ${pTheme.primary} bg-white opacity-70`}>{pTheme.label.split(' ')[0]}</span>
                         <span className={`tracking-[0.1em] font-bold font-serif transition-colors text-left text-lg ${isClicking ? 'text-white' : `text-[#2A2A2A] group-hover:${pTheme.primary}`}`}>
                           {project.name}
                         </span>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-serif tracking-widest whitespace-nowrap pl-1 ${isClicking ? 'text-white/80' : 'text-[#8C867A]'}`}>
                       {startDate} <span className="mx-1 opacity-40">⇢</span> {endDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ThemeIcon size={20} className={`transition-all duration-300 ${isClicking ? 'text-white' : `${pTheme.accent} opacity-50 group-hover:opacity-100 group-hover:scale-110`}`} />
                    <ChevronRight size={16} className={`transition-all duration-300 ${isClicking ? 'text-white' : 'text-[#CCC] group-hover:text-[#FFB300] '}`} />
                    {!isClicking && (
                      <button 
                        onClick={(e) => onDeleteProject(e, project.id)} 
                        className={`opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFE5E5] text-[#D32F2F]`} 
                        title="解除契約 (刪除)"
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
            <button onClick={onAddProject} className={`group relative flex items-center gap-3 ${theme.primaryBg} text-white px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden border-2 border-[#B71C1C]`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {/* Button Magic Shine Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              
              <span className="relative z-10 font-bold tracking-[0.2em] text-sm md:text-base font-serif">新的冒險契約</span>
              <div className={`relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ${isHovered ? 'rotate-180 scale-110' : 'rotate-0'}`}>
                  <Plus size={16} />
              </div>
            </button>
          </div>
        </div>
      </main>
      <footer className={`w-full py-8 text-center text-[#8C867A] text-xs border-t ${theme.border} mt-auto font-serif relative z-10 bg-white/50 backdrop-blur-sm`}>
        <p className="tracking-widest opacity-80 flex items-center justify-center gap-2"> 
            <Sparkles size={10} /> © ℭℨℌ <Sparkles size={10} />
        </p>
      </footer>
    </div>
  );
};

export default TravelHome;