import React, { useState, useRef, useEffect } from 'react';
import { Users, User, ChevronDown, Map as MapIcon, List, Plus, Wallet, PieChart, Filter, Check, Calendar, Star, Utensils, Bus, ShoppingBag, Plane, Coffee, Home, Music, X, Share2, Loader2, Send } from 'lucide-react';

// --- Internal Helper Definitions (解決路徑引用問題) ---

const AVATAR_COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400',
  'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400',
  'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400',
  'bg-pink-400', 'bg-rose-400', 'bg-slate-400'
];

const getAvatarColor = (index) => {
  if (index < 0 || index === undefined) return 'bg-[#E0E0E0]';
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

const ICON_MAP = {
  'Star': Star,
  'Utensils': Utensils,
  'Bus': Bus,
  'ShoppingBag': ShoppingBag,
  'Plane': Plane,
  'Coffee': Coffee,
  'Home': Home,
  'Music': Music,
  'Wallet': Wallet
};

const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || Star;
};

// --- Premium Animated Icons (質感動畫圖示 - 循環動態版) ---

// 行程：地圖與路徑 (路徑循環描繪)
const ItineraryIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110 drop-shadow-lg' : 'opacity-60 grayscale'}`}>
    <defs>
      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FC3F7" />
        <stop offset="100%" stopColor="#0288D1" />
      </linearGradient>
    </defs>
    {/* 地圖摺頁背景 */}
    <path d="M20,20 L40,30 L60,20 L80,30 L80,90 L60,80 L40,90 L20,80 Z" fill={active ? "url(#mapGradient)" : "#E0E0E0"} stroke={active ? "#0277BD" : "#BDBDBD"} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M40,30 L40,90 M60,20 L60,80" stroke={active ? "rgba(255,255,255,0.3)" : "#BDBDBD"} strokeWidth="1" />
    
    {/* 定位點與路徑動畫 */}
    <g className={active ? "opacity-100" : "opacity-0 transition-opacity duration-300"}>
       {/* 虛線路徑 (Dash Animation Loop) */}
       <path d="M35,40 Q50,60 65,50" fill="none" stroke="white" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round">
          {active && <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" repeatCount="indefinite" />}
       </path>
       {/* 釘子跳動 (Loop) */}
       <g>
          <path d="M65,50 C65,50 65,35 65,35 C65,30 69,26 74,26 C79,26 83,30 83,35 C83,45 65,65 65,65" fill="#FF5252" stroke="#D32F2F" strokeWidth="1"/>
          <circle cx="74" cy="35" r="3" fill="white"/>
          {active && <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="1s" repeatCount="indefinite" />}
       </g>
       <circle cx="35" cy="40" r="4" fill="white" stroke="#0277BD" strokeWidth="2" />
    </g>
  </svg>
);

// 清單：打勾板 (板子搖擺 + 循環打勾)
const ChecklistIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110 drop-shadow-lg' : 'opacity-60 grayscale'}`}>
    <defs>
      <linearGradient id="listGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFCC80" />
        <stop offset="100%" stopColor="#FF9800" />
      </linearGradient>
    </defs>
    
    {/* 整個板子群組 (搖擺動畫) */}
    <g>
        {active && <animateTransform attributeName="transform" type="rotate" values="-2 50 10; 2 50 10; -2 50 10" dur="3s" repeatCount="indefinite" />}
        
        {/* 寫字板 */}
        <rect x="20" y="15" width="60" height="80" rx="6" fill={active ? "white" : "#F5F5F5"} stroke={active ? "#FFA000" : "#BDBDBD"} strokeWidth="2" />
        <path d="M20,25 L80,25" stroke={active ? "#FFECB3" : "#E0E0E0"} strokeWidth="1" />
        
        {/* 夾子 */}
        <rect x="35" y="10" width="30" height="10" rx="2" fill={active ? "url(#listGradient)" : "#9E9E9E"} />
        
        {/* 項目線條 */}
        <line x1="35" y1="40" x2="70" y2="40" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
        <line x1="35" y1="60" x2="70" y2="60" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
        <line x1="35" y1="80" x2="60" y2="80" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />

        {/* 打勾動畫 (循環) */}
        <g className={active ? "opacity-100" : "opacity-0"}>
           <path d="M25,38 L30,43 L40,33" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               {active && <animate attributeName="stroke-dasharray" values="0,100; 30,100; 30,100; 0,100" dur="2s" repeatCount="indefinite" />}
           </path>
           <path d="M25,58 L30,63 L40,53" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               {active && <animate attributeName="stroke-dasharray" values="0,100; 30,100; 30,100; 0,100" dur="2s" begin="0.5s" repeatCount="indefinite" />}
           </path>
        </g>
    </g>
  </svg>
);

