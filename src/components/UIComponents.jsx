import React, { useState, useRef, useEffect } from 'react';
import { Users, User, ChevronDown, Map as MapIcon, List, Plus, Wallet, PieChart, Filter, Check, Calendar, Star, Utensils, Bus, ShoppingBag, Plane, Coffee, Home, Music } from 'lucide-react';
// Import the helper logic correctly to ensure consistency across the app
import { getAvatarColor } from '../utils/helpers';

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
        <span className="flex-1 text-left text-sm font-bold text-[#3A3A3A] truncate">{getLabel(value)}</span>
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
    ? `w-full h-full flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-black/5 transition-all outline-none rounded-r-xl`
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
        <span className="flex-1 text-left text-xs font-bold text-[#3A3A3A] truncate">
            {isAll ? '所有類別' : selectedCat?.label}
        </span>
        <ChevronDown size={14} className="text-[#CCC] shrink-0" />
      </button>

      {isOpen && (
        <div className={`absolute top-full w-full min-w-[150px] mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${variant === 'ghost' ? 'right-0' : 'left-0'}`}>
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

// --- NEW: Payer/Person Filter Select (圖示+人名下拉選單) ---
export const PersonSelect = ({ value, options, onChange, theme }) => {
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

  return (
    <div className="relative min-w-[8rem]" ref={containerRef}>
       <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex items-center gap-2 px-3 py-2 bg-white border ${theme.border} rounded-lg hover:border-[#A98467] transition-all shadow-sm h-10`}
      >
        {isAll ? (
            <div className="w-5 h-5 rounded bg-[#EBE9E4] text-[#888] flex items-center justify-center shrink-0"><Users size={12} /></div>
        ) : (
            <PayerAvatar name={value} companions={options} theme={theme} size="w-5 h-5" />
        )}
        <span className="flex-1 text-left text-xs font-bold text-[#3A3A3A] truncate">
            {isAll ? '所有代墊人' : value}
        </span>
        <ChevronDown size={14} className="text-[#CCC] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full min-w-[150px] mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => { onChange('all'); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors border-b border-[#F0F0F0] ${value === 'all' ? 'bg-[#F2F0EB]' : ''}`}
            >
              <div className="w-6 h-6 rounded bg-[#EBE9E4] text-[#888] flex items-center justify-center shrink-0"><Users size={14} /></div>
              <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">所有代墊人</span>
              {value === 'all' && <Check size={14} className="text-[#A98467]" />}
            </button>
            {options.map(person => (
                <button
                key={person}
                type="button"
                onClick={() => { onChange(person); setIsOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#F7F5F0] transition-colors ${value === person ? 'bg-[#F2F0EB]' : ''}`}
                >
                    <PayerAvatar name={person} companions={options} theme={theme} size="w-6 h-6" />
                    <span className="text-sm font-bold text-[#3A3A3A] flex-1 text-left">{person}</span>
                    {value === person && <Check size={14} className="text-[#A98467]" />}
                </button>
            ))}
        </div>
      )}
    </div>
  );
};

export const CompositeFilter = ({ dateValue, onDateChange, dateOptions, categoryValue, onCategoryChange, categoryOptions, theme }) => {
  return (
    <div className={`flex items-center bg-white border ${theme.border} rounded-xl shadow-sm hover:shadow-md transition-shadow h-10`}>
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

      <div className="w-px h-5 bg-[#E0E0E0] mx-0.5 shrink-0"></div>

      <CategorySelect 
        value={categoryValue} 
        options={categoryOptions} 
        onChange={onCategoryChange} 
        theme={theme}
        variant="ghost" 
      />
    </div>
  );
};

export const BottomNav = ({ theme, viewMode, setViewMode, openAddModal }) => (
  <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] pb-safe pt-2 px-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]`}>
     <div className="grid grid-cols-5 items-center h-14 pb-1">
        <button onClick={() => setViewMode('itinerary')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'itinerary' ? 'text-[#A98467]' : 'text-[#999]'}`}>
          <MapIcon size={22} strokeWidth={viewMode === 'itinerary' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-widest">行程</span>
        </button>
        <button onClick={() => setViewMode('checklist')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'checklist' ? 'text-[#A98467]' : 'text-[#999]'}`}>
          <List size={24} strokeWidth={viewMode === 'checklist' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-widest">清單</span>
        </button>
        <div className="flex justify-center items-center h-full relative">
          {viewMode !== 'categoryManager' && (
            <button onClick={openAddModal} className={`absolute -top-5 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-xl shadow-[#3A3A3A]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50`}>
              <Plus size={28} strokeWidth={2} />
            </button>
          )}
        </div>
        <button onClick={() => setViewMode('expenses')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'expenses' ? 'text-[#A98467]' : 'text-[#999]'}`}>
          <Wallet size={22} strokeWidth={viewMode === 'expenses' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-widest">費用</span>
        </button>
        <button onClick={() => setViewMode('statistics')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'statistics' ? 'text-[#A98467]' : 'text-[#999]'}`}>
          <PieChart size={22} strokeWidth={viewMode === 'statistics' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-widest">統計</span>
        </button>
     </div>
  </div>
);