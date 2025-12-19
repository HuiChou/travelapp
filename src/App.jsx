import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Plus, ChevronRight, X, Plane, Hotel, Coffee, Camera, MapPin, Train, 
  Trash2, Edit3, GripVertical, Clock, Settings, Flower2, PenTool, Utensils,
  ArrowRight, Coins, Calculator, Copy, Globe, Check, Navigation, Users, 
  User, Minus, List, ShoppingBag, Luggage, Map as MapIcon, UtensilsCrossed, 
  Receipt, PieChart, TrendingUp, Wallet, ArrowLeftRight, Home, Palette, Download, Upload, Loader2
} from 'lucide-react';

// --- 全域主題設定 (Themes) ---

const THEMES = {
  mori: { 
    id: 'mori',
    label: '森', 
    bg: 'bg-[#F9F8F6]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#5F6F52]', 
    primaryHex: '#5F6F52',
    primaryBg: 'bg-[#5F6F52]',
    primaryBorder: 'border-[#5F6F52]',
    accent: 'text-[#A98467]',
    accentHex: '#A98467',
    hover: 'hover:bg-[#F2F0EB]',
    subText: 'text-[#888888]',
    border: 'border-[#E6E2D3]',
    danger: 'text-[#C55A5A]',
    dangerBg: 'bg-[#FFF0F0]',
    navActive: 'text-[#5F6F52]',
    navInactive: 'text-[#A0A0A0]',
    selection: 'selection:bg-[#D8D0C5] selection:text-[#464646]'
  },
  umi: { 
    id: 'umi',
    label: '海', 
    bg: 'bg-[#F0F6F9]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#4A7C96]', 
    primaryHex: '#4A7C96',
    primaryBg: 'bg-[#4A7C96]',
    primaryBorder: 'border-[#4A7C96]',
    accent: 'text-[#D48D56]', 
    accentHex: '#D48D56',
    hover: 'hover:bg-[#E6F0F5]',
    subText: 'text-[#8899A6]',
    border: 'border-[#DDE6EB]',
    danger: 'text-[#D66D75]',
    dangerBg: 'bg-[#FFF0F0]',
    navActive: 'text-[#4A7C96]',
    navInactive: 'text-[#A0B0C0]',
    selection: 'selection:bg-[#CDE3EB] selection:text-[#2C4A5A]'
  },
  sakura: { 
    id: 'sakura',
    label: '櫻', 
    bg: 'bg-[#FFF5F7]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#B06D85]', 
    primaryHex: '#B06D85',
    primaryBg: 'bg-[#B06D85]',
    primaryBorder: 'border-[#B06D85]',
    accent: 'text-[#9C8C74]', 
    accentHex: '#9C8C74',
    hover: 'hover:bg-[#FDF0F2]',
    subText: 'text-[#998888]',
    border: 'border-[#EBD6DA]',
    danger: 'text-[#D9534F]',
    dangerBg: 'bg-[#FFF0F0]',
    navActive: 'text-[#B06D85]',
    navInactive: 'text-[#C0A0A0]',
    selection: 'selection:bg-[#FADCE3] selection:text-[#5A303C]'
  },
  kouhi: { 
    id: 'kouhi',
    label: '咖啡', 
    bg: 'bg-[#F7F3EF]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#8C6A5D]', 
    primaryHex: '#8C6A5D',
    primaryBg: 'bg-[#8C6A5D]',
    primaryBorder: 'border-[#8C6A5D]',
    accent: 'text-[#BC8F8F]', 
    accentHex: '#BC8F8F',
    hover: 'hover:bg-[#EBE5DE]',
    subText: 'text-[#968C83]',
    border: 'border-[#DBCCC2]',
    danger: 'text-[#A94442]',
    dangerBg: 'bg-[#FFF0F0]',
    navActive: 'text-[#8C6A5D]',
    navInactive: 'text-[#B0A69E]',
    selection: 'selection:bg-[#E3D4CB] selection:text-[#4A3832]'
  },
  sumi: { 
    id: 'sumi',
    label: '墨', 
    bg: 'bg-[#EAEAEA]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#404040]', 
    primaryHex: '#404040',
    primaryBg: 'bg-[#404040]',
    primaryBorder: 'border-[#404040]',
    accent: 'text-[#707070]', 
    accentHex: '#707070',
    hover: 'hover:bg-[#F0F0F0]',
    subText: 'text-[#888888]',
    border: 'border-[#CCCCCC]',
    danger: 'text-[#555555]',
    dangerBg: 'bg-[#E0E0E0]',
    navActive: 'text-[#222222]',
    navInactive: 'text-[#AAAAAA]',
    selection: 'selection:bg-[#CCCCCC] selection:text-[#000000]'
  }
};

const AVATAR_COLORS = [
  'bg-[#F4D5D5]', 'bg-[#C6D8B6]', 'bg-[#BDD7EE]', 
  'bg-[#FDE6C6]', 'bg-[#E0D3DE]', 'bg-[#D8E2DC]',
];

const COUNTRY_OPTIONS = [
  { code: 'JP', name: '日本', flag: '🇯🇵', currency: 'JPY', symbol: '¥', defaultRate: 0.20 },
  { code: 'KR', name: '韓國', flag: '🇰🇷', currency: 'KRW', symbol: '₩', defaultRate: 0.024 },
  { code: 'TH', name: '泰國', flag: '🇹🇭', currency: 'THB', symbol: '฿', defaultRate: 0.90 },
  { code: 'US', name: '美國', flag: '🇺🇸', currency: 'USD', symbol: '$', defaultRate: 31.5 },
  { code: 'MY', name: '馬來西亞', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', defaultRate: 6.8 },
];

const EXPENSE_CATEGORIES = {
  food: { label: '餐飲', icon: Utensils },
  transport: { label: '交通', icon: Train },
  shopping: { label: '購物', icon: ShoppingBag },
  stay: { label: '住宿', icon: Hotel },
  ticket: { label: '票券', icon: Plane },
  other: { label: '其他', icon: Coins },
};

const ICON_MAP = {
  sightseeing: { icon: Camera, label: '景點', color: 'bg-[#F2F4F1]' }, 
  food: { icon: Utensils, label: '美食', color: 'bg-[#F7F0ED]' },
  cafe: { icon: Coffee, label: '咖啡', color: 'bg-[#F4EDE6]' },
  transport: { icon: Train, label: '交通', color: 'bg-[#EFF1F3]' },
  hotel: { icon: Hotel, label: '住宿', color: 'bg-[#EEEFF2]' },
  shopping: { icon: MapPin, label: '購物', color: 'bg-[#F9F5F0]' },
  flight: { icon: Plane, label: '飛行', color: 'bg-[#EFF4F7]' },
};

// --- Logo Component (High Quality Plane) ---
const AppLogo = ({ theme }) => (
  <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${theme.primaryBg} text-white border border-white/20`}>
    <Plane size={18} className="-rotate-45 translate-x-0.5 translate-y-0.5" strokeWidth={2.5} />
  </div>
);

// --- 工具函式 (Helpers) ---

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;
  if (hours >= 24) hours = hours % 24;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const formatDurationDisplay = (minutes) => {
  if (minutes < 0) return "時間重疊";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}小時 ${m}分`;
  if (h > 0) return `${h}小時`;
  return `${m}分`;
};

const formatMoney = (amount) => amount ? Math.round(amount).toLocaleString() : '0';

const getNextDay = (dateStr) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

const calculateDaysDiff = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays >= 1 ? diffDays + 1 : 1; 
};

const formatDate = (dateString, addDays) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { text: 'N/A', day: '', full: '' };
  date.setDate(date.getDate() + addDays);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()];
  return { text: `${month}/${day}`, day: weekDay, full: date.toISOString().split('T')[0] };
};

const sortItemsByTime = (items) => [...items].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

const sortExpensesByRegionAndCategory = (items) => {
  const catOrder = Object.keys(EXPENSE_CATEGORIES);
  return [...items].sort((a, b) => {
    const regionA = a.region || 'zzzz';
    const regionB = b.region || 'zzzz';
    if (regionA !== regionB) return regionA.localeCompare(regionB);
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
  });
};

const getAvatarColor = (index) => {
  if (index < 0 || index === undefined) return 'bg-[#E0E0E0]';
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

const solveDebts = (balances) => {
  let debtors = [];
  let creditors = [];
  
  Object.entries(balances).forEach(([name, data]) => {
    const amount = data.balance;
    if (amount < -1) debtors.push({ name, amount });
    if (amount > 1) creditors.push({ name, amount });
  });

  debtors.sort((a, b) => a.amount - b.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    let debtor = debtors[i];
    let creditor = creditors[j];
    let amount = Math.min(Math.abs(debtor.amount), creditor.amount);
    
    transactions.push({ from: debtor.name, to: creditor.name, amount });
    
    debtor.amount += amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 1) i++;
    if (creditor.amount < 1) j++;
  }
  return transactions;
};

const formatLastModified = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const utc8Time = date.getTime() + (8 * 60 * 60 * 1000); 
  const utc8Date = new Date(utc8Time);
  
  const yyyy = utc8Date.getUTCFullYear();
  const mm = String(utc8Date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc8Date.getUTCDate()).padStart(2, '0');
  const HH = String(utc8Date.getUTCHours()).padStart(2, '0');
  const MM = String(utc8Date.getUTCMinutes()).padStart(2, '0');
  
  return `${yyyy}/${mm}/${dd} ${HH}:${MM}`;
};

// --- 預設範本資料 (Templates) ---

const getDefaultItinerary = () => ({
  0: [
    { id: 101, type: 'flight', title: '抵達東京', time: '10:00', duration: 60, location: '成田機場', cost: 0, website: '', notes: '領取 Wifi' },
    { id: 102, type: 'transport', title: '搭乘 NEX 前往新宿', time: '11:30', duration: 60, location: 'JR成田機場站', cost: 3070, website: 'https://www.jreast.co.jp/', notes: '需要指定席券' },
  ],
  1: [
    { id: 201, type: 'sightseeing', title: '明治神宮', time: '09:00', duration: 120, location: '原宿', cost: 0, website: '', notes: '感受早晨的空氣' },
  ]
});

const getDefaultPackingList = () => [
  { id: 1, title: '護照 (Passport)', completed: false },
  { id: 2, title: 'Wifi 分享器', completed: false },
];

const getDefaultShoppingList = () => [
  { id: 1, region: '東京車站', title: '東京香蕉', location: '東京車站一番街', cost: 1200, completed: false, notes: '伴手禮用' },
  { id: 2, region: '新宿', title: '藥妝 (EVE)', location: '松本清', cost: 5000, completed: false, notes: '免稅櫃台在2F' },
];

const getDefaultFoodList = () => [
  { id: 1, region: '涉谷', title: '挽肉與米', location: '涉谷道玄坂', cost: 2000, notes: '早上9點開始發整理券', completed: false },
  { id: 2, region: '新宿', title: 'Harbs', location: 'Lumine Est 新宿', cost: 1500, notes: '水果千層必吃', completed: false },
];