// 新增：動態按鈕 (流光寶石質感 - 循環)
const AddIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${active ? 'scale-110' : ''}`}>
     <defs>
        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#EC407A">
             <animate attributeName="stop-color" values="#EC407A; #AB47BC; #EC407A" dur="4s" repeatCount="indefinite" />
           </stop>
           <stop offset="100%" stopColor="#7B1FA2">
             <animate attributeName="stop-color" values="#7B1FA2; #5C6BC0; #7B1FA2" dur="4s" repeatCount="indefinite" />
           </stop>
        </linearGradient>
        <filter id="gemGlow">
           <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
           <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
     </defs>
     
     {/* 外圈光環 (Pulse Loop) */}
     <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gemGradient)" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="r" values="38;48;38" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
     </circle>

     {/* 寶石本體 */}
     <circle cx="50" cy="50" r="38" fill="url(#gemGradient)" filter="url(#gemGlow)" className="drop-shadow-2xl" />
     
     {/* 內部高光 */}
     <ellipse cx="50" cy="35" rx="25" ry="12" fill="white" opacity="0.25" />
     <circle cx="65" cy="65" r="5" fill="white" opacity="0.1" />

     {/* 加號 */}
     <path d="M50,30 L50,70 M30,50 L70,50" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
  </svg>
);

// 費用：錢包 (循環跳出的金幣)
const ExpensesIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110 drop-shadow-lg' : 'opacity-60 grayscale'}`}>
    <defs>
        <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5D6A7" />
            <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
    </defs>
    {/* 後層鈔票 */}
    <rect x="25" y="25" width="50" height="30" rx="2" fill="#81C784" stroke="#2E7D32" strokeWidth="1" transform="rotate(-10 50 50)" />
    
    {/* 錢包本體 (輕微擠壓動畫) */}
    <path d="M20,40 Q20,30 30,30 L70,30 Q80,30 80,40 L80,80 Q80,90 70,90 L30,90 Q20,90 20,80 Z" fill={active ? "url(#walletGradient)" : "#E0E0E0"} stroke={active ? "#1B5E20" : "#BDBDBD"} strokeWidth="2" />
    <path d="M20,50 L80,50" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>

    {/* 金幣跳動動畫 (循環) */}
    <g className={active ? "opacity-100" : "opacity-0"}>
        <circle cx="50" cy="20" r="10" fill="#FFD54F" stroke="#F57F17" strokeWidth="1">
            {active && <animate attributeName="cy" values="40;15;40" dur="1.2s" repeatCount="indefinite" />}
            {active && <animate attributeName="r" values="10;11;10" dur="1.2s" repeatCount="indefinite" />}
        </circle>
        <text x="50" y="24" fontSize="12" textAnchor="middle" fill="#E65100" fontWeight="bold">
            {active && <animate attributeName="y" values="44;19;44" dur="1.2s" repeatCount="indefinite" />}
            $
        </text>
    </g>
  </svg>
);

