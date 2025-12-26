import React, { useState, useRef, useEffect } from 'react';
import { Users, User, ChevronDown, Map as MapIcon, List, Plus, Wallet, PieChart } from 'lucide-react';
import { getAvatarColor } from '../utils/helpers';

export const PayerAvatar = ({ name, companions, theme, size = "w-4 h-4" }) => {
  let idx = companions.indexOf(name);
  if (idx === -1) idx = 99;
  
  return (
    <div className={`${size} rounded-full ${getAvatarColor(idx)} flex items-center justify-center ${theme.primary} text-[8px] font-bold font-serif shrink-0 border border-white`}>
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
    if (val === 'ALL') return <div className={`${size} rounded-full bg-[#3A3A3A] text-white flex items-center justify-center ${fontSize}`}><Users size={12} /></div>;
    if (val === 'EACH') return <div className={`${size} rounded-full bg-[#A98467] text-white flex items-center justify-center ${fontSize}`}><User size={12} /></div>;
    
    let idx = companions.indexOf(val);
    if (idx === -1) idx = 99;
    return (
      <div className={`${size} rounded-full ${getAvatarColor(idx)} border border-white flex items-center justify-center ${theme.primary} ${fontSize} font-bold`}>
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
        className={`w-full flex items-center gap-2 pl-2 pr-2 py-1 bg-white border-b ${theme.border} ${!disabled ? `hover:${theme.primaryBorder}` : ''} transition-all`}
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

export const BottomNav = ({ theme, viewMode, setViewMode, openAddModal }) => (
  <div className={`fixed bottom-0 left-0 right-0 ${theme.card}/90 backdrop-blur-md border-t ${theme.border} pb-6 pt-2 px-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}>
     <div className="grid grid-cols-5 items-center h-16 pb-2">
        <button onClick={() => setViewMode('itinerary')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'itinerary' ? theme.navActive : theme.navInactive}`}>
          <MapIcon size={22} strokeWidth={viewMode === 'itinerary' ? 2 : 1.5} />
          <span className="text-[10px] font-bold tracking-widest">行程表</span>
        </button>
        <button onClick={() => setViewMode('checklist')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'checklist' ? theme.navActive : theme.navInactive}`}>
          <List size={24} strokeWidth={viewMode === 'checklist' ? 2 : 1.5} />
          <span className="text-[10px] font-bold tracking-widest">清單</span>
        </button>
        <div className="flex justify-center items-center h-full relative">
          {viewMode !== 'categoryManager' && (
            <button onClick={openAddModal} className={`absolute -top-6 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-lg shadow-[#3A3A3A]/30 hover:scale-105 ${theme.primaryBg} transition-all flex items-center justify-center z-50`}>
              <Plus size={28} strokeWidth={1.5} />
            </button>
          )}
        </div>
        <button onClick={() => setViewMode('expenses')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'expenses' ? theme.navActive : theme.navInactive}`}>
          <Wallet size={22} strokeWidth={viewMode === 'expenses' ? 2 : 1.5} />
          <span className="text-[10px] font-bold tracking-widest">費用</span>
        </button>
        <button onClick={() => setViewMode('statistics')} className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'statistics' ? theme.navActive : theme.navInactive}`}>
          <PieChart size={22} strokeWidth={viewMode === 'statistics' ? 2 : 1.5} />
          <span className="text-[10px] font-bold tracking-widest">統計</span>
        </button>
     </div>
  </div>
);