const generateNewProjectData = (title) => {
  const today = new Date();
  const startDateStr = today.toISOString().split('T')[0];
  
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() + 2);
  const endDateStr = endDateObj.toISOString().split('T')[0];

  const defaultExpenses = [
    { 
      id: 1, 
      date: startDateStr, 
      region: '成田', 
      category: 'transport', 
      title: 'NEX 成田特快', 
      location: '成田機場', 
      amount: 3070, 
      currency: 'JPY', 
      cost: 3070, 
      payer: 'Me', 
      shares: ['Me'], 
      details: [
        { id: 'd1', payer: 'Me', target: 'Me', amount: 3070 }
      ],
      notes: '先代墊全額' 
    }
  ];

  return {
    tripSettings: { title: title, startDate: startDateStr, endDate: endDateStr, days: 3 },
    companions: ['Me'],
    currencySettings: { selectedCountry: COUNTRY_OPTIONS[0], exchangeRate: COUNTRY_OPTIONS[0].defaultRate },
    itineraries: getDefaultItinerary(),
    packingList: getDefaultPackingList(),
    shoppingList: getDefaultShoppingList(),
    foodList: getDefaultFoodList(),
    expenses: defaultExpenses,
  };
};

// ==========================================
// Component: TripPlanner (The full tool)
// ==========================================