// 統計：圓餅圖 (循環數據浮動)
const StatisticsIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110 drop-shadow-lg' : 'opacity-60 grayscale'}`}>
    {/* 圓餅背景 */}
    <circle cx="50" cy="50" r="35" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="10" />
    
    {/* 動態區塊 1 (旋轉) */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="#BA68C8" strokeWidth="10" strokeDasharray="60 220" strokeDashoffset="25" className="origin-center -rotate-90">
         {active && <animate attributeName="stroke-dasharray" values="60 220; 80 220; 60 220" dur="3s" repeatCount="indefinite" />}
    </circle>
    
    {/* 動態區塊 2 (旋轉) */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="#4DD0E1" strokeWidth="10" strokeDasharray="100 220" strokeDashoffset="-35" className="origin-center -rotate-90">
         {active && <animate attributeName="stroke-dasharray" values="100 220; 120 220; 100 220" dur="4s" repeatCount="indefinite" />}
    </circle>

    {/* 中心數據 (Bar Chart Loop Animation) */}
    <circle cx="50" cy="50" r="20" fill="white" className="drop-shadow-sm" />
    <rect x="42" y="42" width="6" height="16" rx="1" fill={active ? "#BA68C8" : "#BDBDBD"}>
         {active && <animate attributeName="height" values="16; 24; 10; 16" dur="1.5s" repeatCount="indefinite" />}
         {active && <animate attributeName="y" values="42; 34; 48; 42" dur="1.5s" repeatCount="indefinite" />}
    </rect>
    <rect x="52" y="35" width="6" height="23" rx="1" fill={active ? "#4DD0E1" : "#BDBDBD"}>
         {active && <animate attributeName="height" values="23; 10; 25; 23" dur="2s" repeatCount="indefinite" />}
         {active && <animate attributeName="y" values="35; 48; 33; 35" dur="2s" repeatCount="indefinite" />}
    </rect>
  </svg>
);


// --- Components ---

export const PayerAvatar = ({ name, companions, theme, size = "w-4 h-4" }) => {
  let idx = companions ? companions.indexOf(name) : -1;
  if (idx === -1) idx = 99;
  
  return (
    <div className={`${size} rounded-full ${getAvatarColor(idx)} flex items-center justify-center text-white text-[8px] font-bold font-serif shrink-0 border border-white shadow-sm`}>
      {name ? name.charAt(0) : '?'}
    </div>
  );
};

export const AvatarSelect = ({ value, options, onChange, theme, companions, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (val) => {
    if (val === 'ALL') return '均攤';
    if (val === 'EACH') return '各付';
    return val;
  };

  const renderAvatar = (val, size = "w-6 h-6", fontSize = "text-xs") => {
    if (val === 'ALL') return <div className={`${size} rounded-full bg-[#5C5C5C] text-white flex items-center justify-center ${fontSize}`}><Users size={12} /></div>;
    if (val === 'EACH') return <div className={`${size} rounded-full bg-[#A98467] text-white flex items-center justify-center ${fontSize}`}><User size={12} /></div>;
    
    let idx = companions ? companions.indexOf(val) : -1;
    if (idx === -1) idx = 99;
    return (
      <div className={`${size} rounded-full ${getAvatarColor(idx)} border border-white flex items-center justify-center text-white ${fontSize} font-bold shadow-sm`}>
        {val ? val.charAt(0).toUpperCase() : '?'}
      </div>
    );
  };

  return (
    <div className={`relative min-w-[5rem] flex-1 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} ref={containerRef}>
      <button 
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        className={`w-full flex items-center gap-2 pl-2 pr-2 py-1.5 bg-white border-b ${theme.border} ${!disabled ? `hover:border-${theme.primary}` : ''} transition-all`}
      >
        {renderAvatar(value)}
        <span className="flex-1 text-left text-sm font-bold text-[#3A3A3A] whitespace-nowrap">{getLabel(value)}</span>
        {!disabled && <ChevronDown size={12} className="text-[#CCC]" />}
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 w-full min-w-[120px] mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F7F5F0] transition-colors ${value === opt ? 'bg-[#F2F0EB]' : ''}`}
            >
              {renderAvatar(opt)}
              <span className="text-sm font-bold text-[#3A3A3A]">{getLabel(opt)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const PayerFilterSelect = ({ value, options, onChange, theme, companions, variant = 'default' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const isAll = value === 'all';
    
    const renderAvatar = (name, size = "w-5 h-5", fontSize = "text-[10px]") => {
        let idx = companions ? companions.indexOf(name) : -1;
        if (idx === -1) idx = 99;
        return (
          <div className={`${size} rounded-full ${getAvatarColor(idx)} border border-white flex items-center justify-center text-white ${fontSize} font-bold shadow-sm shrink-0`}>
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
        );
    };

    const buttonClass = variant === 'ghost'
    ? `w-full h-full flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-black/5 transition-all outline-none rounded-r-xl`
    : `w-full flex items-center gap-2 px-3 py-2 bg-white border ${theme.border} rounded-lg hover:border-[#A98467] transition-all shadow-sm h-10`;

    const containerClass = `relative ${variant === 'ghost' ? 'flex-1 min-w-0' : 'min-w-[9rem]'}`;

    return (
      <div className={containerClass} ref={containerRef}>
         <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)} 
          className={buttonClass}
        >
          {isAll ? (
               <div className="w-5 h-5 rounded bg-[#EBE9E4] text-[#888] flex items-center justify-center shrink-0"><Users size={12} /></div>
          ) : (
               renderAvatar(value)
          )}
          <span className="flex-1 text-left text-xs font-bold text-[#3A3A3A] whitespace-nowrap">
              {isAll ? '所有人員' : value}
          </span>
          <ChevronDown size={14} className="text-[#CCC] shrink-0" />
        </button>
  
        {isOpen && (
          <div className={`absolute top-full w-full min-w-[140px] mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${variant === 'ghost' ? 'right-0' : 'left-0'}`}>
              <button
                type="button"
                onClick={() => { onChange('all'); setIsOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors border-b border-[#F0F0F0] ${value === 'all' ? 'bg-[#F2F0EB]' : ''}`}
              >
                <div className="w-6 h-6 rounded bg-[#EBE9E4] text-[#888] flex items-center justify-center shrink-0"><Users size={14} /></div>
                <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">所有人員</span>
                {value === 'all' && <Check size={14} className="text-[#A98467]" />}
              </button>
              {options.map(person => (
                  <button
                  key={person}
                  type="button"
                  onClick={() => { onChange(person); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors ${value === person ? 'bg-[#F2F0EB]' : ''}`}
                  >
                      {renderAvatar(person, "w-6 h-6", "text-xs")}
                      <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">{person}</span>
                      {value === person && <Check size={14} className="text-[#A98467]" />}
                  </button>
              ))}
          </div>
        )}
      </div>
    );
  };

export const CategorySelect = ({ value, options, onChange, theme, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCat = options.find(c => c.id === value);
  const isAll = value === 'all';
  const SelectedIcon = isAll ? Filter : getIconComponent(selectedCat?.icon || 'Star');

  const buttonClass = variant === 'ghost'
    ? `w-full h-full flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-black/5 transition-all outline-none rounded-none` 
    : `w-full flex items-center gap-2 px-3 py-2 bg-white border ${theme.border} rounded-lg hover:border-[#A98467] transition-all shadow-sm`;

  const containerClass = `relative ${variant === 'ghost' ? 'flex-1 min-w-0' : 'min-w-[8rem]'}`;

  return (
    <div className={containerClass} ref={containerRef}>
       <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={buttonClass}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isAll ? 'bg-[#EBE9E4] text-[#888]' : `${theme.primaryBg} text-white`}`}>
            <SelectedIcon size={12} />
        </div>
        <span className="flex-1 text-left text-xs font-bold text-[#3A3A3A] whitespace-nowrap">
            {isAll ? '所有類別' : selectedCat?.label}
        </span>
        <ChevronDown size={14} className="text-[#CCC] shrink-0" />
      </button>

      {isOpen && (
        <div className={`absolute top-full w-full min-w-[150px] mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${variant === 'ghost' ? 'left-[-20px]' : 'left-0'}`}>
            <button
              type="button"
              onClick={() => { onChange('all'); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors border-b border-[#F0F0F0] ${value === 'all' ? 'bg-[#F2F0EB]' : ''}`}
            >
              <div className="w-6 h-6 rounded bg-[#EBE9E4] text-[#888] flex items-center justify-center shrink-0"><Filter size={14} /></div>
              <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">所有類別</span>
              {value === 'all' && <Check size={14} className="text-[#A98467]" />}
            </button>
            {options.map(cat => {
                const CatIcon = getIconComponent(cat.icon);
                return (
                    <button
                    key={cat.id}
                    type="button"
                    onClick={() => { onChange(cat.id); setIsOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors ${value === cat.id ? 'bg-[#F2F0EB]' : ''}`}
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${theme.primaryBg} text-white opacity-90`}>
                            <CatIcon size={14} />
                        </div>
                        <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">{cat.label}</span>
                        {value === cat.id && <Check size={14} className="text-[#A98467]" />}
                    </button>
                )
            })}
        </div>
      )}
    </div>
  );
};

export const CompositeFilter = ({ 
    dateValue, onDateChange, dateOptions, 
    categoryValue, onCategoryChange, categoryOptions, 
    payerValue, onPayerChange, payerOptions, companions,
    theme 
}) => {
  return (
    <div className={`flex items-center bg-white border ${theme.border} rounded-xl shadow-sm hover:shadow-md transition-shadow h-10`}>
      {/* Date Filter */}
      <div className="relative group px-2 h-full flex items-center hover:bg-black/5 transition-colors rounded-l-xl border-r border-transparent">
        <Calendar size={14} className="text-[#888] ml-2 mr-1 shrink-0"/>
        <select
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="appearance-none bg-transparent py-2 pl-1 pr-7 text-xs font-bold text-[#3A3A3A] focus:outline-none cursor-pointer w-full min-w-[5rem]"
        >
          {dateOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2 text-[#CCC] pointer-events-none"/>
      </div>
      
      {/* Divider */}
      <div className="w-px h-5 bg-[#E0E0E0] mx-0.5 shrink-0"></div>
      
      {/* Category Filter */}
      <CategorySelect 
        value={categoryValue} 
        options={categoryOptions} 
        onChange={onCategoryChange} 
        theme={theme}
        variant="ghost" 
      />

      {/* Divider */}
      <div className="w-px h-5 bg-[#E0E0E0] mx-0.5 shrink-0"></div>

      {/* Payer Filter (New) */}
      <PayerFilterSelect 
        value={payerValue}
        options={payerOptions}
        onChange={onPayerChange}
        theme={theme}
        companions={companions}
        variant="ghost"
      />
    </div>
  );
};

// --- NEW: Share Modal for Collaboration ---
export const ShareModal = ({ isOpen, onClose, onInvite, isInviting, theme }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      onInvite(email);
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
      <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col border ${theme.border} animate-in zoom-in-95 duration-200`}>
        <div className="p-6 border-b border-[#F0F0F0] flex justify-between items-center">
            <h2 className="text-lg font-bold font-serif text-[#3A3A3A] flex items-center gap-2">
              <Share2 size={20} className={theme.primary}/> 邀請協作人員
            </h2>
            <button onClick={onClose}><X size={20} className="text-[#999] hover:text-[#666]" /></button>
        </div>
        <div className="p-6 space-y-4">
            <p className="text-xs text-[#888] leading-relaxed">
              輸入對方的 Google Email，將此旅程的雲端檔案權限分享給對方。對方將能檢視並編輯此行程。
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#888] mb-1.5">Google Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-10 py-3 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder}`} 
                  />
                  <div className="absolute right-3 top-3 text-[#CCC]"><Users size={16}/></div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isInviting || !email}
                className={`w-full py-3 rounded-lg text-sm font-bold text-white ${theme.primaryBg} hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {isInviting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                {isInviting ? "發送邀請中..." : "發送邀請"}
              </button>
            </form>
            <div className="bg-[#F9F9F9] p-3 rounded-lg border border-[#EEE] text-[10px] text-[#999]">
               <div className="font-bold mb-1">💡 協作說明：</div>
               <ul className="list-disc pl-4 space-y-1">
                 <li>對方需登入本 App 並使用「雲端掃描匯入」功能。</li>
                 <li>受邀者將擁有此檔案的<b>編輯權限</b>。</li>
                 <li>建議邀請後，將對方名字加入「旅伴管理」以便分帳。</li>
               </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Modified Bottom Navigation with Premium Animated Icons (Floating Style + Micro-Invisible Background) ---
export const BottomNav = ({ theme, viewMode, setViewMode, openAddModal }) => {
  // 根據主題是否為深色模式，決定微隱形背景的漸層顏色
  const isDark = theme?.isDark;
  const gradientClass = isDark 
    ? "from-[#212121]/90 via-[#212121]/50" 
    : "from-[#FDFCFB]/90 via-[#FDFCFB]/50";

  return (
    // 增加背景漸層與模糊，達成「微隱形」效果 (pointer-events-none 讓點擊穿透空白處)
    <div className={`fixed bottom-0 left-0 right-0 z-40 pb-safe pt-12 px-2 pointer-events-none bg-gradient-to-t ${gradientClass} to-transparent backdrop-blur-[2px]`}>
       {/* 調整 max-w-6xl 讓間距更寬，h-24 讓高度能容納特大 Icon */}
       <div className="flex justify-between items-end h-24 pb-3 pointer-events-auto max-w-6xl mx-auto px-8">
          {/* 行程 */}
          <button onClick={() => setViewMode('itinerary')} className={`group flex flex-col items-center gap-1.5 transition-all duration-300 w-20 hover:-translate-y-1`}>
            <div className="w-10 h-10 relative">
               <ItineraryIcon active={viewMode === 'itinerary'} />
            </div>
            <span className={`text-[11px] font-bold tracking-widest ${viewMode === 'itinerary' ? 'text-[#0288D1] drop-shadow-sm scale-110' : 'text-[#888] opacity-60'} transition-all`}>行程</span>
          </button>
  
          {/* 清單 */}
          <button onClick={() => setViewMode('checklist')} className={`group flex flex-col items-center gap-1.5 transition-all duration-300 w-20 hover:-translate-y-1`}>
            <div className="w-10 h-10 relative">
               <ChecklistIcon active={viewMode === 'checklist'} />
            </div>
            <span className={`text-[11px] font-bold tracking-widest ${viewMode === 'checklist' ? 'text-[#FF9800] drop-shadow-sm scale-110' : 'text-[#888] opacity-60'} transition-all`}>清單</span>
          </button>
  
          {/* 新增 - 浮動超大按鈕 (流光寶石) */}
          <div className="flex justify-center items-center relative -top-6">
            {viewMode !== 'categoryManager' && (
              <button 
                onClick={openAddModal} 
                className={`w-20 h-20 rounded-full shadow-[0_10px_25px_-5px_rgba(123,31,162,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50 overflow-hidden relative group`}
                title="新增項目"
              >
                <div className="relative w-full h-full p-2">
                   <AddIcon active={true} />
                </div>
              </button>
            )}
          </div>
  
          {/* 費用 */}
          <button onClick={() => setViewMode('expenses')} className={`group flex flex-col items-center gap-1.5 transition-all duration-300 w-20 hover:-translate-y-1`}>
            <div className="w-10 h-10 relative">
               <ExpensesIcon active={viewMode === 'expenses'} />
            </div>
            <span className={`text-[11px] font-bold tracking-widest ${viewMode === 'expenses' ? 'text-[#388E3C] drop-shadow-sm scale-110' : 'text-[#888] opacity-60'} transition-all`}>費用</span>
          </button>
  
          {/* 統計 */}
          <button onClick={() => setViewMode('statistics')} className={`group flex flex-col items-center gap-1.5 transition-all duration-300 w-20 hover:-translate-y-1`}>
            <div className="w-10 h-10 relative">
               <StatisticsIcon active={viewMode === 'statistics'} />
            </div>
            <span className={`text-[11px] font-bold tracking-widest ${viewMode === 'statistics' ? 'text-[#7B1FA2] drop-shadow-sm scale-110' : 'text-[#888] opacity-60'} transition-all`}>統計</span>
          </button>
       </div>
    </div>
  );
};