const TripPlanner = ({ projectData, onBack, onSaveData, theme, onChangeTheme }) => {
  const [viewMode, setViewMode] = useState('itinerary');
  
  const DEFAULT_CURRENCY_SETTINGS = { selectedCountry: COUNTRY_OPTIONS[0], exchangeRate: COUNTRY_OPTIONS[0].defaultRate };
  
  const [tripSettings, setTripSettings] = useState(projectData?.tripSettings || generateNewProjectData('Temp').tripSettings);
  const [companions, setCompanions] = useState(Array.isArray(projectData?.companions) ? projectData.companions : ['Me']);
  const [currencySettings, setCurrencySettings] = useState(projectData?.currencySettings?.selectedCountry ? projectData.currencySettings : DEFAULT_CURRENCY_SETTINGS);
  
  const [activeDay, setActiveDay] = useState(0); 
  const [itineraries, setItineraries] = useState(projectData?.itineraries || {});
  const [checklistTab, setChecklistTab] = useState('packing');
  const [packingList, setPackingList] = useState(projectData?.packingList || []);
  const [shoppingList, setShoppingList] = useState(projectData?.shoppingList || []);
  const [foodList, setFoodList] = useState(projectData?.foodList || []);
  const [expenses, setExpenses] = useState(projectData?.expenses || []);

  const [isXlsxLoaded, setIsXlsxLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Dynamically load XLSX library from CDN
    if (window.XLSX) {
      setIsXlsxLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    script.onload = () => setIsXlsxLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Optional cleanup
    }
  }, []);

  useEffect(() => {
    onSaveData({
      tripSettings,
      companions,
      currencySettings,
      itineraries,
      packingList,
      shoppingList,
      foodList,
      expenses
    });
  }, [tripSettings, companions, currencySettings, itineraries, packingList, shoppingList, foodList, expenses]);

  const [statsMode, setStatsMode] = useState('real');
  const [statsCategoryFilter, setStatsCategoryFilter] = useState('all');
  const [statsPersonFilter, setStatsPersonFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineEditText, setInlineEditText] = useState('');
  
  const [newCompanionName, setNewCompanionName] = useState('');
  const [editingCompanionIndex, setEditingCompanionIndex] = useState(null);
  const [editingCompanionName, setEditingCompanionName] = useState('');

  const [copiedId, setCopiedId] = useState(null);
  
  const [tempSettings, setTempSettings] = useState({...tripSettings});
  const [tempCurrency, setTempCurrency] = useState({...currencySettings});

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // --- Helper to block invalid chars in number inputs ---
  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  // --- Excel Import Function ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !window.XLSX) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = window.XLSX.read(bstr, { type: 'binary' });

        // Helper to get sheet data
        const getSheetData = (sheetName) => {
          const ws = wb.Sheets[sheetName];
          return ws ? window.XLSX.utils.sheet_to_json(ws, { header: 1 }) : [];
        };

        const sheetNames = wb.SheetNames;
        const overviewSheetName = sheetNames.find(n => !['行程表', '行李', '購物', '美食', '費用'].includes(n)) || sheetNames[0];
        const overviewData = getSheetData(overviewSheetName);
        
        let newTripSettings = { ...tripSettings };
        let newCurrencySettings = { ...currencySettings };
        let newCompanions = [...companions];

        if (overviewData.length > 1) {
          const findValue = (key) => {
            const row = overviewData.find(r => r[0] && String(r[0]).includes(key));
            return row ? row[1] : null;
          };

          const title = findValue("專案標題");
          const startDate = findValue("出發日期");
          const endDate = findValue("回國日期");
          const companionsStr = findValue("旅行人員");
          const currencyCode = findValue("貨幣代碼");
          const rate = findValue("匯率");

          if (title) newTripSettings.title = title;
          
          if (startDate) newTripSettings.startDate = startDate;
          else newTripSettings.startDate = new Date().toISOString().split('T')[0];

          if (endDate) newTripSettings.endDate = endDate;
          else newTripSettings.endDate = newTripSettings.startDate;

          newTripSettings.days = calculateDaysDiff(newTripSettings.startDate, newTripSettings.endDate);
          
          if (companionsStr) newCompanions = String(companionsStr).split(",").map(c => c.trim());
          
          if (currencyCode) {
            const country = COUNTRY_OPTIONS.find(c => c.currency === currencyCode) || COUNTRY_OPTIONS[0];
            newCurrencySettings.selectedCountry = country;
          }
          if (rate) newCurrencySettings.exchangeRate = parseFloat(rate) || 1;
        }

        // Parse Itinerary
        const itineraryData = getSheetData("行程表");
        const newItineraries = {};
        if (itineraryData.length > 1) {
          for (let i = 1; i < itineraryData.length; i++) {
            const row = itineraryData[i];
            if (!row || !row[0]) continue;
            
            const dayStr = String(row[0]); 
            const dayIndex = parseInt(dayStr.replace("Day ", "")) - 1;
            if (isNaN(dayIndex)) continue; 
            
            const label = row[4];
            const typeEntry = Object.entries(ICON_MAP).find(([k, v]) => v.label === label);
            const type = typeEntry ? typeEntry[0] : 'sightseeing';

            const item = {
              id: Date.now() + i,
              time: row[2] || "09:00",
              duration: parseInt(row[3]) || 60,
              type: type,
              title: row[5] || "",
              location: row[6] || "",
              cost: parseInt(row[7]) || 0,
              notes: row[8] || ""
            };

            if (!newItineraries[dayIndex]) newItineraries[dayIndex] = [];
            newItineraries[dayIndex].push(item);
          }
        }

        const parseList = (sheetName, offset) => {
            const data = getSheetData(sheetName);
            const list = [];
            if (data.length > 1) {
                for (let i = 1; i < data.length; i++) {
                    const row = data[i];
                    if (!row) continue;
                    if (sheetName === '行李') {
                        if(row[0]) list.push({ id: Date.now() + i + offset, title: row[0], completed: row[1] === "已完成" });
                    } else {
                        if(row[1]) list.push({
                            id: Date.now() + i + offset,
                            region: row[0] || "",
                            title: row[1],
                            location: row[2] || "",
                            cost: parseInt(row[3]) || 0,
                            completed: row[4] && (row[4].includes("已購買") || row[4].includes("已吃")),
                            notes: row[5] || ""
                        });
                    }
                }
            }
            return list;
        };

        const newPackingList = parseList("行李", 1000);
        const newShoppingList = parseList("購物", 2000);
        const newFoodList = parseList("美食", 3000);

        const expenseData = getSheetData("費用");
        const newExpenses = [];
        if (expenseData.length > 1) {
          for (let i = 1; i < expenseData.length; i++) {
            const row = expenseData[i];
            if (!row || !row[3]) continue;

            const catLabel = row[2];
            const catEntry = Object.entries(EXPENSE_CATEGORIES).find(([k, v]) => v.label === catLabel);
            const category = catEntry ? catEntry[0] : 'other';

            const payer = row[5] || "Me";
            const cost = parseInt(row[6]) || 0;
            const splitStr = String(row[7] || "");
            
            let details = [];
            let shares = [];

            if (splitStr.includes(":")) {
               if (splitStr.startsWith("分攤:")) {
                  const names = splitStr.replace("分攤:", "").split(",").map(s => s.trim());
                  shares = names;
                  const shareAmount = Math.round(cost / (names.length || 1));
                  details = names.map((n, dIdx) => ({
                    id: Date.now() + i + dIdx + 5000,
                    payer: payer,
                    target: n,
                    amount: shareAmount
                  }));
               } else {
                  const parts = splitStr.split(",");
                  parts.forEach((p, dIdx) => {
                     const [target, amt] = p.split(":").map(s => s.trim());
                     if (target) {
                        shares.push(target === '全員' ? 'ALL' : target); 
                        details.push({
                           id: Date.now() + i + dIdx + 5000,
                           payer: payer,
                           target: target === '全員' ? 'ALL' : target,
                           amount: parseInt(amt) || 0
                        });
                     }
                  });
               }
            } else {
               shares = [payer];
            }

            if (details.some(d => d.target === 'ALL')) {
               shares = newCompanions; 
            }

            newExpenses.push({
              id: Date.now() + i + 4000,
              date: row[0] || newTripSettings.startDate,
              region: row[1] || "",
              category: category,
              title: row[3],
              location: row[4] || "",
              payer: payer,
              amount: cost, 
              cost: cost,
              currency: newCurrencySettings.selectedCountry.currency,
              shares: shares,
              details: details
            });
          }
        }

        setTripSettings(newTripSettings);
        setCompanions(newCompanions);
        setCurrencySettings(newCurrencySettings);
        setItineraries(newItineraries);
        setPackingList(newPackingList);
        setShoppingList(newShoppingList);
        setFoodList(newFoodList);
        setExpenses(newExpenses);
        
        setActiveDay(0);

        alert("匯入成功！資料已更新為中文格式。");

      } catch (err) {
        console.error(err);
        alert("匯入失敗，請確認檔案格式是否正確。");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // --- Excel Export Function ---
  const handleExportToExcel = () => {
    if (!window.XLSX) {
      alert("Excel 匯出功能尚未載入完成，請稍後再試。");
      return;
    }

    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();

    // 1. 專案概覽 Sheet
    const overviewData = [
      ["項目", "內容", "", "", "參考：旅行國家", "參考：貨幣代碼"],
      ["專案標題", tripSettings.title],
      ["出發日期", tripSettings.startDate],
      ["回國日期", tripSettings.endDate],
      ["旅行人員", companions.join(", ")],
      ["旅行國家", currencySettings.selectedCountry.name],
      ["貨幣代碼", currencySettings.selectedCountry.currency],
      ["匯率 (1外幣 = TWD)", currencySettings.exchangeRate]
    ];
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
    
    // Add reference lists to Overview Sheet (Cols E, F)
    const countryList = COUNTRY_OPTIONS.map(c => [c.name, c.currency]);
    XLSX.utils.sheet_add_aoa(wsOverview, countryList, { origin: "E2" });

    wsOverview['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 5 }, { wch: 5 }, { wch: 15 }, { wch: 10 }];
    const safeTitle = (tripSettings.title || "ProjectInfo").substring(0, 30).replace(/[:\/?*\[\]\\]/g, "");
    XLSX.utils.book_append_sheet(wb, wsOverview, safeTitle);

    // 2. 行程表 Sheet (Remove Date col)
    const itineraryRows = [
      ["Day", "時間", "持續時間(分)", "類型", "標題", "地點", "費用 (外幣)", "備註", "", "", "", "參考：類型選項"]
    ];
    Object.keys(itineraries).sort((a,b) => parseInt(a)-parseInt(b)).forEach(dayIndex => {
      const dayItems = itineraries[dayIndex] || [];
      dayItems.forEach(item => {
        itineraryRows.push([
          `Day ${parseInt(dayIndex) + 1}`,
          item.time,
          item.duration || 60, 
          ICON_MAP[item.type]?.label || item.type,
          item.title,
          item.location || "",
          item.cost || 0,
          item.notes || ""
        ]);
      });
    });
    const wsItinerary = XLSX.utils.aoa_to_sheet(itineraryRows);
    
    // Add Type reference to Col L
    const typeList = Object.values(ICON_MAP).map(v => [v.label]);
    XLSX.utils.sheet_add_aoa(wsItinerary, typeList, { origin: "L2" });

    wsItinerary['!cols'] = [{wch:6}, {wch:8}, {wch:12}, {wch:8}, {wch:30}, {wch:20}, {wch:12}, {wch:30}, {wch:5}, {wch:5}, {wch:5}, {wch:15}];
    XLSX.utils.book_append_sheet(wb, wsItinerary, "行程表");

    // 3. 行李 Sheet
    const packingRows = [["物品名稱", "狀態", "", "", "", "", "", "", "", "", "", "參考：狀態選項"]];
    packingList.forEach(item => {
      packingRows.push([item.title, item.completed ? "已完成" : "未完成"]);
    });
    const wsPacking = XLSX.utils.aoa_to_sheet(packingRows);
    XLSX.utils.sheet_add_aoa(wsPacking, [["已完成"], ["未完成"]], { origin: "L2" });
    wsPacking['!cols'] = [{wch:30}, {wch:10}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:15}];
    XLSX.utils.book_append_sheet(wb, wsPacking, "行李");

    // 4. 購物 Sheet
    const shoppingRows = [["地區", "商品名稱", "地點/店名", "預估費用", "購買狀態", "備註", "", "", "", "", "", "參考：購買狀態"]];
    shoppingList.forEach(item => {
      shoppingRows.push([
        item.region || "",
        item.title,
        item.location || "",
        item.cost || 0,
        item.completed ? "已購買" : "未購買",
        item.notes || ""
      ]);
    });
    const wsShopping = XLSX.utils.aoa_to_sheet(shoppingRows);
    XLSX.utils.sheet_add_aoa(wsShopping, [["已購買"], ["未購買"]], { origin: "L2" });
    wsShopping['!cols'] = [{wch:15}, {wch:30}, {wch:20}, {wch:12}, {wch:10}, {wch:30}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:15}];
    XLSX.utils.book_append_sheet(wb, wsShopping, "購物");

    // 5. 美食 Sheet
    const foodRows = [["地區", "餐廳名稱", "地點/地址", "預估費用", "完成狀態", "備註", "", "", "", "", "", "參考：完成狀態"]];
    foodList.forEach(item => {
      foodRows.push([
        item.region || "",
        item.title,
        item.location || "",
        item.cost || 0,
        item.completed ? "已吃" : "未吃",
        item.notes || ""
      ]);
    });
    const wsFood = XLSX.utils.aoa_to_sheet(foodRows);
    XLSX.utils.sheet_add_aoa(wsFood, [["已吃"], ["未吃"]], { origin: "L2" });
    wsFood['!cols'] = [{wch:15}, {wch:30}, {wch:20}, {wch:12}, {wch:10}, {wch:30}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:5}, {wch:15}];
    XLSX.utils.book_append_sheet(wb, wsFood, "美食");

    // 6. 費用 Sheet
    const expenseRows = [["日期", "地區", "類別", "項目", "地點", "付款人", "總金額 (外幣)", "分攤詳情", "", "", "", "參考：費用類別"]];
    expenses.forEach(item => {
      let splitStr = "";
      if (item.details && item.details.length > 0) {
        splitStr = item.details.map(d => `${d.target === 'ALL' ? '全員' : d.target}: ${d.amount}`).join(", ");
      } else {
        splitStr = `分攤: ${item.shares.join(", ")}`;
      }

      expenseRows.push([
        item.date,
        item.region || "",
        EXPENSE_CATEGORIES[item.category]?.label || item.category,
        item.title,
        item.location || "",
        item.payer,
        item.cost,
        splitStr
      ]);
    });
    const wsExpenses = XLSX.utils.aoa_to_sheet(expenseRows);
    const categoryList = Object.values(EXPENSE_CATEGORIES).map(v => [v.label]);
    XLSX.utils.sheet_add_aoa(wsExpenses, categoryList, { origin: "L2" });
    wsExpenses['!cols'] = [{wch:12}, {wch:10}, {wch:10}, {wch:30}, {wch:20}, {wch:10}, {wch:12}, {wch:40}, {wch:5}, {wch:5}, {wch:5}, {wch:15}];
    XLSX.utils.book_append_sheet(wb, wsExpenses, "費用");

    // 檔名: 標題_西元年月日.xlsx
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `${tripSettings.title || "MyTrip"}_${todayStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const copyToClipboard = (text, itemId) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCurrentList = () => {
    if (viewMode === 'itinerary') return itineraries[activeDay] || [];
    if (viewMode === 'expenses') return sortExpensesByRegionAndCategory(expenses); 
    if (checklistTab === 'packing') return packingList;
    if (checklistTab === 'shopping') return shoppingList;
    if (checklistTab === 'food') return foodList;
    return [];
  };

  const updateCurrentList = (newList) => {
    if (viewMode === 'itinerary') setItineraries({ ...itineraries, [activeDay]: newList });
    else if (viewMode === 'expenses') setExpenses(newList);
    else if (checklistTab === 'packing') setPackingList(newList);
    else if (checklistTab === 'shopping') setShoppingList(newList);
    else if (checklistTab === 'food') setFoodList(newList);
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    requestAnimationFrame(() => {
      if (e.target) e.target.closest('.draggable-item').style.opacity = '0.5';
    });
  };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = (e) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const list = [...getCurrentList()];
    const dragContent = list[dragItem.current];
    list.splice(dragItem.current, 1);
    list.splice(dragOverItem.current, 0, dragContent);
    dragItem.current = null;
    dragOverItem.current = null;
    updateCurrentList(list);
  };

  const openAddModal = () => {
    setEditingItem(null);
    const baseData = { 
      title: '', location: '', cost: '', costType: 'FOREIGN', 
      website: '', notes: '', region: '' 
    };

    if (viewMode === 'itinerary') {
      const currentList = getCurrentList();
      let defaultTime = '09:00';
      if (currentList.length > 0) {
        const lastItem = currentList[currentList.length - 1];
        const nextMin = timeToMinutes(lastItem.time) + lastItem.duration + 30;
        defaultTime = minutesToTime(nextMin);
      }
      setFormData({ ...baseData, type: 'sightseeing', time: defaultTime, duration: 60 });
    } else if (viewMode === 'expenses') {
      setFormData({
        ...baseData,
        date: tripSettings.startDate,
        category: 'food',
        payer: 'Me', 
        shares: companions,
        details: [] 
      });
    } else {
      setFormData(baseData);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    if (viewMode === 'expenses' && (!item.details || item.details.length === 0)) {
       const migratedDetails = item.shares.map((sharePerson, idx) => ({
           id: Date.now() + idx,
           payer: item.payer,
           target: sharePerson,
           amount: Math.round(item.cost / item.shares.length)
       }));
       setFormData({ ...item, costType: 'FOREIGN', details: migratedDetails });
    } else {
       setFormData({ ...item, costType: 'FOREIGN' });
    }
    setIsModalOpen(true);
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    let newItem = { ...formData, id: editingItem ? editingItem.id : Date.now() };

    if (formData.cost) {
      const rawCost = parseFloat(formData.cost);
      if (formData.costType === 'TWD') {
        newItem.cost = Math.round(rawCost / currencySettings.exchangeRate);
      } else {
        newItem.cost = parseInt(rawCost);
      }
    } else {
      newItem.cost = 0;
    }
    
    if (viewMode === 'expenses') {
      newItem.currency = currencySettings.selectedCountry.currency;
      if (newItem.details && newItem.details.length > 0) {
         newItem.payer = newItem.details[0].payer;
         const targets = new Set();
         newItem.details.forEach(d => {
             if (d.target === 'ALL') companions.forEach(c => targets.add(c));
             else targets.add(d.target);
         });
         newItem.shares = Array.from(targets);
      }
    }

    if (viewMode === 'itinerary') {
      newItem.duration = parseInt(formData.duration) || 0;
    }

    let list = viewMode === 'expenses' ? [...expenses] : [...getCurrentList()];
    
    if (editingItem) {
      list = list.map(item => item.id === editingItem.id ? { ...newItem, completed: item.completed } : item);
    } else {
      list = [...list, { ...newItem, completed: false }];
    }

    if (viewMode === 'itinerary') list = sortItemsByTime(list);
    
    if (viewMode === 'expenses') setExpenses(list);
    else updateCurrentList(list);

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    if (viewMode === 'expenses') {
      setExpenses(expenses.filter(item => item.id !== id));
    } else {
      updateCurrentList(getCurrentList().filter(item => item.id !== id));
    }
  };

  const addSplitDetail = () => {
      const currentAllocated = (formData.details || []).reduce((sum, d) => {
          if (d.target === 'ALL') {
             return sum + (d.amount * companions.length);
          }
          return sum + d.amount;
      }, 0);
      
      const totalCost = parseFloat(formData.cost) || 0;
      const remaining = Math.max(0, totalCost - currentAllocated);
      
      const newDetail = {
          id: Date.now(),
          payer: 'Me',
          target: companions[0] || 'Me',
          amount: remaining
      };
      
      setFormData({ ...formData, details: [...(formData.details || []), newDetail] });
  };

  const removeSplitDetail = (detailId) => {
      setFormData({ ...formData, details: formData.details.filter(d => d.id !== detailId) });
  };

  const updateSplitDetail = (detailId, field, value) => {
      const updatedDetails = formData.details.map(d => {
          if (d.id !== detailId) return d;
          let updates = { [field]: value };
          if (field === 'target' && value === 'ALL' && formData.cost) {
              updates.amount = Math.round(formData.cost / companions.length);
          }
          return { ...d, ...updates };
      });
      setFormData({ ...formData, details: updatedDetails });
  };

  const startInlineEdit = (item) => {
    setInlineEditingId(item.id);
    setInlineEditText(item.title);
  };
  const saveInlineEdit = (id) => {
    if (inlineEditText.trim()) {
      const list = packingList.map(item => item.id === id ? { ...item, title: inlineEditText.trim() } : item);
      setPackingList(list);
    }
    setInlineEditingId(null);
  };

  const toggleComplete = (id) => {
    const list = getCurrentList().map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    updateCurrentList(list);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const days = calculateDaysDiff(tempSettings.startDate, tempSettings.endDate);
    if (new Date(tempSettings.endDate) < new Date(tempSettings.startDate)) return alert("日期錯誤");
    
    const newSettings = { ...tempSettings, days };
    setTripSettings(newSettings);
    setIsSettingsOpen(false);
    if (activeDay >= days) setActiveDay(0);
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    const newEnd = getNextDay(newStart); 
    setTempSettings({ ...tempSettings, startDate: newStart, endDate: newEnd });
  };

  const handleCurrencySubmit = (e) => {
    e.preventDefault();
    setCurrencySettings({...tempCurrency});
    setIsCurrencyModalOpen(false);
  };

  const handleAddCompanion = (e) => {
    e.preventDefault();
    if (newCompanionName.trim()) {
      if (companions.includes(newCompanionName.trim())) {
        alert("此名稱已存在");
        return;
      }
      setCompanions([...companions, newCompanionName.trim()]);
      setNewCompanionName('');
    }
  };
  const handleRemoveCompanion = (index) => {
    const newCompanions = [...companions];
    newCompanions.splice(index, 1);
    setCompanions(newCompanions);
  };
  const handleClearAllCompanions = () => {
    setCompanions([]);
  };
  const startEditCompanion = (index, name) => {
    setEditingCompanionIndex(index);
    setEditingCompanionName(name);
  };
  
  const saveEditCompanion = (index) => {
    const oldName = companions[index];
    const newName = editingCompanionName.trim();
    
    if (newName && newName !== oldName) {
      if (companions.includes(newName)) {
        alert("此名稱已存在");
        return;
      }

      const newCompanions = [...companions];
      newCompanions[index] = newName;
      setCompanions(newCompanions);

      const updatedExpenses = expenses.map(exp => {
        let updatedExp = { ...exp };
        if (updatedExp.payer === oldName) updatedExp.payer = newName;
        if (updatedExp.shares && updatedExp.shares.includes(oldName)) {
          updatedExp.shares = updatedExp.shares.map(s => s === oldName ? newName : s);
        }
        if (updatedExp.details) {
          updatedExp.details = updatedExp.details.map(d => ({
            ...d,
            payer: d.payer === oldName ? newName : d.payer,
            target: d.target === oldName ? newName : d.target
          }));
        }
        return updatedExp;
      });
      setExpenses(updatedExpenses);
    }
    setEditingCompanionIndex(null);
  };

  const statisticsData = useMemo(() => {
    const personStats = {};
    companions.forEach(c => {
      personStats[c] = { paid: 0, share: 0, balance: 0 };
    });
    
    const categoryStats = { real: {}, personal: {} };
    let personalExpensesList = [];

    expenses.forEach(exp => {
      const amount = exp.cost;
      if (!categoryStats.real[exp.category]) categoryStats.real[exp.category] = 0;
      categoryStats.real[exp.category] += amount;

      if (exp.details && exp.details.length > 0) {
          exp.details.forEach((d, idx) => {
              const dAmount = d.amount;
              if (d.target === 'ALL') {
                  const totalForThisDetail = dAmount * companions.length;
                  if (personStats[d.payer]) personStats[d.payer].paid += totalForThisDetail;
                  companions.forEach(c => {
                      if (personStats[c]) personStats[c].share += dAmount;
                      personalExpensesList.push({
                        ...exp, id: `${exp.id}_${idx}_${c}`, cost: dAmount, payer: c, realPayer: d.payer, isVirtual: true, noteSuffix: `(均攤)`
                      });
                  });
                  if (!categoryStats.personal[exp.category]) categoryStats.personal[exp.category] = 0;
                  categoryStats.personal[exp.category] += totalForThisDetail;
              } else {
                  if (personStats[d.payer]) personStats[d.payer].paid += dAmount;
                  if (personStats[d.target]) personStats[d.target].share += dAmount;
                  personalExpensesList.push({
                    ...exp, id: `${exp.id}_${idx}`, cost: dAmount, payer: d.target, realPayer: d.payer, isVirtual: true, noteSuffix: ``
                  });
                  if (!categoryStats.personal[exp.category]) categoryStats.personal[exp.category] = 0;
                  categoryStats.personal[exp.category] += dAmount;
              }
          });
      } else {
          if (personStats[exp.payer]) personStats[exp.payer].paid += amount;
          personalExpensesList.push({ ...exp, realPayer: exp.payer, payer: exp.payer }); 
          if (!categoryStats.personal[exp.category]) categoryStats.personal[exp.category] = 0;
          categoryStats.personal[exp.category] += amount;
      }
    });

    Object.keys(personStats).forEach(p => {
      personStats[p].balance = personStats[p].paid - personStats[p].share;
    });

    const transactions = solveDebts(personStats);
    return { personStats, categoryStats, transactions, personalExpensesList };
  }, [expenses, companions]);

  const BottomNav = () => (
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
            <button onClick={openAddModal} className={`absolute -top-6 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-lg shadow-[#3A3A3A]/30 hover:scale-105 ${theme.primaryBg} transition-all flex items-center justify-center z-50`}>
              <Plus size={28} strokeWidth={1.5} />
            </button>
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

  const PayerAvatar = ({ name, size = "w-4 h-4" }) => {
    const idx = companions.indexOf(name);
    return (
      <div className={`${size} rounded-full ${getAvatarColor(idx)} flex items-center justify-center ${theme.primary} text-[8px] font-bold font-serif shrink-0 border border-white`}>
        {name ? name.charAt(0) : '?'}
      </div>
    );
  };

  // --- Render Functions ---

  const renderCategoryChart = () => {
    const statsData = statsMode === 'real' ? statisticsData.categoryStats.real : statisticsData.categoryStats.personal;
    return Object.entries(statsData).map(([cat, amount]) => {
      const total = Object.values(statsData).reduce((a, b) => a + b, 0) || 1;
      const percent = Math.round((amount / total) * 100);
      const label = EXPENSE_CATEGORIES[cat]?.label || cat;
      return (
        <div key={cat} onClick={() => setStatsCategoryFilter(statsCategoryFilter === cat ? 'all' : cat)} className={`cursor-pointer transition-opacity ${statsCategoryFilter !== 'all' && statsCategoryFilter !== cat ? 'opacity-30' : 'opacity-100'}`}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-[#3A3A3A]">{label}</span>
            <span className="text-[#888]">{percent}% ({currencySettings.selectedCountry.currency} {formatMoney(amount)})</span>
          </div>
          <div className={`h-2 w-full ${theme.hover} rounded-full overflow-hidden`}>
            <div className="h-full" style={{ width: `${percent}%`, backgroundColor: theme.accentHex }}></div>
          </div>
        </div>
      );
    });
  };

  const renderDetailedList = () => {
    const sourceList = statsMode === 'real' ? expenses : statisticsData.personalExpensesList;
    let filteredExpenses = sourceList.filter(e => statsCategoryFilter === 'all' || e.category === statsCategoryFilter);
    if (statsPersonFilter !== 'all') {
       if (statsMode === 'real') {
          filteredExpenses = filteredExpenses.filter(e => e.payer === statsPersonFilter);
       } else {
          filteredExpenses = filteredExpenses.filter(e => e.payer === statsPersonFilter);
       }
    }
    const sortedExpenses = sortExpensesByRegionAndCategory(filteredExpenses);
    return sortedExpenses.map((exp, index) => {
       const prevExp = sortedExpenses[index - 1];
       const currentCategory = exp.category;
       const prevCategory = prevExp?.category;
       const twd = Math.round(exp.cost * currencySettings.exchangeRate);
       let categoryHeader = null;
       if (index === 0 || currentCategory !== prevCategory) {
          const CatIcon = EXPENSE_CATEGORIES[currentCategory]?.icon || Coins;
          
          // Re-calculate Category Total based on filters (not global stats)
          const categoryTotal = sortedExpenses
            .filter(e => e.category === currentCategory)
            .reduce((sum, e) => sum + e.cost, 0);

          const categoryTotalTwd = Math.round(categoryTotal * currencySettings.exchangeRate);
          
          categoryHeader = (
            <div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-2 px-1 mb-2 mt-4 border-b ${theme.border} flex justify-between items-center animate-in fade-in first:mt-0`}>
              <div className={`text-sm font-bold ${theme.primary} flex items-center gap-2`}>
                <CatIcon size={16} /> {EXPENSE_CATEGORIES[currentCategory]?.label || '未分類'}
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(categoryTotal)}</div>
                <div className="text-[9px] text-[#999]">(NT$ {formatMoney(categoryTotalTwd)})</div>
              </div>
            </div>
          );
       }
       return (
         <React.Fragment key={exp.id}>
           {categoryHeader}
           <div className={`${theme.card} p-3 rounded-xl border ${theme.border} flex justify-between items-center shadow-sm`}>
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${theme.hover} flex items-center justify-center ${theme.primary} shrink-0`}>
                  {React.createElement(EXPENSE_CATEGORIES[exp.category]?.icon || Coins, { size: 16 })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#3A3A3A] font-serif truncate">{exp.title}</div>
                  <div className="text-[10px] text-[#888] mt-1 flex flex-wrap gap-1 items-center">
                    {statsMode === 'personal' ? (
                      <>
                        <span className="flex items-center gap-1"><span>付款者 :</span><PayerAvatar name={exp.payer} /><span>{exp.payer}</span></span>
                        <span className={`text-[#E6E2D3] mx-1`}>|</span>
                        <span className="flex items-center gap-1"><span>代墊者 :</span><PayerAvatar name={exp.realPayer} /><span>{exp.realPayer}</span></span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1"><span>代墊者 :</span><PayerAvatar name={exp.payer} /><span>{exp.payer}</span></span>
                        <span className={`text-[#E6E2D3] mx-1`}>|</span>
                        <span className="flex items-center gap-1"><span>分攤 :</span>{exp.details && exp.details.some(d => d.target === 'ALL') ? <span className={`${theme.hover} px-1 rounded ${theme.primary}`}>全員</span> : <span>{exp.shares.length}人</span>}</span>
                      </>
                    )}
                  </div>
                </div>
             </div>
             <div className="text-right shrink-0">
                <div className={`text-sm font-bold ${theme.accent} font-serif`}>{exp.currency} {formatMoney(exp.cost)}</div>
                <div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twd)})</div>
             </div>
           </div>
         </React.Fragment>
       );
    });
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-sans pb-32 ${theme.selection}`}>
      
      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {/* Header */}
      <header className={`sticky top-0 z-30 ${theme.bg}/95 backdrop-blur-md border-b ${theme.border}`}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
               {onBack && (
                  <button onClick={onBack} className={`mt-1 text-[#888] hover:${theme.primary} transition-colors p-1 -ml-2 rounded-full ${theme.hover}`}>
                      <Home size={20} />
                  </button>
               )}
               <div>
                  <h1 className="text-2xl font-serif font-bold tracking-wide text-[#3A3A3A] flex items-center gap-2">
                    <AppLogo theme={theme} />
                    {tripSettings.title}
                  </h1>
                  <div className={`text-xs font-serif ${theme.subText} mt-1 tracking-widest uppercase pl-1 flex items-center gap-2`}>
                      <span>{tripSettings.startDate.replace(/-/g, '.')}</span>
                      <ArrowRight size={12} />
                      <span>{tripSettings.endDate.replace(/-/g, '.')}</span>
                      <span className={`border-l ${theme.border} pl-2 ml-1`}>{tripSettings.days} 天</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={triggerFileUpload} 
                className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover} ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : ''}`} 
                title="匯入 Excel"
                disabled={!isXlsxLoaded}
              >
                {isXlsxLoaded ? <Upload size={20} /> : <Loader2 size={20} className="animate-spin" />}
              </button>

              <button 
                onClick={handleExportToExcel} 
                className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover} ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : ''}`} 
                title="匯出 Excel"
                disabled={!isXlsxLoaded}
              >
                {isXlsxLoaded ? <Download size={20} /> : <Loader2 size={20} className="animate-spin" />}
              </button>

              <button onClick={() => { 
                const safeCurrency = currencySettings?.selectedCountry ? currencySettings : DEFAULT_CURRENCY_SETTINGS;
                setTempCurrency({...safeCurrency}); 
                setIsCurrencyModalOpen(true); 
              }} className={`p-2 rounded-full flex items-center gap-1.5 border border-transparent hover:${theme.border} ${theme.hover} ${theme.accent}`}><Coins size={18} /><span className="text-[10px] font-bold hidden sm:inline-block">{currencySettings?.selectedCountry?.currency || 'JPY'}</span></button>
              
              <button onClick={() => setIsCompanionModalOpen(true)} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Users size={20} /></button>
              <button onClick={() => { setTempSettings({...tripSettings}); setIsSettingsOpen(true); }} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Settings size={20} /></button>
            </div>
          </div>

          {viewMode === 'itinerary' && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {Array.from({ length: tripSettings.days }).map((_, idx) => (
                <button key={idx} onClick={() => setActiveDay(idx)} className={`flex flex-col items-center justify-center min-w-[4.5rem] py-2 px-1 rounded-xl transition-all border ${activeDay === idx ? `bg-[#3A3A3A] text-[#F9F8F6] border-[#3A3A3A] shadow-md transform scale-105` : `${theme.card} ${theme.subText} ${theme.border}`}`}>
                  <span className="text-[10px] font-bold tracking-wider">Day {idx + 1}</span>
                  <span className="text-sm font-serif font-medium mt-0.5">{formatDate(tripSettings.startDate, idx).text}</span>
                </button>
              ))}
            </div>
          )}
          {viewMode === 'checklist' && (
            <div className="mt-6 flex bg-[#EBE9E4] p-1 rounded-xl">
              {[{id:'packing',label:'行李',icon:Luggage},{id:'shopping',label:'購物',icon:ShoppingBag},{id:'food',label:'美食',icon:Utensils}].map(tab => (
                <button key={tab.id} onClick={() => setChecklistTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${checklistTab === tab.id ? `${theme.card} text-[#3A3A3A] shadow-sm` : `${theme.subText} hover:${theme.primary}`}`}><tab.icon size={14} />{tab.label}</button>
              ))}
            </div>
          )}
          {viewMode === 'statistics' && (
            <div className="mt-6 flex bg-[#EBE9E4] p-1 rounded-xl">
              <button onClick={() => { setStatsMode('real'); setStatsPersonFilter('all'); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${statsMode === 'real' ? `${theme.card} text-[#3A3A3A] shadow-sm` : theme.subText}`}>真實支付 (Payment)</button>
              <button onClick={() => { setStatsMode('personal'); setStatsPersonFilter('all'); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${statsMode === 'personal' ? `${theme.card} text-[#3A3A3A] shadow-sm` : theme.subText}`}>個人消費 (Share)</button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-6 pb-24">
        {viewMode === 'statistics' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
              <div className="flex gap-3 min-w-max">
                <div onClick={() => setStatsPersonFilter('all')} className={`border rounded-xl p-3 shadow-sm min-w-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all ${statsPersonFilter === 'all' ? 'bg-[#3A3A3A] border-[#3A3A3A] text-white' : `${theme.card} ${theme.border} text-[#3A3A3A] ${theme.hover}`}`}>
                   <div className="text-xs font-bold mb-1">ALL</div>
                   <Users size={16} />
                </div>
                {companions.map((person, idx) => {
                  const stat = statisticsData.personStats[person];
                  const amount = statsMode === 'real' ? stat.paid : stat.share;
                  const twd = Math.round(amount * currencySettings.exchangeRate);
                  const isSelected = statsPersonFilter === person;
                  return (
                    <div key={person} onClick={() => setStatsPersonFilter(isSelected ? 'all' : person)} className={`border rounded-xl p-3 shadow-sm min-w-[8rem] flex flex-col items-center cursor-pointer transition-all ${isSelected ? `${theme.hover} ${theme.primaryBorder} ring-1 ring-[#5F6F52]` : `${theme.card} ${theme.border} ${theme.hover}`}`}>
                       <div className={`w-10 h-10 rounded-full ${getAvatarColor(idx)} flex items-center justify-center ${theme.primary} text-sm font-bold font-serif mb-2`}>{person.charAt(0)}</div>
                       <div className="text-xs font-bold text-[#3A3A3A] mb-1">{person}</div>
                       <div className={`text-sm font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.symbol} {formatMoney(amount)}</div>
                       <div className="text-[9px] text-[#999]">(NT$ {formatMoney(twd)})</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`${theme.card} rounded-2xl p-5 border ${theme.border} shadow-sm`}>
              <h3 className="text-sm font-bold text-[#888] mb-4 flex items-center gap-2"><ArrowLeftRight size={16}/> 結算建議 (Settlement)</h3>
              <div className="space-y-3">
                {statisticsData.transactions.length > 0 ? (
                  statisticsData.transactions.map((tx, i) => {
                    const fromIdx = companions.indexOf(tx.from);
                    const toIdx = companions.indexOf(tx.to);
                    const amountTwd = Math.round(tx.amount * currencySettings.exchangeRate);
                    return (
                      <div key={i} className={`flex items-center justify-between text-sm border-b ${theme.border} pb-3 last:border-0`}>
                          <div className="flex items-center gap-2 flex-1">
                             <div className="flex items-center gap-2">
                               <div className={`w-8 h-8 rounded-full ${getAvatarColor(fromIdx)} flex items-center justify-center ${theme.primary} text-xs font-bold font-serif`}>{tx.from.charAt(0)}</div>
                               <span className="font-bold text-[#3A3A3A] font-serif">{tx.from}</span>
                             </div>
                             <ArrowRight size={14} className="text-[#CCC]" />
                             <div className="flex items-center gap-2">
                               <div className={`w-8 h-8 rounded-full ${getAvatarColor(toIdx)} flex items-center justify-center ${theme.primary} text-xs font-bold font-serif`}>{tx.to.charAt(0)}</div>
                               <span className="font-bold text-[#3A3A3A] font-serif">{tx.to}</span>
                             </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(tx.amount)}</div>
                            <div className="text-[10px] text-[#999]">(NT$ {formatMoney(amountTwd)})</div>
                          </div>
                      </div>
                    );
                  })
                ) : (
                   <div className="text-center text-[#888] text-xs py-2">已結清 (All settled)</div>
                )}
              </div>
            </div>

            <div className={`${theme.card} rounded-2xl p-5 border ${theme.border} shadow-sm`}>
               <h3 className="text-sm font-bold text-[#888] mb-4 flex items-center gap-2"><PieChart size={16}/> 花費類別佔比 ({currencySettings.selectedCountry.currency})</h3>
               <div className="space-y-3">
                 {renderCategoryChart()}
               </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-sm font-bold text-[#888] pl-1">詳細清單 ({statsCategoryFilter === 'all' ? '全部' : EXPENSE_CATEGORIES[statsCategoryFilter]?.label})</h3>
               {renderDetailedList()}
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {viewMode === 'itinerary' && <div className={`absolute left-[4.5rem] top-4 bottom-4 w-px ${theme.border} -z-10`}></div>}
            
            {getCurrentList().map((item, index) => {
              if (viewMode === 'expenses') {
                const Icon = EXPENSE_CATEGORIES[item.category]?.icon || Coins;
                const twd = Math.round(item.cost * currencySettings.exchangeRate);
                let groupHeader = null;
                const prevItem = getCurrentList()[index - 1];
                const currentRegion = item.region || '未分類';
                const prevRegion = prevItem?.region || '未分類';
                const currentCategory = item.category;
                const prevCategory = prevItem?.category;

                if (index === 0 || currentRegion !== prevRegion) {
                   groupHeader = (
                     <div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-3 px-1 mb-2 border-b ${theme.border} text-lg font-bold ${theme.primary} flex items-center gap-2 animate-in fade-in mt-6 first:mt-0`}>
                       <MapIcon size={18} /> {currentRegion}
                     </div>
                   );
                }

                let subHeader = null;
                if (index === 0 || currentRegion !== prevRegion || currentCategory !== prevCategory) {
                    subHeader = (
                      <div className={`text-xs font-bold ${theme.accent} mt-3 mb-1 pl-1 flex items-center gap-1 animate-in fade-in`}>
                        <Icon size={12}/> {EXPENSE_CATEGORIES[currentCategory]?.label}
                      </div>
                    );
                }

                // 計算顯示的支付者字串
                const payerDisplay = item.details && item.details.length > 0 
                  ? [...new Set(item.details.map(d => d.payer))].join(' | ')
                  : item.payer;

                return (
                  <React.Fragment key={item.id}>
                    {groupHeader}
                    {subHeader}
                    <div className={`draggable-item group ${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm flex gap-4 items-start relative hover:shadow-md transition-all`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                      <div className={`w-10 h-10 rounded-full ${theme.hover} flex items-center justify-center ${theme.primary} shrink-0 mt-1`}><Icon size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-bold text-[#3A3A3A] font-serif leading-tight truncate pr-2">{item.title}</h3>
                           <div className="flex gap-2 shrink-0">
                             <button onClick={() => { setEditingItem(item); openEditModal(item); }} className={`text-[#999] hover:${theme.primary} p-1`}><Edit3 size={16}/></button>
                             <button onClick={() => handleDeleteItem(item.id)} className={`text-[#999] hover:${theme.danger} p-1`}><Trash2 size={16}/></button>
                           </div>
                        </div>
                        <div className="text-xs text-[#888] mb-2 flex items-center gap-2">
                           <span>{item.date}</span>
                           <span>•</span>
                           <span className={`${theme.accent} font-bold`}>{payerDisplay} ● 支付</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className={`text-[10px] text-[#666] ${theme.bg} px-2 py-1.5 rounded flex flex-wrap items-center gap-x-2 gap-y-1`}>
                             <span className="font-bold">分攤者:</span>
                             {item.shares && item.shares.map((share, idx) => (
                               <React.Fragment key={share}>
                                 <div className="flex items-center gap-1">
                                   <PayerAvatar name={share} size="w-3 h-3" />
                                   <span>{share}</span>
                                 </div>
                                 {idx < item.shares.length - 1 && <span className="text-[#CCC]">|</span>}
                               </React.Fragment>
                             ))}
                           </div>
                           <div className="text-right shrink-0 ml-2">
                             <div className={`text-sm font-serif font-bold ${theme.accent}`}>{item.currency} {formatMoney(item.cost)}</div>
                             <div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twd)})</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              } 
              
              if (viewMode === 'itinerary') {
                const IconObj = ICON_MAP[item.type] || ICON_MAP.sightseeing;
                const Icon = IconObj.icon;
                const endTimeStr = minutesToTime(timeToMinutes(item.time) + item.duration);
                const twdAmount = Math.round(item.cost * currencySettings.exchangeRate);
                
                let gapComp = null;
                if (index < getCurrentList().length - 1) {
                  const nextItem = getCurrentList()[index + 1];
                  const diff = timeToMinutes(nextItem.time) - (timeToMinutes(item.time) + item.duration);
                  if (diff !== 0) {
                    gapComp = (
                      <div className="pl-[4.5rem] py-3 flex items-center select-none"><div className={`text-[10px] px-3 py-0.5 rounded-full border flex items-center gap-1.5 font-medium ${diff < 0 ? `${theme.danger} ${theme.dangerBg} border-[#FFD6D6]` : `${theme.subText} ${theme.hover} ${theme.border}`}`}><span className="opacity-50">▼</span> {diff < 0 ? '時間重疊' : `移動 / 休息 : ${formatDurationDisplay(diff)}`}</div></div>
                    );
                  }
                }

                return (
                  <React.Fragment key={item.id}>
                    <div className="draggable-item group relative flex items-start gap-4 py-2" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                      <div className="w-[3.5rem] text-right pt-2 shrink-0 select-none"><div className="text-xl font-bold text-[#3A3A3A] font-serif tracking-tight leading-none">{item.time}</div><div className="text-[10px] text-[#999999] font-medium mt-1">{endTimeStr}</div></div>
                      <div className="relative pt-2 shrink-0 flex justify-center w-8"><div className={`w-3 h-3 rounded-full border-2 ${theme.border} shadow-sm z-10 ${theme.primaryBg}`}></div></div>
                      <div className="flex-1 min-w-0 group/card">
                        <div className={`${theme.card} rounded-lg p-5 border ${theme.border} shadow-[0_2px_10px_-6px_rgba(0,0,0,0.05)] transition-all hover:shadow-md hover:border-[#D6D2C4] hover:translate-x-0.5 relative`}>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E0E0E0] opacity-0 group-hover/card:opacity-100 cursor-grab active:cursor-grabbing p-1"><GripVertical size={14} /></div>
                          <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2"><span className={`p-1.5 rounded-md ${IconObj.color} ${theme.primary}`}><Icon size={16} strokeWidth={1.5} /></span><span className="text-[10px] font-bold tracking-widest text-[#999999] uppercase border border-[#EBE9E4] px-1.5 py-0.5 rounded-sm">{IconObj.label}</span></div>
                            <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity"><button onClick={() => { const newItem = {...item, id: Date.now(), title: `${item.title} (Copy)`}; updateCurrentList([...getCurrentList(), newItem]); }} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Copy size={14} /></button><button onClick={() => { setEditingItem(item); setFormData({...item, costType: 'FOREIGN'}); setIsModalOpen(true); }} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Edit3 size={14} /></button><button onClick={() => handleDeleteItem(item.id)} className={`p-1.5 text-[#999999] hover:${theme.danger} hover:${theme.dangerBg} rounded`}><Trash2 size={14} /></button></div>
                          </div>
                          <div className="pl-2">
                            <div className="flex justify-between items-start gap-2 mb-2"><div className="flex-1"><h3 className="text-lg font-bold text-[#3A3A3A] font-serif leading-tight flex items-center gap-2">{item.title}{item.website && <a href={item.website} target="_blank" rel="noreferrer" className={`text-[#888] hover:${theme.accent}`} onClick={e => e.stopPropagation()}><Globe size={14} /></a>}</h3></div>{item.cost > 0 && (<div className="text-right shrink-0"><div className={`text-sm font-serif font-bold ${theme.accent}`}>{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div><div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twdAmount)})</div></div>)}</div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#666666]">
                              {item.location && (<div className={`flex items-center gap-1 group/location -ml-1.5 px-1.5 py-0.5 rounded ${theme.hover} transition-colors`}><MapPin size={12} className={theme.accent} /><span>{item.location}</span><div className="flex gap-2 ml-1 opacity-0 group-hover/location:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.location, item.id); }} className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder}`}>{copiedId === item.id ? <Check size={14} className={theme.primary} /> : <Copy size={14} />}</button><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} target="_blank" rel="noreferrer" className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder}`} onClick={(e) => e.stopPropagation()}><Navigation size={14} /></a></div></div>)}
                              <div className="flex items-center gap-1 px-1.5 py-0.5"><Clock size={12} className={theme.accent} /> 停留: {formatDurationDisplay(item.duration)}</div>
                            </div>
                            {item.notes && <div className={`mt-3 pt-3 border-t ${theme.border} flex gap-2 items-start`}><PenTool size={10} className="mt-0.5 text-[#AAA] shrink-0" /><p className="text-xs text-[#777] leading-relaxed font-serif italic whitespace-pre-wrap">{item.notes}</p></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {gapComp}
                  </React.Fragment>
                );
              } 
              
              else {
                const isChecked = item.completed;
                const twdAmount = item.cost ? Math.round(item.cost * currencySettings.exchangeRate) : 0;
                let regionHeader = null;
                if ((checklistTab === 'food' || checklistTab === 'shopping')) {
                  const prevItem = getCurrentList()[index - 1];
                  const currentRegion = item.region || '未分類';
                  const prevRegion = prevItem?.region || '未分類';
                  if (index === 0 || currentRegion !== prevRegion) {
                    regionHeader = (
                      <div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-3 px-1 mb-2 border-b ${theme.border} text-lg font-bold ${theme.primary} flex items-center gap-2 animate-in fade-in`}>
                        {checklistTab === 'food' ? <UtensilsCrossed size={16}/> : <ShoppingBag size={16}/>} {currentRegion}
                      </div>
                    );
                  }
                }

                return (
                  <React.Fragment key={item.id}>
                    {regionHeader}
                    <div className="draggable-item group relative animate-in fade-in slide-in-from-bottom-2 duration-500" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                      <div onClick={() => toggleComplete(item.id)} className={`${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm transition-all hover:shadow-md flex gap-4 items-start cursor-pointer ${isChecked ? 'opacity-50 grayscale' : ''}`}>
                        <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${isChecked ? `${theme.primaryBg} ${theme.primaryBorder} text-white` : `bg-white ${theme.border} text-transparent hover:${theme.primaryBorder}`}`}><Check size={12} strokeWidth={3} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            {checklistTab === 'packing' ? (
                              inlineEditingId === item.id ? (
                                <input
                                  type="text"
                                  value={inlineEditText}
                                  onChange={(e) => setInlineEditText(e.target.value)}
                                  className={`w-full text-base font-bold font-serif text-[#3A3A3A] bg-transparent border-b ${theme.primaryBorder} outline-none`}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  onBlur={() => saveInlineEdit(item.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveInlineEdit(item.id)}
                                />
                              ) : (
                                <h3 
                                  onClick={(e) => { e.stopPropagation(); startInlineEdit(item); }}
                                  className={`text-base font-bold font-serif hover:${theme.primary} transition-colors ${isChecked ? 'text-[#AAA] line-through' : 'text-[#3A3A3A]'}`}
                                  title="點擊編輯"
                                >
                                  {item.title}
                                </h3>
                              )
                            ) : (
                              <h3 
                                onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                                className={`text-base font-bold font-serif hover:${theme.primary} transition-colors ${isChecked ? 'text-[#AAA] line-through' : 'text-[#3A3A3A]'}`}
                                title="點擊編輯"
                              >
                                {item.title}
                              </h3>
                            )}

                            {item.cost > 0 && (checklistTab === 'shopping' || checklistTab === 'food') && !isChecked && (
                              <div className="text-right">
                                <div className={`text-sm font-bold ${theme.accent}`}>{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div>
                                <div className="text-[10px] text-[#999]">(NT$ {formatMoney(twdAmount)})</div>
                              </div>
                            )}
                          </div>

                          {(checklistTab === 'shopping' || checklistTab === 'food') && (
                            <div className="mt-2 space-y-1">
                              {item.location && (
                                <div className="flex items-center gap-1 group/location -ml-1 text-xs text-[#666]">
                                  {checklistTab === 'food' && item.region && (
                                    <>
                                      <span className={`${theme.primary} font-bold`}>{item.region}</span>
                                      <span className="text-[#E6E2D3] mx-1">|</span>
                                    </>
                                  )}
                                  <MapPin size={12} className={theme.accent} />
                                  <span className="cursor-default">{item.location}</span>
                                  <div className="flex gap-2 ml-2 opacity-0 group-hover/location:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.location, item.id); }} className={`text-[#AAA] hover:${theme.primary}`}><Copy size={12} /></button>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} target="_blank" rel="noreferrer" className={`text-[#AAA] hover:${theme.primary}`} onClick={(e) => e.stopPropagation()}><Navigation size={12} /></a>
                                  </div>
                                </div>
                              )}
                              {item.notes && <div className={`text-[10px] text-[#888] ${theme.hover} p-1.5 rounded inline-block whitespace-pre-wrap`}>{item.notes}</div>}
                            </div>
                          )}
                        </div>
                        <div className={`flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity pl-3 border-l border-[#F2F0EB] self-center`}>
                          <button className="text-[#E0E0E0] cursor-grab active:cursor-grabbing hover:text-[#888] p-1" onClick={(e) => e.stopPropagation()}><GripVertical size={20} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className={`text-[#999] hover:${theme.danger} p-1`}><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }
            })}
          </div>
        )}
      </main>

      {viewMode !== 'statistics' && (
        <button
          onClick={openAddModal}
          className={`fixed bottom-24 right-6 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-lg shadow-[#3A3A3A]/30 hover:scale-105 ${theme.primaryBg} transition-all flex items-center justify-center z-50 animate-in zoom-in duration-300`}
        >
          <Plus size={28} strokeWidth={1.5} />
        </button>
      )}

      <BottomNav />

      {/* --- MODALS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border ${theme.border}`}>
            
            {/* Header: Fixed at top */}
            <div className={`px-6 py-4 bg-[#F7F5F0] border-b ${theme.border} flex justify-between items-center shrink-0`}>
              <h2 className="text-base font-bold text-[#3A3A3A] font-serif tracking-wide">
                {editingItem ? '編輯' : '新增'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-[#999]" /></button>
            </div>
            
            {/* Body: Scrollable */}
            <div className="overflow-y-auto p-6 flex-1">
              <form id="item-form" onSubmit={handleSubmitItem} className="space-y-4">
                {viewMode === 'itinerary' && (
                  <>
                    <div className="grid grid-cols-7 gap-1">
                      {Object.entries(ICON_MAP).map(([key, val]) => (
                        <button key={key} type="button" onClick={() => setFormData({...formData, type: key})} className={`py-2 px-0.5 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${formData.type === key ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}><val.icon size={16} /><span className="text-[8px] scale-90">{val.label}</span></button>
                      ))}
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-[130px]"><label className="block text-xs font-bold text-[#888] mb-1">開始時間</label><input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-sm text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder} h-10`} /></div>
                      <div className="flex flex-1 gap-2 items-end">
                        <div className="w-[130px]"><label className="block text-xs font-bold text-[#888] mb-1">停留 (分)</label><input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="numeric" value={formData.duration === 0 ? '' : formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-sm text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder} h-10`} /></div>
                        <div className="flex flex-col gap-1 pb-0.5"><div className="flex gap-1"><button type="button" onClick={() => setFormData({...formData, duration: 30})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>30分</button><button type="button" onClick={() => setFormData({...formData, duration: 60})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>60分</button></div><div className="flex gap-1"><button type="button" onClick={() => setFormData({...formData, duration: 90})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>90分</button><button type="button" onClick={() => setFormData({...formData, duration: 120})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>120分</button></div></div>
                      </div>
                    </div>
                  </>
                )}

                {viewMode === 'expenses' ? (
                  <>
                      {/* 日期 (第一行) */}
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-[#888] mb-1">日期</label>
                        <input 
                          type="date" 
                          value={formData.date} 
                          onChange={e => setFormData({...formData, date: e.target.value})} 
                          className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-sm text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder}`} 
                        />
                      </div>

                      {/* 類別 (第二行) */}
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-[#888] mb-1">類別</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
                            <button 
                                key={k} 
                                type="button" 
                                onClick={() => setFormData({...formData, category: k})} 
                                className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${formData.category === k ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}
                            >
                              <v.icon size={16} />
                              <span>{v.label}</span>
                            </button>
                            ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-1/3">
                          <input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-sm font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                        </div>
                        <div className="flex-1">
                          <input type="text" placeholder="項目名稱" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-sm font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[#888]">
                        <MapPin size={16} />
                        <input type="text" placeholder="地點/地址" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`flex-1 bg-transparent border-b ${theme.border} py-1 text-sm focus:outline-none focus:${theme.primaryBorder}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用 (總額)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-sm appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div>
                          </div>
                          <input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formData.cost === 0 ? '' : formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} />
                        </div>
                        {formData.cost > 0 && <div className="text-right text-[10px] text-[#888] mt-1">{formData.costType === 'FOREIGN' ? `約 NT$ ${formatMoney(Math.round(formData.cost * currencySettings.exchangeRate))}` : `約 ${currencySettings.selectedCountry.symbol} ${formatMoney(Math.round(formData.cost / currencySettings.exchangeRate))}`}</div>}
                      </div>
                      <div className={`bg-[#F2F0EB] p-3 rounded-lg border ${theme.border}`}>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-xs font-bold ${theme.primary}`}>分攤方式</label>
                        </div>
                        <div className="space-y-2 mb-3">
                            {formData.details && formData.details.map((detail, idx) => (
                                <div key={detail.id} className={`flex flex-wrap items-center gap-2 bg-white p-2 rounded border ${theme.border} shadow-sm text-xs`}>
                                    <div className="relative min-w-[4.5rem]">
                                        <select 
                                          value={detail.payer} 
                                          onChange={(e) => updateSplitDetail(detail.id, 'payer', e.target.value)}
                                          className="w-full pl-6 pr-4 py-1 appearance-none bg-transparent font-bold text-[#3A3A3A] focus:outline-none cursor-pointer"
                                        >
                                            {companions.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${theme.border} flex items-center justify-center text-[8px] font-serif pointer-events-none`}>
                                          {detail.payer.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <ArrowRight size={10} className="text-[#CCC]" />
                                    <div className="relative min-w-[5rem]">
                                        <select 
                                          value={detail.target} 
                                          onChange={(e) => updateSplitDetail(detail.id, 'target', e.target.value)}
                                          className={`w-full pl-6 pr-4 py-1 appearance-none bg-transparent font-bold ${theme.primary} focus:outline-none cursor-pointer`}
                                        >
                                            {companions.map(c => <option key={c} value={c}>{c}</option>)}
                                            <option value="ALL">均攤</option>
                                        </select>
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${theme.border} flex items-center justify-center text-[8px] font-serif pointer-events-none`}>
                                          {detail.target === 'ALL' ? <Users size={10} /> : detail.target.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-end gap-1">
                                        <span className="text-[10px] text-[#888]">{currencySettings.selectedCountry.currency}</span>
                                        <input 
                                          type="number" 
                                          min="0"
                                          onFocus={(e) => e.target.select()}
                                          onKeyDown={blockInvalidChar}
                                          inputMode="decimal"
                                          value={detail.amount === 0 ? '' : detail.amount} 
                                          onChange={(e) => updateSplitDetail(detail.id, 'amount', parseInt(e.target.value) || 0)}
                                          className={`w-16 text-right border-b ${theme.border} focus:${theme.primaryBorder} focus:outline-none bg-transparent font-bold`}
                                        />
                                    </div>
                                    {formData.details.length > 1 && (
                                      <button type="button" onClick={() => removeSplitDetail(detail.id)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1 rounded`}>
                                          <X size={12} />
                                      </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button 
                          type="button" 
                          onClick={addSplitDetail}
                          className={`w-full py-2 border border-dashed border-[#A98467] text-[#A98467] rounded hover:bg-[#FDFCFB] text-xs font-bold flex items-center justify-center gap-1 transition-colors`}
                          style={{ borderColor: theme.accentHex, color: theme.accentHex }}
                        >
                          <Plus size={12} /> 新增分帳
                        </button>
                      </div>
                  </>
                ) : (
                  <>
                    {(checklistTab === 'food' || checklistTab === 'shopping') ? (
                      <div className="flex gap-3">
                        <div className="w-1/3">
                          <input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-lg font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                        </div>
                        <div className="flex-1">
                          <input type="text" placeholder="店名 / 商品" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-lg font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                        </div>
                      </div>
                    ) : (
                      <input type="text" placeholder={checklistTab === 'packing' && viewMode === 'checklist' ? "物品名稱" : "標題"} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-lg font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                    )}

                    {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-sm appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div>
                          </div>
                          <input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formData.cost === 0 ? '' : formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} />
                        </div>
                        {formData.cost > 0 && <div className="text-right text-[10px] text-[#888] mt-1">{formData.costType === 'FOREIGN' ? `約 NT$ ${formatMoney(Math.round(formData.cost * currencySettings.exchangeRate))}` : `約 ${currencySettings.selectedCountry.symbol} ${formatMoney(Math.round(formData.cost / currencySettings.exchangeRate))}`}</div>}
                      </div>
                    )}

                    {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#888]"><MapPin size={16} /><input type="text" placeholder="地點/地址" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`flex-1 bg-transparent border-b ${theme.border} py-1 text-sm focus:outline-none focus:${theme.primaryBorder}`} /></div>
                        <div className="flex items-center gap-2 text-[#888]"><Globe size={16} /><input type="url" placeholder="網站連結" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className={`flex-1 bg-transparent border-b ${theme.border} py-1 text-sm focus:outline-none focus:${theme.primaryBorder} placeholder:text-xs`} /></div>
                      </div>
                    )}
                  </>
                )}

                {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-1">備註</label>
                    <textarea rows={2} placeholder="備註..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-3 text-xs text-[#666] resize-none focus:outline-none focus:${theme.primaryBorder}`} />
                  </div>
                )}
              </form>
            </div>
            
            {/* Footer: Fixed at bottom */}
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] shrink-0`}>
              <button type="submit" form="item-form" className={`w-full bg-[#3A3A3A] text-[#F9F8F6] py-3 rounded-lg font-bold text-sm hover:${theme.primaryBg} transition-colors`}>{editingItem ? '儲存' : '新增'}</button>
            </div>
          </div>
        </div>
      )}

      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0">
              <div className={`w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-3 ${theme.accent}`}>
                <Calculator size={24} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#3A3A3A]">通貨設定</h2>
            </div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="currency-form" onSubmit={handleCurrencySubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">旅遊國家</label>
                  <div className="relative">
                    <select value={tempCurrency?.selectedCountry?.code || ''} onChange={(e) => { const country = COUNTRY_OPTIONS.find(c => c.code === e.target.value); setTempCurrency({ ...tempCurrency, selectedCountry: country, exchangeRate: country.defaultRate }); }} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-3 text-[#3A3A3A] text-sm appearance-none focus:outline-none focus:${theme.primaryBorder}`}>
                      {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} {c.currency}</option>)}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-[#888]">▼</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">匯率</label>
                  <div className="flex items-center gap-3 justify-center">
                    <span className={`text-sm font-bold ${theme.primary} whitespace-nowrap`}>1 {tempCurrency?.selectedCountry?.currency || '???'} =</span>
                    <input type="number" step="0.0001" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" value={tempCurrency?.exchangeRate || 0} onChange={e => setTempCurrency({...tempCurrency, exchangeRate: parseFloat(e.target.value)})} className={`w-28 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] font-bold text-center focus:outline-none focus:${theme.primaryBorder}`} />
                    <span className={`text-sm font-bold ${theme.primary}`}>TWD</span>
                  </div>
                </div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] flex gap-3 shrink-0`}>
              <button type="button" onClick={() => setIsCurrencyModalOpen(false)} className={`flex-1 py-2.5 text-xs font-bold text-[#888] hover:${theme.hover} rounded-lg`}>取消</button>
              <button type="submit" form="currency-form" className={`flex-1 ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>確認設定</button>
            </div>
          </div>
        </div>
      )}

      {isCompanionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0">
              <div className={`w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-3 ${theme.accent}`}>
                <Users size={24} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅伴管理</h2>
            </div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="companion-form" onSubmit={handleAddCompanion} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">新增成員</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="名字..." value={newCompanionName} onChange={(e) => setNewCompanionName(e.target.value)} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder}`} />
                    <button type="submit" className="bg-[#3A3A3A] text-white px-4 rounded-lg hover:opacity-90"><Plus size={20} /></button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-bold text-[#888] uppercase">目前成員</label>
                    {companions.length > 0 && <button type="button" onClick={handleClearAllCompanions} className={`text-[10px] text-[#C55A5A] hover:${theme.dangerBg} px-2 py-1 rounded flex items-center gap-1`}><Trash2 size={12} />全て削除</button>}
                  </div>
                  <div className={`bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto`}>
                    {companions.length === 0 ? <div className="text-center py-4 text-[#AAA] text-xs">無</div> : companions.map((c, i) => (
                      <div key={`${c}-${i}`} className={`flex items-center justify-between p-2 bg-white rounded shadow-sm border ${theme.border}`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(i)} flex items-center justify-center ${theme.primary} shrink-0 border-2 border-white shadow-sm font-serif font-bold text-sm`}>{c.charAt(0).toUpperCase()}</div>
                          {editingCompanionIndex === i ? 
                            <input type="text" value={editingCompanionName} onChange={(e) => setEditingCompanionName(e.target.value)} className={`flex-1 border-b ${theme.primaryBorder} outline-none text-sm text-[#3A3A3A] py-0.5 font-serif`} autoFocus onBlur={() => saveEditCompanion(i)} onKeyDown={(e) => {if(e.key==='Enter'){e.preventDefault();saveEditCompanion(i)}}} /> 
                            : 
                            <span className={`text-sm font-bold text-[#3A3A3A] truncate cursor-pointer hover:${theme.primary} font-serif`} onClick={() => startEditCompanion(i, c)}>{c}</span>
                          }
                        </div>
                        <div className="flex gap-1 ml-2">
                          {editingCompanionIndex === i ? 
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => saveEditCompanion(i)} className={`${theme.primary} hover:${theme.hover} p-1.5 rounded`}><Check size={14} /></button> 
                            : 
                            <button type="button" onClick={() => handleRemoveCompanion(i)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1.5 rounded`}><Minus size={14} /></button>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] shrink-0`}>
              <button type="button" onClick={() => setIsCompanionModalOpen(false)} className={`w-full ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>完成</button>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0">
              <h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅程設定</h2>
            </div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="settings-form" onSubmit={handleSettingsSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">旅程標題</label>
                  <input type="text" value={tempSettings.title} onChange={e => setTempSettings({...tempSettings, title: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">出發日</label>
                    <input type="date" value={tempSettings.startDate} onChange={handleStartDateChange} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">回程日</label>
                    <input type="date" value={tempSettings.endDate} min={tempSettings.startDate} onChange={(e) => setTempSettings({...tempSettings, endDate: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-sm focus:outline-none focus:${theme.primaryBorder}`} />
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-2 uppercase flex items-center gap-1"><Palette size={12}/> 顏色主題</label>
                  <div className="flex gap-2 justify-between">
                    {Object.values(THEMES).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onChangeTheme(t.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${t.bg} border ${t.id === theme.id ? `border-2 ${t.primaryBorder} scale-110 shadow-md` : 'border-gray-200'}`}
                        title={t.label}
                      >
                        <div className={`w-4 h-4 rounded-full ${t.primaryBg}`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`text-center bg-[#F2F0EB] py-2 rounded-lg border border-dashed ${theme.border}`}>
                  <span className="text-xs text-[#888] font-bold">總天數: </span>
                  <span className={`text-sm font-serif font-bold ${theme.primary}`}>{calculateDaysDiff(tempSettings.startDate, tempSettings.endDate)} 天</span>
                </div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] flex gap-3 shrink-0`}>
              <button type="button" onClick={() => setIsSettingsOpen(false)} className={`flex-1 py-2.5 text-xs font-bold text-[#888] hover:${theme.hover} rounded-lg`}>取消</button>
              <button type="submit" form="settings-form" className={`flex-1 ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>完成</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ==========================================
// Component: TravelHome (The Home Screen)
// ==========================================

const TravelHome = ({ projects, onAddProject, onDeleteProject, onOpenProject, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-serif ${theme.selection} flex flex-col`}>
      <nav className={`w-full px-8 py-6 flex justify-between items-center border-b ${theme.border}/50`}>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${theme.primaryBg} rounded-full opacity-80`}></div>
          <span className={`text-xl tracking-widest font-bold ${theme.primary}`}> 𝐓𝐑𝐀𝐕𝐄𝐋 </span>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
        <div className={`absolute top-10 left-10 w-64 h-64 rounded-full ${theme.bg === 'bg-[#EAEAEA]' ? 'bg-[#CCCCCC]' : 'bg-[#E6E2D3]'} opacity-20 blur-3xl -z-10 animate-pulse`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full ${theme.primaryBg} opacity-5 blur-3xl -z-10`}></div>

        <div className="flex flex-col items-center justify-center space-y-8 z-10 text-center w-full max-w-2xl">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-light ${theme.primary} leading-tight tracking-widest mb-2`}>
            我的旅程
          </h1>

          <p className="text-[#888888] text-sm md:text-base tracking-[0.4em] font-light uppercase mb-8">
            SELECT YOUR JOURNEY
          </p>

          <div className="w-full max-w-sm flex flex-col gap-4 my-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onOpenProject(project)}
                className={`group relative bg-[#FFFFFF] border ${theme.border} py-4 px-8 rounded-full shadow-sm hover:shadow-md hover:bg-[#F2F0EB] transition-all duration-500 cursor-pointer flex justify-between items-center overflow-hidden`}
                style={{ borderColor: theme.border.replace('border-', '') }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accent.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="flex flex-col items-start gap-1 pl-2">
                  <span className={`text-[#464646] tracking-[0.2em] font-light group-hover:${theme.primary} transition-colors text-left`}>
                    {project.name}
                  </span>
                  <span className="text-xs text-[#888888] font-sans tracking-widest">
                    {formatLastModified(project.lastModified)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronRight 
                    size={16} 
                    className={`text-[#E6E2D3] group-hover:opacity-0 absolute right-8 transition-all duration-300`} 
                  />
                  
                  <button
                    onClick={(e) => onDeleteProject(e, project.id)}
                    className={`opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFF0F0] text-[#E6E2D3] hover:text-[#C55A5A]`}
                    title="刪除"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <button 
              onClick={onAddProject}
              className={`group relative flex items-center gap-3 ${theme.primaryBg} text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-500 ease-out overflow-hidden`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              <span className="relative z-10 font-medium tracking-widest text-sm md:text-base">
                新增旅程
              </span>
              <div className={`relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ${isHovered ? 'rotate-90' : 'rotate-0'}`}>
                <Plus size={16} />
              </div>
            </button>
          </div>

        </div>
      </main>

      <footer className={`w-full py-8 text-center text-[#888888] text-xs border-t ${theme.border} mt-auto`}>
        <p className="tracking-widest"> © 𝟤𝟢𝟤𝟧 ꜱʜᴜᴜ ᴄᴢʜ. </p>
      </footer>
    </div>
  );
};

// ==========================================
// Main App Component (Router)
// ==========================================

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeProject, setActiveProject] = useState(null);
  
  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState('mori');
  const theme = THEMES[currentThemeId];

  // 1. Projects List
  const [projects, setProjects] = useState([
    { id: 1, name: '東京 5 日遊', lastModified: new Date().toISOString() }
  ]);

  // 2. All Projects Data Store
  const [allProjectsData, setAllProjectsData] = useState({
    1: generateNewProjectData('東京 5 日遊')
  });

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setCurrentView('planner');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setActiveProject(null);
  };

  const handleAddProject = () => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const displayNum = (projects.length + 1).toString().padStart(2, '0');
    const newName = `我的旅程 ${displayNum}`;
    
    const newProject = { 
      id: nextId, 
      name: newName,
      lastModified: new Date().toISOString()
    };
    
    setProjects([...projects, newProject]);
    
    setAllProjectsData(prev => ({
        ...prev,
        [nextId]: generateNewProjectData(newName)
    }));
  };

  const handleDeleteProject = (e, id) => {
    e.stopPropagation(); 
    setProjects(projects.filter(project => project.id !== id));
    setAllProjectsData(prev => {
        const newData = { ...prev };
        delete newData[id];
        return newData;
    });
  };

  const handleSaveProjectData = (projectId, newData) => {
    setAllProjectsData(prev => ({
        ...prev,
        [projectId]: { ...prev[projectId], ...newData }
    }));

    setProjects(prevProjects => prevProjects.map(p => 
        p.id === projectId ? { 
          ...p, 
          name: (newData.tripSettings && newData.tripSettings.title) ? newData.tripSettings.title : p.name,
          lastModified: new Date().toISOString()
        } : p
    ));

    if (newData.tripSettings && newData.tripSettings.title && activeProject && activeProject.id === projectId) {
        setActiveProject(prev => ({ ...prev, name: newData.tripSettings.title }));
    }
  };

  if (currentView === 'planner' && activeProject) {
    const defaultData = generateNewProjectData(activeProject.name);
    const storedData = allProjectsData[activeProject.id] || {};
    
    const projectData = {
        ...defaultData,
        ...storedData,
        tripSettings: { ...defaultData.tripSettings, ...(storedData.tripSettings || {}) },
        currencySettings: { ...defaultData.currencySettings, ...(storedData.currencySettings || {}) }
    };
    
    return (
      <TripPlanner 
        key={activeProject.id}
        projectData={projectData} 
        onBack={handleBackToHome} 
        onSaveData={(newData) => handleSaveProjectData(activeProject.id, newData)}
        theme={theme}
        onChangeTheme={setCurrentThemeId}
      />
    );
  }

  return (
    <TravelHome 
      projects={projects} 
      onAddProject={handleAddProject} 
      onDeleteProject={handleDeleteProject}
      onOpenProject={handleOpenProject} 
      theme={theme}
    />
  );
}