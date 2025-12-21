import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Plus, ChevronRight, X, Plane, Hotel, Coffee, Camera, MapPin, Train, 
  Trash2, Edit3, GripVertical, Clock, Settings, Flower2, PenTool, Utensils,
  ArrowRight, Coins, Calculator, Copy, Globe, Check, Navigation, Users, 
  User, Minus, List, ShoppingBag, Luggage, Map as MapIcon, UtensilsCrossed, 
  Receipt, PieChart, TrendingUp, Wallet, ArrowLeftRight, Home, Palette, 
  Download, Upload, Loader2, FileText, LayoutList, Palmtree, Tent, 
  Ticket, Bus, Car, Ship, Music, Gamepad2, Gift, Shirt, Briefcase, 
  Smartphone, Laptop, Anchor, Umbrella, Sun, Moon, Star, Heart, Smile,
  Cloud, CloudUpload, CloudDownload, LogIn, LogOut, CheckCircle2, RefreshCw
} from 'lucide-react';

// --- Icon Registry for Dynamic Usage ---
const ICON_REGISTRY = {
  Camera, Utensils, Coffee, Train, Hotel, MapPin, Plane, 
  ShoppingBag, Coins, Bus, Car, Ship, Ticket, Palmtree, 
  Tent, Music, Gamepad2, Gift, Shirt, Briefcase, Smartphone, 
  Laptop, Anchor, Umbrella, Sun, Moon, Star, Heart, Smile,
  Flower2, Luggage, Calculator, Wallet, Receipt
};

// --- Google API Config ---
const GOOGLE_CLIENT_ID = "456137719976-dp4uin8ae10f332qbhqm447nllr2u4ec.apps.googleusercontent.com";
// SCOPES: Includes drive.file to allow searching, renaming, and deleting files created by this app
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

// --- Initial Default Categories ---
const DEFAULT_ITINERARY_CATEGORIES = [
  { id: 'sightseeing', label: '景點', icon: 'Camera', color: 'bg-[#F2F4F1]' },
  { id: 'food', label: '美食', icon: 'Utensils', color: 'bg-[#F7F0ED]' },
  { id: 'cafe', label: '咖啡', icon: 'Coffee', color: 'bg-[#F4EDE6]' },
  { id: 'transport', label: '交通', icon: 'Train', color: 'bg-[#EFF1F3]' },
  { id: 'hotel', label: '住宿', icon: 'Hotel', color: 'bg-[#EEEFF2]' },
  { id: 'shopping', label: '購物', icon: 'ShoppingBag', color: 'bg-[#F9F5F0]' },
  { id: 'flight', label: '飛行', icon: 'Plane', color: 'bg-[#EFF4F7]' },
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'food', label: '餐飲', icon: 'Utensils' },
  { id: 'transport', label: '交通', icon: 'Train' },
  { id: 'shopping', label: '購物', icon: 'ShoppingBag' },
  { id: 'stay', label: '住宿', icon: 'Hotel' },
  { id: 'ticket', label: '票券', icon: 'Ticket' },
  { id: 'other', label: '其他', icon: 'Coins' },
];

const CATEGORY_COLORS = [
  'bg-[#F2F4F1]', 'bg-[#F7F0ED]', 'bg-[#F4EDE6]', 'bg-[#EFF1F3]', 
  'bg-[#EEEFF2]', 'bg-[#F9F5F0]', 'bg-[#EFF4F7]', 'bg-[#E6F0F5]',
  'bg-[#FFF5F7]', 'bg-[#F7F3EF]', 'bg-[#EAEAEA]', 'bg-[#FFD6D6]',
  'bg-[#D6E4FF]', 'bg-[#D6FFD9]', 'bg-[#FFFBD6]', 'bg-[#EAD6FF]'
];

// --- Themes ---
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

const AppLogo = ({ theme }) => (
  <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${theme.primaryBg} text-white border border-white/20`}>
    <Plane size={18} className="-rotate-45 translate-x-0.5 translate-y-0.5" strokeWidth={2.5} />
  </div>
);

// --- Helpers ---

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
    themeId: 'mori', // Default theme for new projects
    tripSettings: { title: title, startDate: startDateStr, endDate: endDateStr, days: 3 },
    companions: ['Me'],
    currencySettings: { selectedCountry: COUNTRY_OPTIONS[0], exchangeRate: COUNTRY_OPTIONS[0].defaultRate },
    categories: {
      itinerary: DEFAULT_ITINERARY_CATEGORIES,
      expense: DEFAULT_EXPENSE_CATEGORIES
    },
    itineraries: getDefaultItinerary(),
    packingList: getDefaultPackingList(),
    shoppingList: getDefaultShoppingList(),
    foodList: getDefaultFoodList(),
    expenses: defaultExpenses,
    googleDriveFileId: null // Track associated Google Drive file ID
  };
};

const TripPlanner = ({ 
  projectData, 
  onBack, 
  onSaveData, 
  theme, 
  onChangeTheme, 
  googleUser, 
  gapiInited 
}) => {
  const [viewMode, setViewMode] = useState('itinerary');
  const [categoryManagerTab, setCategoryManagerTab] = useState('itinerary');
  
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

  const [itineraryCategories, setItineraryCategories] = useState(projectData?.categories?.itinerary || DEFAULT_ITINERARY_CATEGORIES);
  const [expenseCategories, setExpenseCategories] = useState(projectData?.categories?.expense || DEFAULT_EXPENSE_CATEGORIES);
  
  // Track Google Drive File ID locally for this session
  const [googleDriveFileId, setGoogleDriveFileId] = useState(projectData?.googleDriveFileId || null);

  const [isXlsxLoaded, setIsXlsxLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    if (window.XLSX) {
      setIsXlsxLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.async = true;
      script.onload = () => setIsXlsxLoaded(true);
      document.body.appendChild(script);
    }
    return () => {}
  }, []);

  // --- Auto Save Logic ---
  useEffect(() => {
      // Only auto-save if logged in and API is ready
      if (!googleUser || !gapiInited) return;

      const timer = setTimeout(() => {
          handleSaveToGoogleSheet(true); // silent = true
      }, 5000); // 5 seconds debounce

      return () => clearTimeout(timer);
  }, [tripSettings, itineraries, expenses, packingList, shoppingList, foodList, googleUser, gapiInited, googleDriveFileId]);

  const handleSaveToGoogleSheet = async (isSilent = false) => {
      if (!googleUser || !gapiInited) {
          if (!isSilent) alert("請先在首頁登入 Google 帳號。");
          return;
      }
      
      if (!isSilent) setIsSyncing(true);
      else setIsAutoSaving(true);

      try {
          const title = `TravelApp_${tripSettings.title}`;
          
          // 1. Prepare Data
          const overviewRows = [
             ["項目", "內容", "", "", "參考：旅行國家", "參考：貨幣代碼"],
             ["專案標題", tripSettings.title],
             ["出發日期", tripSettings.startDate],
             ["回國日期", tripSettings.endDate],
             ["旅行人員", companions.join(", ")],
             ["旅行國家", currencySettings.selectedCountry.name],
             ["貨幣代碼", currencySettings.selectedCountry.currency],
             ["匯率 (1外幣 = TWD)", currencySettings.exchangeRate]
          ];
          COUNTRY_OPTIONS.forEach((country, index) => {
             const rowIndex = index + 1;
             if (!overviewRows[rowIndex]) overviewRows[rowIndex] = ["", "", "", "", "", ""];
             while (overviewRows[rowIndex].length < 6) overviewRows[rowIndex].push("");
             overviewRows[rowIndex][4] = country.name;
             overviewRows[rowIndex][5] = country.currency;
          });

          const itineraryRows = [["Day", "時間", "持續時間(分)", "類型", "標題", "地點", "費用 (外幣)", "備註", "", "參考：類型選項"]];
          const sortedDays = Object.keys(itineraries).sort((a,b) => parseInt(a)-parseInt(b));
          sortedDays.forEach(dayIndex => {
            const dayItems = itineraries[dayIndex] || [];
            dayItems.forEach(item => {
              const cat = itineraryCategories.find(c => c.id === item.type) || { label: item.type };
              itineraryRows.push([`Day ${parseInt(dayIndex) + 1}`, item.time, item.duration || 60, cat.label, item.title, item.location || "", item.cost || 0, item.notes || ""]);
            });
          });
          itineraryCategories.forEach((cat, index) => {
             const rowIndex = index + 1;
             if (!itineraryRows[rowIndex]) itineraryRows[rowIndex] = new Array(10).fill("");
             while(itineraryRows[rowIndex].length < 10) itineraryRows[rowIndex].push("");
             itineraryRows[rowIndex][9] = cat.label;
          });

          const packingRows = [["物品名稱", "狀態"]];
          packingList.forEach(item => packingRows.push([item.title, item.completed ? "已完成" : "未完成"]));

          const shoppingRows = [["地區", "商品名稱", "地點/店名", "預估費用", "購買狀態", "備註"]];
          shoppingList.forEach(item => shoppingRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已購買" : "未購買", item.notes || ""]));

          const foodRows = [["地區", "餐廳名稱", "地點/地址", "預估費用", "完成狀態", "備註"]];
          foodList.forEach(item => foodRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已吃" : "未吃", item.notes || ""]));

          const expenseRows = [["日期", "地區", "類別", "項目", "地點", "付款人", "總金額 (外幣)", "分攤詳情", "", "參考：費用類別"]];
          expenses.forEach(item => {
            const cat = expenseCategories.find(c => c.id === item.category) || { label: item.category };
            let splitStr = item.details?.map(d => `${d.target === 'ALL' ? '全員' : d.target}: ${d.amount}`).join(", ") || `分攤: ${item.shares.join(", ")}`;
            expenseRows.push([item.date, item.region || "", cat.label, item.title, item.location || "", item.payer, item.cost, splitStr]);
          });
          expenseCategories.forEach((cat, index) => {
             const rowIndex = index + 1;
             if (!expenseRows[rowIndex]) expenseRows[rowIndex] = new Array(10).fill("");
             while(expenseRows[rowIndex].length < 10) expenseRows[rowIndex].push("");
             expenseRows[rowIndex][9] = cat.label;
          });

          const categoryRows = [["類型", "ID", "名稱", "圖示", "顏色"]];
          itineraryCategories.forEach(c => categoryRows.push(["行程", c.id, c.label, c.icon, c.color]));
          expenseCategories.forEach(c => categoryRows.push(["費用", c.id, c.label, c.icon, ""]));

          const sheetStructure = {
              properties: { title: title },
              sheets: [
                  { properties: { title: '專案概覽' } },
                  { properties: { title: '行程表' } },
                  { properties: { title: '行李' } },
                  { properties: { title: '購物' } },
                  { properties: { title: '美食' } },
                  { properties: { title: '費用' } },
                  { properties: { title: '管理類別' } }
              ]
          };

          // 2. Check and Rename/Create
          let spreadsheetId = googleDriveFileId;
          let fileExists = false;

          // If we have a stored ID, check if it's still valid and check its name
          if (spreadsheetId) {
              try {
                  const fileRes = await window.gapi.client.drive.files.get({
                      fileId: spreadsheetId,
                      fields: 'id, name, trashed'
                  });
                  
                  if (!fileRes.result.trashed) {
                      fileExists = true;
                      // RENAME LOGIC: If title changed, update cloud file name
                      if (fileRes.result.name !== title) {
                          await window.gapi.client.drive.files.update({
                              fileId: spreadsheetId,
                              resource: { name: title }
                          });
                          if (!isSilent) console.log(`Cloud file renamed to: ${title}`);
                      }
                  }
              } catch (e) {
                  // File might be deleted or permission lost
                  console.warn("Stored File ID not found or inaccessible, falling back to search.");
                  spreadsheetId = null; 
              }
          }

          if (!fileExists) {
              // Search by name logic (Legacy support or if ID lost)
              const q = `name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
              const searchRes = await window.gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
              
              if (searchRes.result.files && searchRes.result.files.length > 0) {
                  spreadsheetId = searchRes.result.files[0].id;
              } else {
                  // Create New
                  const createResponse = await window.gapi.client.sheets.spreadsheets.create({
                      resource: sheetStructure
                  });
                  spreadsheetId = createResponse.result.spreadsheetId;
              }
              
              // Update local state with the new ID
              setGoogleDriveFileId(spreadsheetId);
          }
          
          // 3. Write Data
          if (fileExists || spreadsheetId) { 
               // Clear old content to avoid mixing data
               await window.gapi.client.sheets.spreadsheets.values.batchClear({
                  spreadsheetId,
                  resource: { ranges: ["專案概覽", "行程表", "行李", "購物", "美食", "費用", "管理類別"] }
              });
          }

          await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
              spreadsheetId: spreadsheetId,
              resource: {
                  valueInputOption: "RAW",
                  data: [
                      { range: "專案概覽!A1", values: overviewRows },
                      { range: "行程表!A1", values: itineraryRows },
                      { range: "行李!A1", values: packingRows },
                      { range: "購物!A1", values: shoppingRows },
                      { range: "美食!A1", values: foodRows },
                      { range: "費用!A1", values: expenseRows },
                      { range: "管理類別!A1", values: categoryRows }
                  ]
              }
          });
          
          if (!isSilent) alert(`同步成功！\n檔案：${title}\n(已覆蓋更新)`);

      } catch (error) {
          console.error("Error saving to Google Sheets:", error);
          if (error.status === 401 || error.status === 403) {
             if (!isSilent) alert("授權過期，請重新登入 Google。");
          } else {
             if (!isSilent) alert("儲存失敗，請檢查網路連線。");
          }
      } finally {
          setIsSyncing(false);
          setIsAutoSaving(false);
      }
  };


  useEffect(() => {
    onSaveData({
      tripSettings,
      companions,
      currencySettings,
      itineraries,
      packingList,
      shoppingList,
      foodList,
      expenses,
      categories: {
        itinerary: itineraryCategories,
        expense: expenseCategories
      },
      googleDriveFileId: googleDriveFileId // Persist the ID
    });
  }, [tripSettings, companions, currencySettings, itineraries, packingList, shoppingList, foodList, expenses, itineraryCategories, expenseCategories, googleDriveFileId]);

  const [statsMode, setStatsMode] = useState('real');
  const [statsCategoryFilter, setStatsCategoryFilter] = useState('all');
  const [statsPersonFilter, setStatsPersonFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  
  // New state for confirmation modal to avoid browser confirm
  const [confirmAction, setConfirmAction] = useState(null); // { message, onConfirm }

  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [categoryFormData, setCategoryFormData] = useState({});

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

  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  // --- Helper to get Icon Component ---
  const getIconComponent = (iconName) => ICON_REGISTRY[iconName] || Camera;

  // --- Confirmation Helper ---
  const confirm = (message, action) => {
    setConfirmAction({ message, onConfirm: action });
  };
  
  // --- Sorting Helper for Categories ---
  const sortExpensesByRegionAndCategory = (items) => {
    const catOrder = expenseCategories.map(c => c.id);
    return [...items].sort((a, b) => {
      const regionA = a.region || 'zzzz';
      const regionB = b.region || 'zzzz';
      if (regionA !== regionB) return regionA.localeCompare(regionB);
      return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
    });
  };

  // --- Handling Excel Import ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !window.XLSX) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = window.XLSX.read(bstr, { type: 'binary' });
        
        // 1. Parse Overview (專案概覽)
        const wsOverview = wb.Sheets["專案概覽"];
        if (wsOverview) {
            const data = window.XLSX.utils.sheet_to_json(wsOverview, { header: 1 });
            const title = data[1] ? data[1][1] : tripSettings.title;
            let startDate = data[2] ? data[2][1] : tripSettings.startDate;
            let endDate = data[3] ? data[3][1] : tripSettings.endDate;
            
            if (typeof startDate === 'number') startDate = new Date(Math.round((startDate - 25569)*86400*1000)).toISOString().split('T')[0];
            if (typeof endDate === 'number') endDate = new Date(Math.round((endDate - 25569)*86400*1000)).toISOString().split('T')[0];

            const companionsStr = data[4] ? data[4][1] : "";
            const newCompanions = companionsStr ? companionsStr.split(",").map(s => s.trim()) : ["Me"];
            
            const countryName = data[5] ? data[5][1] : "";
            const currencyCode = data[6] ? data[6][1] : "";
            const exchangeRate = data[7] ? parseFloat(data[7][1]) : 1;

            const selectedCountry = COUNTRY_OPTIONS.find(c => c.name === countryName || c.currency === currencyCode) || COUNTRY_OPTIONS[0];

            const days = calculateDaysDiff(startDate, endDate);

            setTripSettings({ title, startDate, endDate, days });
            setCompanions(newCompanions);
            setCurrencySettings({ selectedCountry, exchangeRate });
        }

        // 5. Parse Categories (管理類別) - MUST be before parsing other sheets to populate IDs
        const wsCategories = wb.Sheets["管理類別"];
        // Temporary storage for imported categories to use during this import session
        let currentItinCats = [...itineraryCategories];
        let currentExpCats = [...expenseCategories];

        if (wsCategories) {
            const catData = window.XLSX.utils.sheet_to_json(wsCategories);
            const newItinCats = [];
            const newExpCats = [];
            
            catData.forEach(row => {
                const type = row["類型"];
                const item = {
                    id: row["ID"] ? String(row["ID"]) : `cat_${Date.now()}_${Math.random()}`,
                    label: row["名稱"] || "未命名",
                    icon: ICON_REGISTRY[row["圖示"]] ? row["圖示"] : 'Star',
                    color: row["顏色"] || ''
                };
                
                if (type === "行程") {
                    if (!item.color) item.color = 'bg-[#F2F4F1]';
                    newItinCats.push(item);
                } else if (type === "費用") {
                    newExpCats.push(item);
                }
            });
            
            if (newItinCats.length > 0) {
                setItineraryCategories(newItinCats);
                currentItinCats = newItinCats;
            }
            if (newExpCats.length > 0) {
                setExpenseCategories(newExpCats);
                currentExpCats = newExpCats;
            }
        }

        // Helper maps using the (potentially updated) categories
        const itinLabelToId = {};
        currentItinCats.forEach(c => itinLabelToId[c.label] = c.id);
        const expLabelToId = {};
        currentExpCats.forEach(c => expLabelToId[c.label] = c.id);

        // 2. Parse Itinerary (行程表)
        const wsItinerary = wb.Sheets["行程表"];
        if (wsItinerary) {
            const rawData = window.XLSX.utils.sheet_to_json(wsItinerary);
            const newItineraries = {};
            
            rawData.forEach(row => {
                const dayStr = row["Day"] || "Day 1";
                const dayIndex = parseInt(dayStr.replace("Day ", "")) - 1;
                if (dayIndex < 0) return;

                if (!newItineraries[dayIndex]) newItineraries[dayIndex] = [];

                const typeLabel = row["類型"];
                const typeId = itinLabelToId[typeLabel] || currentItinCats[0].id;

                newItineraries[dayIndex].push({
                    id: Date.now() + Math.random(),
                    type: typeId,
                    title: row["標題"] || "未命名",
                    time: row["時間"] || "09:00",
                    duration: parseInt(row["持續時間(分)"]) || 60,
                    location: row["地點"] || "",
                    cost: parseFloat(row["費用 (外幣)"]) || 0,
                    notes: row["備註"] || ""
                });
            });
            setItineraries(newItineraries);
        }

        // 3. Parse Lists (Packing, Shopping, Food)
        const parseList = (sheetName, mapFn) => {
            const ws = wb.Sheets[sheetName];
            if (!ws) return [];
            return window.XLSX.utils.sheet_to_json(ws).map(mapFn);
        };

        setPackingList(parseList("行李", row => ({
            id: Date.now() + Math.random(),
            title: row["物品名稱"] || "未命名",
            completed: row["狀態"] === "已完成"
        })));

        setShoppingList(parseList("購物", row => ({
            id: Date.now() + Math.random(),
            region: row["地區"] || "",
            title: row["商品名稱"] || "未命名",
            location: row["地點/店名"] || "",
            cost: parseFloat(row["預估費用"]) || 0,
            completed: row["購買狀態"] === "已購買",
            notes: row["備註"] || ""
        })));

        setFoodList(parseList("美食", row => ({
            id: Date.now() + Math.random(),
            region: row["地區"] || "",
            title: row["餐廳名稱"] || "未命名",
            location: row["地點/地址"] || "",
            cost: parseFloat(row["預估費用"]) || 0,
            completed: row["完成狀態"] === "已吃",
            notes: row["備註"] || ""
        })));

        // 4. Parse Expenses
        const wsExpenses = wb.Sheets["費用"];
        if (wsExpenses) {
             const rawData = window.XLSX.utils.sheet_to_json(wsExpenses);
             const newExpenses = rawData.map(row => {
                 const catLabel = row["類別"];
                 const catId = expLabelToId[catLabel] || currentExpCats[0].id;
                 const payer = row["付款人"] || "Me";
                 const cost = parseFloat(row["總金額 (外幣)"]) || 0;
                 
                 const splitStr = row["分攤詳情"] || "";
                 let shares = [payer];
                 let details = [];

                 if (splitStr.includes("分攤:")) {
                     const sharesPart = splitStr.replace("分攤:", "").trim();
                     shares = sharesPart.split(",").map(s => s.trim());
                     const shareAmount = Math.round(cost / shares.length);
                     details = shares.map((s, i) => ({
                         id: Date.now() + i + Math.random(),
                         payer: payer,
                         target: s,
                         amount: shareAmount
                     }));
                 } else {
                     shares = [payer]; 
                     const parts = splitStr.split(",").map(s => s.trim());
                     if (parts.length > 0 && parts[0].includes(":")) {
                         shares = [];
                         details = parts.map((p, i) => {
                             const [name, amt] = p.split(":").map(x => x.trim());
                             const targetName = name === '全員' ? 'ALL' : name;
                             if (!shares.includes(targetName)) shares.push(targetName);
                             return {
                                 id: Date.now() + i + Math.random(),
                                 payer: payer,
                                 target: targetName,
                                 amount: parseFloat(amt) || 0
                             }
                         });
                     }
                 }

                 return {
                     id: Date.now() + Math.random(),
                     date: row["日期"] || new Date().toISOString().split('T')[0],
                     region: row["地區"] || "",
                     category: catId,
                     title: row["項目"] || "未命名",
                     location: row["地點"] || "",
                     payer: payer,
                     cost: cost,
                     currency: row["參考：貨幣代碼"] || "JPY",
                     shares: shares,
                     details: details
                 };
             });
             setExpenses(newExpenses);
        }

        alert("匯入成功！");
      } catch (err) { console.error(err); alert("匯入失敗，請確認檔案格式正確。"); }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // --- Handling Excel Export ---
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
      ["出發日期", new Date(tripSettings.startDate)],
      ["回國日期", new Date(tripSettings.endDate)],
      ["旅行人員", companions.join(", ")],
      ["旅行國家", currencySettings.selectedCountry.name],
      ["貨幣代碼", currencySettings.selectedCountry.currency],
      ["匯率 (1外幣 = TWD)", currencySettings.exchangeRate]
    ];

    // 填充概覽參考選單 (E, F 欄位)
    COUNTRY_OPTIONS.forEach((country, index) => {
      const rowIndex = index + 1; // 標題在第0列
      // 確保該列存在
      if (!overviewData[rowIndex]) {
        overviewData[rowIndex] = ["", "", "", "", "", ""];
      }
      // 確保該列長度足夠
      while (overviewData[rowIndex].length < 6) overviewData[rowIndex].push("");
      
      overviewData[rowIndex][4] = country.name;
      overviewData[rowIndex][5] = country.currency;
    });

    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, wsOverview, "專案概覽");

    // 2. 行程表 Sheet
    const itineraryRows = [
      ["Day", "時間", "持續時間(分)", "類型", "標題", "地點", "費用 (外幣)", "備註", "", "參考：類型選項"]
    ];
    
    // Sort days
    const sortedDays = Object.keys(itineraries).sort((a,b) => parseInt(a)-parseInt(b));
    sortedDays.forEach(dayIndex => {
      const dayItems = itineraries[dayIndex] || [];
      dayItems.forEach(item => {
        const cat = itineraryCategories.find(c => c.id === item.type) || { label: item.type };
        itineraryRows.push([
          `Day ${parseInt(dayIndex) + 1}`,
          item.time,
          item.duration || 60, 
          cat.label, 
          item.title,
          item.location || "",
          item.cost || 0,
          item.notes || ""
        ]);
      });
    });

    // 填充行程參考選單 (J 欄位 index 9)
    itineraryCategories.forEach((cat, index) => {
        const rowIndex = index + 1;
        if (!itineraryRows[rowIndex]) {
            itineraryRows[rowIndex] = new Array(10).fill("");
        }
        while(itineraryRows[rowIndex].length < 10) itineraryRows[rowIndex].push("");
        itineraryRows[rowIndex][9] = cat.label;
    });

    const wsItinerary = XLSX.utils.aoa_to_sheet(itineraryRows);
    XLSX.utils.book_append_sheet(wb, wsItinerary, "行程表");

    // 3. Checklists (Packing, Shopping, Food)
    const packingRows = [["物品名稱", "狀態"]];
    packingList.forEach(item => packingRows.push([item.title, item.completed ? "已完成" : "未完成"]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(packingRows), "行李");

    const shoppingRows = [["地區", "商品名稱", "地點/店名", "預估費用", "購買狀態", "備註"]];
    shoppingList.forEach(item => shoppingRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已購買" : "未購買", item.notes || ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(shoppingRows), "購物");

    const foodRows = [["地區", "餐廳名稱", "地點/地址", "預估費用", "完成狀態", "備註"]];
    foodList.forEach(item => foodRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已吃" : "未吃", item.notes || ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(foodRows), "美食");

    // 6. 費用 Sheet
    const expenseRows = [["日期", "地區", "類別", "項目", "地點", "付款人", "總金額 (外幣)", "分攤詳情", "", "參考：費用類別"]];
    expenses.forEach(item => {
      const cat = expenseCategories.find(c => c.id === item.category) || { label: item.category };
      
      let splitStr = "";
      if (item.details && item.details.length > 0) {
        splitStr = item.details.map(d => `${d.target === 'ALL' ? '全員' : d.target}: ${d.amount}`).join(", ");
      } else {
        splitStr = `分攤: ${item.shares.join(", ")}`;
      }

      expenseRows.push([
        new Date(item.date),
        item.region || "",
        cat.label, 
        item.title,
        item.location || "",
        item.payer,
        item.cost,
        splitStr
      ]);
    });

    // 填充費用參考選單 (J 欄位 index 9)
    expenseCategories.forEach((cat, index) => {
        const rowIndex = index + 1;
        if (!expenseRows[rowIndex]) {
            expenseRows[rowIndex] = new Array(10).fill("");
        }
        while(expenseRows[rowIndex].length < 10) expenseRows[rowIndex].push("");
        expenseRows[rowIndex][9] = cat.label;
    });

    const wsExpenses = XLSX.utils.aoa_to_sheet(expenseRows);
    XLSX.utils.book_append_sheet(wb, wsExpenses, "費用");

    // 7. 管理類別 Sheet (New)
    const categoryRows = [["類型", "ID", "名稱", "圖示", "顏色"]];
    itineraryCategories.forEach(c => categoryRows.push(["行程", c.id, c.label, c.icon, c.color]));
    expenseCategories.forEach(c => categoryRows.push(["費用", c.id, c.label, c.icon, ""]));
    const wsCategories = XLSX.utils.aoa_to_sheet(categoryRows);
    XLSX.utils.book_append_sheet(wb, wsCategories, "管理類別");

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
    if (e.target.closest('.draggable-item')) e.target.closest('.draggable-item').style.opacity = '0.5';
  };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = (e) => {
    if (e.target.closest('.draggable-item')) e.target.closest('.draggable-item').style.opacity = '1';
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    // Handle Category Reordering
    if (viewMode === 'categoryManager') {
      const list = categoryManagerTab === 'itinerary' ? [...itineraryCategories] : [...expenseCategories];
      const dragContent = list[dragItem.current];
      list.splice(dragItem.current, 1);
      list.splice(dragOverItem.current, 0, dragContent);
      if (categoryManagerTab === 'itinerary') setItineraryCategories(list);
      else setExpenseCategories(list);
    } 
    // Handle Standard Item Reordering
    else {
      const list = [...getCurrentList()];
      const dragContent = list[dragItem.current];
      list.splice(dragItem.current, 1);
      list.splice(dragOverItem.current, 0, dragContent);
      updateCurrentList(list);
    }
    dragItem.current = null;
    dragOverItem.current = null;
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
      setFormData({ ...baseData, type: itineraryCategories[0]?.id || 'sightseeing', time: defaultTime, duration: 60 });
    } else if (viewMode === 'expenses') {
      setFormData({
        ...baseData,
        date: tripSettings.startDate,
        category: expenseCategories[0]?.id || 'food',
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

  // --- Category Management Functions ---
  const openCategoryEditModal = (category = null) => {
    if (category) {
      setCategoryFormData({ ...category, isNew: false });
    } else {
      setCategoryFormData({ 
        id: Date.now().toString(), 
        label: '', 
        icon: 'Star', 
        color: 'bg-[#F2F4F1]',
        isNew: true 
      });
    }
    setIsCategoryEditModalOpen(true);
  };

  const handleCategorySave = (e) => {
    e.preventDefault();
    const isItinerary = categoryManagerTab === 'itinerary';
    const list = isItinerary ? [...itineraryCategories] : [...expenseCategories];
    const newData = { ...categoryFormData };
    delete newData.isNew;

    if (categoryFormData.isNew) {
      if (isItinerary) setItineraryCategories([...list, newData]);
      else setExpenseCategories([...list, newData]);
    } else {
      const updatedList = list.map(c => c.id === newData.id ? newData : c);
      if (isItinerary) setItineraryCategories(updatedList);
      else setExpenseCategories(updatedList);
    }
    setIsCategoryEditModalOpen(false);
  };

  const handleDeleteCategory = (id) => {
    confirm("確定刪除此類別嗎？已使用此類別的項目將會顯示異常。", () => {
      if (categoryManagerTab === 'itinerary') {
        setItineraryCategories(itineraryCategories.filter(c => c.id !== id));
      } else {
        setExpenseCategories(expenseCategories.filter(c => c.id !== id));
      }
    });
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

    if (viewMode === 'itinerary') newItem.duration = parseInt(formData.duration) || 0;

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
        if (d.target === 'ALL') return sum + (d.amount * companions.length);
        return sum + d.amount;
    }, 0);
    const totalCost = parseFloat(formData.cost) || 0;
    const remaining = Math.max(0, totalCost - currentAllocated);
    const newDetail = { id: Date.now(), payer: 'Me', target: companions[0] || 'Me', amount: remaining };
    setFormData({ ...formData, details: [...(formData.details || []), newDetail] });
  };
  const removeSplitDetail = (detailId) => { setFormData({ ...formData, details: formData.details.filter(d => d.id !== detailId) }); };
  const updateSplitDetail = (detailId, field, value) => {
      const updatedDetails = formData.details.map(d => {
          if (d.id !== detailId) return d;
          let updates = { [field]: value };
          if (field === 'target' && value === 'ALL' && formData.cost) updates.amount = Math.round(formData.cost / companions.length);
          return { ...d, ...updates };
      });
      setFormData({ ...formData, details: updatedDetails });
  };

  const startInlineEdit = (item) => { setInlineEditingId(item.id); setInlineEditText(item.title); };
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

  const openSettingsModal = () => {
    setTempSettings({
      ...tripSettings,
      title: tripSettings.title || '',
      startDate: tripSettings.startDate || '',
      endDate: tripSettings.endDate || '',
      days: tripSettings.days || 1
    });
    setIsSettingsOpen(true);
  };

  const handleSettingsSubmit = (e) => { 
    e.preventDefault(); 
    const days = calculateDaysDiff(tempSettings.startDate, tempSettings.endDate); 
    setTripSettings({ ...tempSettings, days }); 
    setIsSettingsOpen(false); 
    if (activeDay >= days) setActiveDay(0); 
  };

  const handleStartDateChange = (e) => { const newStart = e.target.value; const newEnd = getNextDay(newStart); setTempSettings({ ...tempSettings, startDate: newStart, endDate: newEnd }); };
  const handleCurrencySubmit = (e) => { e.preventDefault(); setCurrencySettings({...tempCurrency}); setIsCurrencyModalOpen(false); };
  const handleAddCompanion = (e) => { e.preventDefault(); if (newCompanionName.trim() && !companions.includes(newCompanionName.trim())) { setCompanions([...companions, newCompanionName.trim()]); setNewCompanionName(''); }};
  const handleRemoveCompanion = (index) => { const newCompanions = [...companions]; newCompanions.splice(index, 1); setCompanions(newCompanions); };
  const handleClearAllCompanions = () => setCompanions([]);
  const startEditCompanion = (index, name) => { setEditingCompanionIndex(index); setEditingCompanionName(name); };
  const saveEditCompanion = (index) => { 
    const oldName = companions[index]; 
    const newName = editingCompanionName.trim(); 
    if (newName && newName !== oldName && !companions.includes(newName)) {
       const newCompanions = [...companions]; newCompanions[index] = newName; setCompanions(newCompanions); 
    }
    setEditingCompanionIndex(null); 
  };

  const statisticsData = useMemo(() => {
    const personStats = {};
    companions.forEach(c => { personStats[c] = { paid: 0, share: 0, balance: 0 }; });
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
                      personalExpensesList.push({ ...exp, id: `${exp.id}_${idx}_${c}`, cost: dAmount, payer: c, realPayer: d.payer, isVirtual: true, noteSuffix: `(均攤)` });
                  });
                  if (!categoryStats.personal[exp.category]) categoryStats.personal[exp.category] = 0;
                  categoryStats.personal[exp.category] += totalForThisDetail;
              } else {
                  if (personStats[d.payer]) personStats[d.payer].paid += dAmount;
                  if (personStats[d.target]) personStats[d.target].share += dAmount;
                  personalExpensesList.push({ ...exp, id: `${exp.id}_${idx}`, cost: dAmount, payer: d.target, realPayer: d.payer, isVirtual: true, noteSuffix: `` });
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
    Object.keys(personStats).forEach(p => { personStats[p].balance = personStats[p].paid - personStats[p].share; });
    const transactions = solveDebts(personStats);
    return { personStats, categoryStats, transactions, personalExpensesList };
  }, [expenses, companions, expenseCategories]);

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

  // ... (PayerAvatar, renderDetailedList and Return JSX remain largely same, just updated FileMenu for sync button) ...
  // To save space in display, focusing on the File Menu part inside JSX:

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-sans pb-32 ${theme.selection}`}>
      
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />

      {/* Header */}
      <header className={`sticky top-0 z-30 ${theme.bg}/95 backdrop-blur-md border-b ${theme.border}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-start gap-4 flex-1 min-w-0">
               {onBack && (
                  <button onClick={onBack} className={`mt-1 text-[#888] hover:${theme.primary} transition-colors p-1 -ml-2 rounded-full ${theme.hover} shrink-0`}>
                      <Home size={20} />
                  </button>
               )}
               <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide text-[#3A3A3A] flex items-center gap-2 truncate pr-2">
                    <div className="shrink-0"><AppLogo theme={theme} /></div>
                    <span className="truncate">{tripSettings.title}</span>
                  </h1>
                  <div className={`text-xs font-serif ${theme.subText} mt-1 tracking-widest uppercase pl-1 flex items-center gap-2 truncate`}>
                      <span>{tripSettings.startDate.replace(/-/g, '.')}</span>
                      <ArrowRight size={12} className="shrink-0" />
                      <span>{tripSettings.endDate.replace(/-/g, '.')}</span>
                      <span className={`border-l ${theme.border} pl-2 ml-1 shrink-0`}>{tripSettings.days} 天</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2 shrink-0 relative items-center">
              {/* Cloud Sync Status Indicator */}
              {googleUser && (
                  <div className="hidden sm:flex items-center gap-1 mr-1">
                      {isAutoSaving || isSyncing ? (
                          <div className="flex items-center gap-1 text-[10px] text-[#A98467] font-bold"><Loader2 size={12} className="animate-spin"/> 儲存中</div>
                      ) : (
                          <div className="flex items-center gap-1 text-[10px] text-[#5F6F52] font-bold opacity-70"><Cloud size={12}/> 已同步</div>
                      )}
                  </div>
              )}

              <button onClick={() => { 
                const safeCurrency = currencySettings?.selectedCountry ? currencySettings : DEFAULT_CURRENCY_SETTINGS;
                setTempCurrency({...safeCurrency}); 
                setIsCurrencyModalOpen(true); 
              }} className={`p-2 rounded-full flex items-center gap-1.5 border border-transparent hover:${theme.border} ${theme.hover} ${theme.accent}`}><Coins size={18} /><span className="text-[10px] font-bold hidden sm:inline-block">{currencySettings?.selectedCountry?.currency || 'JPY'}</span></button>
              
              <button onClick={() => setIsCompanionModalOpen(true)} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Users size={20} /></button>
              <button onClick={openSettingsModal} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Settings size={20} /></button>
              
              <div className="relative">
                <button onClick={() => setIsFileMenuOpen(!isFileMenuOpen)} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><FileText size={20} /></button>
                {isFileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFileMenuOpen(false)}></div>
                    <div className={`absolute right-0 top-full mt-2 w-64 ${theme.card} rounded-xl shadow-xl border ${theme.border} p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-200`}>
                      
                      {/* Google Sheets Sync Section */}
                      <div className={`px-4 py-2 text-xs font-bold text-[#888] uppercase tracking-wider border-b ${theme.border} mb-1 flex justify-between items-center`}>
                          <span>雲端同步 (Google)</span>
                          {googleUser && <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 size={10}/> 已登入</span>}
                      </div>
                      
                      <button onClick={() => { handleSaveToGoogleSheet(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 text-[#3A3A3A]`} disabled={isSyncing}>
                        {isSyncing ? <Loader2 size={16} className="animate-spin text-[#3A3A3A]"/> : <RefreshCw size={16} className={theme.primary}/>} 
                        {isSyncing ? "同步中..." : "立即手動同步"}
                      </button>

                      <div className={`my-1 border-b ${theme.border}`}></div>

                      {/* Excel Section */}
                      <div className="px-4 py-2 text-xs font-bold text-[#888] uppercase tracking-wider">本機檔案 (Excel)</div>
                      <button onClick={() => { fileInputRef.current.click(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : 'text-[#3A3A3A]'}`} disabled={!isXlsxLoaded}>{isXlsxLoaded ? <Upload size={16} /> : <Loader2 size={16} className="animate-spin" />} 匯入 Excel</button>
                      <button onClick={() => { handleExportToExcel(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : 'text-[#3A3A3A]'}`} disabled={!isXlsxLoaded}>{isXlsxLoaded ? <Download size={16} /> : <Loader2 size={16} className="animate-spin" />} 匯出 Excel</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* ... Rest of headers (Day buttons, etc) ... */}
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
              <button onClick={() => { setStatsMode('real'); setStatsPersonFilter('all'); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${statsMode === 'real' ? `${theme.card} text-[#3A3A3A] shadow-sm` : theme.subText}`}>真實支付</button>
              <button onClick={() => { setStatsMode('personal'); setStatsPersonFilter('all'); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${statsMode === 'personal' ? `${theme.card} text-[#3A3A3A] shadow-sm` : theme.subText}`}>個人消費</button>
            </div>
          )}
          {viewMode === 'categoryManager' && (
             <div className="mt-6 flex bg-[#EBE9E4] p-1 rounded-xl">
               <button onClick={() => setCategoryManagerTab('itinerary')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${categoryManagerTab === 'itinerary' ? `${theme.card} text-[#3A3A3A] shadow-sm` : `${theme.subText} hover:${theme.primary}`}`}><Camera size={14} />行程圖示</button>
               <button onClick={() => setCategoryManagerTab('expenses')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${categoryManagerTab === 'expenses' ? `${theme.card} text-[#3A3A3A] shadow-sm` : `${theme.subText} hover:${theme.primary}`}`}><Coins size={14} />費用類別</button>
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:px-6">
        {viewMode === 'categoryManager' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-[#3A3A3A]">管理類別</h2>
                <button onClick={() => openCategoryEditModal()} className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg ${theme.primaryBg} text-white shadow hover:opacity-90 transition-all`}><Plus size={14}/> 新增類別</button>
             </div>
             <div className="space-y-2">
                {(categoryManagerTab === 'itinerary' ? itineraryCategories : expenseCategories).map((cat, index) => {
                  const CatIcon = getIconComponent(cat.icon);
                  return (
                    <div key={cat.id} className={`draggable-item ${theme.card} border ${theme.border} p-4 rounded-xl flex items-center justify-between shadow-sm`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-4">
                          <div className="text-[#CCC] cursor-grab active:cursor-grabbing"><GripVertical size={20} /></div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color || theme.hover} ${theme.primary} border border-[#F0F0F0]`}>
                             <CatIcon size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#3A3A3A]">{cat.label}</div>
                            <div className="text-[10px] text-[#999] font-mono">ID: {cat.id}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); openCategoryEditModal(cat); }} className={`p-2 text-[#888] hover:${theme.primary} ${theme.hover} rounded-lg transition-colors`}><Edit3 size={18} /></button>
                          <button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className={`p-2 text-[#888] hover:${theme.danger} hover:${theme.dangerBg} rounded-lg transition-colors`}><Trash2 size={18} /></button>
                        </div>
                    </div>
                  );
                })}
             </div>
          </div>
        ) : viewMode === 'statistics' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* ... Statistics Content (same as original, but using category stats) ... */}
            <div className="overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
              <div className="flex gap-3 min-w-max">
                <div onClick={() => setStatsPersonFilter('all')} className={`border rounded-xl p-3 shadow-sm min-w-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all ${statsPersonFilter === 'all' ? 'bg-[#3A3A3A] border-[#3A3A3A] text-white' : `${theme.card} ${theme.border} text-[#3A3A3A] ${theme.hover}`}`}>
                   <div className="text-xs font-bold mb-1">ALL</div>
                   <Users size={16} />
                </div>
                {companions.map((person, idx) => {
                  const stat = statisticsData.personStats[person];
                  const amount = statsMode === 'real' ? stat.paid : stat.share;
                  return (
                    <div key={person} onClick={() => setStatsPersonFilter(statsPersonFilter === person ? 'all' : person)} className={`border rounded-xl p-3 shadow-sm min-w-[8rem] flex flex-col items-center cursor-pointer transition-all ${statsPersonFilter === person ? `${theme.hover} ${theme.primaryBorder} ring-1 ring-[#5F6F52]` : `${theme.card} ${theme.border} ${theme.hover}`}`}>
                       <div className={`w-10 h-10 rounded-full ${getAvatarColor(idx)} flex items-center justify-center ${theme.primary} text-sm font-bold font-serif mb-2`}>{person.charAt(0)}</div>
                       <div className="text-xs font-bold text-[#3A3A3A] mb-1">{person}</div>
                       <div className={`text-sm font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.symbol} {formatMoney(amount)}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`${theme.card} rounded-2xl p-5 border ${theme.border} shadow-sm`}>
              <h3 className="text-sm font-bold text-[#888] mb-4 flex items-center gap-2"><ArrowLeftRight size={16}/> 結算建議</h3>
              <div className="space-y-3">
                {statisticsData.transactions.length > 0 ? (
                  statisticsData.transactions.map((tx, i) => (
                      <div key={i} className={`flex items-center justify-between text-sm border-b ${theme.border} pb-3 last:border-0`}>
                          <div className="flex items-center gap-2 flex-1">
                             <span className="font-bold text-[#3A3A3A]">{tx.from}</span>
                             <ArrowRight size={14} className="text-[#CCC]" />
                             <span className="font-bold text-[#3A3A3A]">{tx.to}</span>
                          </div>
                          <div className={`font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(tx.amount)}</div>
                      </div>
                  ))
                ) : ( <div className="text-center text-[#888] text-xs py-2">已結清</div> )}
              </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-sm font-bold text-[#888] pl-1">詳細清單</h3>
               {renderDetailedList()}
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {viewMode === 'itinerary' && <div className={`absolute left-[4.5rem] top-4 bottom-4 w-px ${theme.border} -z-10`}></div>}
            {getCurrentList().map((item, index) => {
              if (viewMode === 'expenses') {
                // ... Expense Item Rendering (Using Dynamic Categories) ...
                const categoryDef = expenseCategories.find(c => c.id === item.category) || { label: '未分類', icon: 'Coins' };
                const Icon = getIconComponent(categoryDef.icon);
                const twd = Math.round(item.cost * currencySettings.exchangeRate);
                let groupHeader = null;
                const prevItem = getCurrentList()[index - 1];
                if (index === 0 || (item.region || '未分類') !== (prevItem?.region || '未分類')) {
                   groupHeader = (<div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-3 px-1 mb-2 border-b ${theme.border} text-lg font-bold ${theme.primary} flex items-center gap-2 animate-in fade-in mt-6 first:mt-0`}><MapIcon size={18} /> {item.region || '未分類'}</div>);
                }
                const payerDisplay = item.details && item.details.length > 0 ? [...new Set(item.details.map(d => d.payer))].join(' | ') : item.payer;
                return (
                  <React.Fragment key={item.id}>
                    {groupHeader}
                    <div className={`draggable-item group ${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm flex gap-4 items-start relative hover:shadow-md transition-all`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                      <div className={`w-10 h-10 rounded-full ${theme.hover} flex items-center justify-center ${theme.primary} shrink-0 mt-1`}><Icon size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold text-[#3A3A3A] font-serif leading-tight truncate pr-2">{item.title}</h3><div className="flex gap-2 shrink-0"><button onClick={() => { setEditingItem(item); openEditModal(item); }} className={`text-[#999] hover:${theme.primary} p-1`}><Edit3 size={16}/></button><button onClick={() => handleDeleteItem(item.id)} className={`text-[#999] hover:${theme.danger} p-1`}><Trash2 size={16}/></button></div></div>
                        <div className="text-xs text-[#888] mb-2 flex items-center gap-2"><span>{item.date}</span><span>•</span><span className={`${theme.accent} font-bold`}>{payerDisplay} ● 支付</span></div>
                        <div className="flex justify-between items-end"><div className={`text-[10px] text-[#666] ${theme.bg} px-2 py-1.5 rounded flex flex-wrap items-center gap-x-2 gap-y-1`}><span className="font-bold">分攤:</span>{item.shares && item.shares.map((share, idx) => (<React.Fragment key={share}><div className="flex items-center gap-1"><PayerAvatar name={share} size="w-3 h-3" /><span>{share}</span></div>{idx < item.shares.length - 1 && <span className="text-[#CCC]">|</span>}</React.Fragment>))}</div><div className="text-right shrink-0 ml-2"><div className={`text-sm font-serif font-bold ${theme.accent}`}>{item.currency} {formatMoney(item.cost)}</div><div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twd)})</div></div></div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              } 
              if (viewMode === 'itinerary') {
                // ... Itinerary Item Rendering ...
                const categoryDef = itineraryCategories.find(c => c.id === item.type) || { label: '其他', icon: 'Camera', color: 'bg-[#F2F4F1]' };
                const Icon = getIconComponent(categoryDef.icon);
                const endTimeStr = minutesToTime(timeToMinutes(item.time) + item.duration);
                const twdAmount = Math.round(item.cost * currencySettings.exchangeRate);
                let gapComp = null;
                if (index < getCurrentList().length - 1) {
                  const nextItem = getCurrentList()[index + 1];
                  const diff = timeToMinutes(nextItem.time) - (timeToMinutes(item.time) + item.duration);
                  if (diff !== 0) { gapComp = (<div className="pl-[4.5rem] py-3 flex items-center select-none"><div className={`text-[10px] px-3 py-0.5 rounded-full border flex items-center gap-1.5 font-medium ${diff < 0 ? `${theme.danger} ${theme.dangerBg} border-[#FFD6D6]` : `${theme.subText} ${theme.hover} ${theme.border}`}`}><span className="opacity-50">▼</span> {diff < 0 ? '時間重疊' : `移動: ${formatDurationDisplay(diff)}`}</div></div>); }
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
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryDef.color || theme.hover} ${theme.primary} shrink-0`}>
                                <Icon size={20} strokeWidth={1.5} />
                              </div>
                              <span className="text-xs font-bold tracking-widest text-[#999999] uppercase border border-[#EBE9E4] px-1.5 py-0.5 rounded-sm">{categoryDef.label}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity"><button onClick={() => updateCurrentList([...getCurrentList(), {...item, id: Date.now(), title: `${item.title} (Copy)`}])} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Copy size={14} /></button><button onClick={() => { setEditingItem(item); setFormData({...item, costType: 'FOREIGN'}); setIsModalOpen(true); }} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Edit3 size={14} /></button><button onClick={() => handleDeleteItem(item.id)} className={`p-1.5 text-[#999999] hover:${theme.danger} hover:${theme.dangerBg} rounded`}><Trash2 size={14} /></button></div>
                          </div>
                          <div className="pl-2">
                            <div className="flex justify-between items-start gap-2 mb-2"><div className="flex-1"><h3 className="text-lg font-bold text-[#3A3A3A] font-serif leading-tight flex items-center gap-2">{item.title}{item.website && <a href={item.website} target="_blank" rel="noreferrer" className={`text-[#888] hover:${theme.accent}`} onClick={e => e.stopPropagation()}><Globe size={14} /></a>}</h3></div>{item.cost > 0 && (<div className="text-right shrink-0"><div className={`text-sm font-serif font-bold ${theme.accent}`}>{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div><div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twdAmount)})</div></div>)}</div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#666666]">{item.location && (<div className={`flex items-center gap-1 group/location -ml-1.5 px-1.5 py-0.5 rounded ${theme.hover} transition-colors`}><MapPin size={12} className={theme.accent} /><span>{item.location}</span><div className="flex gap-2 ml-1 opacity-0 group-hover/location:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.location, item.id); }} className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder}`}>{copiedId === item.id ? <Check size={14} className={theme.primary} /> : <Copy size={14} />}</button><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} target="_blank" rel="noreferrer" className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder}`} onClick={(e) => e.stopPropagation()}><Navigation size={14} /></a></div></div>)}<div className="flex items-center gap-1 px-1.5 py-0.5"><Clock size={12} className={theme.accent} /> 停留: {formatDurationDisplay(item.duration)}</div></div>
                            {item.notes && <div className={`mt-3 pt-3 border-t ${theme.border} flex gap-2 items-start`}><PenTool size={10} className="mt-0.5 text-[#AAA] shrink-0" /><p className="text-xs text-[#777] leading-relaxed font-serif italic whitespace-pre-wrap">{item.notes}</p></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {gapComp}
                  </React.Fragment>
                );
              }
              // ... Checklist Items ...
              return (
                <div key={item.id} className="draggable-item group relative" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd}>
                  <div onClick={() => toggleComplete(item.id)} className={`${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm transition-all flex gap-4 items-start cursor-pointer ${item.completed ? 'opacity-50 grayscale' : ''}`}>
                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${item.completed ? `${theme.primaryBg} ${theme.primaryBorder} text-white` : `bg-white ${theme.border} text-transparent hover:${theme.primaryBorder}`}`}><Check size={12} strokeWidth={3} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                          <h3 className={`text-base font-bold font-serif hover:${theme.primary} transition-colors ${item.completed ? 'text-[#AAA] line-through' : 'text-[#3A3A3A]'}`} onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>{item.title}</h3>
                          {item.cost > 0 && (checklistTab !== 'packing') && !item.completed && (<div className="text-right"><div className={`text-sm font-bold ${theme.accent}`}>{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div></div>)}
                      </div>
                      {(checklistTab !== 'packing') && (<div className="mt-2 space-y-1">{item.location && (<div className="flex items-center gap-1 -ml-1 text-xs text-[#666]"><MapPin size={12} className={theme.accent} /><span>{item.location}</span></div>)}{item.notes && <div className={`text-[10px] text-[#888] ${theme.hover} p-1.5 rounded inline-block`}>{item.notes}</div>}</div>)}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className={`text-[#999] hover:${theme.danger} opacity-0 group-hover:opacity-100 p-1`}><Trash2 size={20} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {viewMode !== 'statistics' && viewMode !== 'categoryManager' && (
        <button
          onClick={() => setViewMode('categoryManager')}
          className={`fixed bottom-24 right-6 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-lg shadow-[#3A3A3A]/30 hover:scale-105 ${theme.primaryBg} transition-all flex items-center justify-center z-50 animate-in zoom-in duration-300 group`}
          title="管理類別"
        >
          <LayoutList size={26} strokeWidth={1.5} />
        </button>
      )}

      <BottomNav />

      {/* ... (Modals remain unchanged but omitted for brevity as they are just UI) ... */}
      {/* Include modals here from previous implementation: Confirmation, CategoryEdit, ItemEdit, Settings, Currency, Companion */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
          <div className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border ${theme.border} animate-in zoom-in-95`}>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2 font-serif">確認</h3>
            <p className="text-sm text-[#666] mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className={`flex-1 py-2 text-xs font-bold text-[#888] hover:bg-[#F0F0F0] rounded-lg`}>取消</button>
              <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className={`flex-1 py-2 text-xs font-bold text-white ${theme.primaryBg} rounded-lg`}>確定</button>
            </div>
          </div>
        </div>
      )}
      {/* ... other modals ... */}
      {isCategoryEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border} animate-in zoom-in-95`}>
             <div className="p-6 border-b border-[#F0F0F0]">
               <h2 className="text-lg font-bold font-serif text-[#3A3A3A]">{categoryFormData.isNew ? '新增類別' : '編輯類別'}</h2>
             </div>
             <div className="p-6 space-y-4 overflow-y-auto">
               <div>
                  <label className="block text-xs font-bold text-[#888] mb-1">類別 ID (唯一)</label>
                  <input type="text" disabled={!categoryFormData.isNew} value={categoryFormData.id} onChange={e => setCategoryFormData({...categoryFormData, id: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none ${!categoryFormData.isNew ? 'opacity-50 cursor-not-allowed' : ''}`} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-[#888] mb-1">類別名稱</label>
                  <input type="text" value={categoryFormData.label} onChange={e => setCategoryFormData({...categoryFormData, label: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder}`} />
               </div>
               {categoryManagerTab === 'itinerary' && (
                 <div>
                   <label className="block text-xs font-bold text-[#888] mb-2">標籤顏色</label>
                   <div className="grid grid-cols-8 gap-2">
                      {CATEGORY_COLORS.map(color => (
                        <button key={color} onClick={() => setCategoryFormData({...categoryFormData, color})} className={`w-8 h-8 rounded-full ${color} border ${categoryFormData.color === color ? 'border-2 border-[#5F6F52] scale-110' : 'border-[#E0E0E0]'}`}></button>
                      ))}
                   </div>
                 </div>
               )}
               <div>
                  <label className="block text-xs font-bold text-[#888] mb-2">圖示</label>
                  <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-1 border rounded-lg bg-[#FAFAFA]">
                     {Object.keys(ICON_REGISTRY).map(iconName => {
                       const IconComp = ICON_REGISTRY[iconName];
                       return (
                         <button key={iconName} onClick={() => setCategoryFormData({...categoryFormData, icon: iconName})} className={`aspect-square flex items-center justify-center rounded hover:bg-[#EEE] ${categoryFormData.icon === iconName ? `${theme.primaryBg} text-white` : 'text-[#666]'}`}>
                            <IconComp size={20} />
                         </button>
                       );
                     })}
                  </div>
               </div>
             </div>
             <div className="p-4 border-t border-[#F0F0F0] flex gap-2">
                <button onClick={() => setIsCategoryEditModalOpen(false)} className="flex-1 py-2 text-xs font-bold text-[#888] hover:bg-[#F0F0F0] rounded-lg">取消</button>
                <button onClick={handleCategorySave} className={`flex-1 py-2 text-xs font-bold text-white ${theme.primaryBg} rounded-lg`}>儲存</button>
             </div>
          </div>
        </div>
      )}
      {/* Item Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border ${theme.border}`}>
            <div className={`px-6 py-4 bg-[#F7F5F0] border-b ${theme.border} flex justify-between items-center shrink-0`}>
              <h2 className="text-base font-bold text-[#3A3A3A] font-serif tracking-wide">{editingItem ? '編輯' : '新增'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-[#999]" /></button>
            </div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="item-form" onSubmit={handleSubmitItem} className="space-y-4">
                {viewMode === 'itinerary' && (
                  <>
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      {itineraryCategories.map((cat) => {
                        const CatIcon = getIconComponent(cat.icon);
                        return (
                          <button key={cat.id} type="button" onClick={() => setFormData({...formData, type: cat.id})} className={`py-2 px-0.5 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${formData.type === cat.id ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}><CatIcon size={16} /><span className="text-[10px] scale-90 truncate w-full text-center">{cat.label}</span></button>
                        )
                      })}
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-[130px]"><label className="block text-xs font-bold text-[#888] mb-1">開始時間</label><input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder} h-10`} /></div>
                      <div className="flex flex-1 gap-2 items-end">
                        <div className="w-[130px]"><label className="block text-xs font-bold text-[#888] mb-1">停留 (分)</label><input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="numeric" value={formData.duration === 0 ? '' : formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder} h-10`} /></div>
                        <div className="flex flex-col gap-1 pb-0.5"><div className="flex gap-1"><button type="button" onClick={() => setFormData({...formData, duration: 30})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>30分</button><button type="button" onClick={() => setFormData({...formData, duration: 60})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>60分</button></div><div className="flex gap-1"><button type="button" onClick={() => setFormData({...formData, duration: 90})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>90分</button><button type="button" onClick={() => setFormData({...formData, duration: 120})} className={`text-[10px] ${theme.hover} px-2 py-0.5 rounded text-[#888] hover:${theme.border} whitespace-nowrap min-w-[3rem] text-center h-[18px] flex items-center justify-center`}>120分</button></div></div>
                      </div>
                    </div>
                  </>
                )}

                {viewMode === 'expenses' ? (
                  <>
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-[#888] mb-1">類別</label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {expenseCategories.map((cat) => {
                                const CatIcon = getIconComponent(cat.icon);
                                return (
                                  <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${formData.category === cat.id ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}>
                                    <CatIcon size={16} />
                                    <span>{cat.label}</span>
                                  </button>
                                );
                            })}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-bold text-[#888] mb-1">日期</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder}`} />
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1/3"><input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div>
                        <div className="flex-1"><input type="text" placeholder="項目名稱" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div>
                      </div>
                      {/* ... (Cost input and Split logic same as original) ... */}
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用 (總額)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-[2.2]">
                            <select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-base appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div>
                          </div>
                          <input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formData.cost === 0 ? '' : formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} />
                        </div>
                      </div>
                      <div className={`bg-[#F2F0EB] p-3 rounded-lg border ${theme.border}`}>
                        <div className="flex justify-between items-center mb-2"><label className={`text-xs font-bold ${theme.primary}`}>分攤方式</label></div>
                        <div className="space-y-2 mb-3">
                            {formData.details && formData.details.map((detail, idx) => (
                                <div key={detail.id} className={`flex flex-wrap items-center gap-2 bg-white p-2 rounded border ${theme.border} shadow-sm text-xs`}>
                                    <div className="relative min-w-[4.5rem]"><select value={detail.payer} onChange={(e) => updateSplitDetail(detail.id, 'payer', e.target.value)} className="w-full pl-6 pr-4 py-1 appearance-none bg-transparent font-bold text-[#3A3A3A] focus:outline-none cursor-pointer text-base">{companions.map(c => <option key={c} value={c}>{c}</option>)}</select><div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${theme.border} flex items-center justify-center text-[8px] font-serif pointer-events-none`}>{detail.payer.charAt(0).toUpperCase()}</div></div>
                                    <ArrowRight size={10} className="text-[#CCC]" />
                                    <div className="relative min-w-[5rem]"><select value={detail.target} onChange={(e) => updateSplitDetail(detail.id, 'target', e.target.value)} className={`w-full pl-6 pr-4 py-1 appearance-none bg-transparent font-bold ${theme.primary} focus:outline-none cursor-pointer text-base`}>{companions.map(c => <option key={c} value={c}>{c}</option>)}<option value="ALL">均攤</option></select><div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${theme.border} flex items-center justify-center text-[8px] font-serif pointer-events-none`}>{detail.target === 'ALL' ? <Users size={10} /> : detail.target.charAt(0).toUpperCase()}</div></div>
                                    <div className="flex-1 flex items-center justify-end gap-1"><span className="text-[10px] text-[#888]">{currencySettings.selectedCountry.currency}</span><input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" value={detail.amount === 0 ? '' : detail.amount} onChange={(e) => updateSplitDetail(detail.id, 'amount', parseInt(e.target.value) || 0)} className={`w-16 text-right border-b ${theme.border} focus:${theme.primaryBorder} focus:outline-none bg-transparent font-bold text-base`}/></div>
                                    {formData.details.length > 1 && (<button type="button" onClick={() => removeSplitDetail(detail.id)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1 rounded`}><X size={12} /></button>)}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSplitDetail} className={`w-full py-2 border border-dashed border-[#A98467] text-[#A98467] rounded hover:bg-[#FDFCFB] text-xs font-bold flex items-center justify-center gap-1 transition-colors`} style={{ borderColor: theme.accentHex, color: theme.accentHex }}><Plus size={12} /> 新增分帳</button>
                      </div>
                  </>
                ) : (
                  <>
                    {(checklistTab === 'food' || checklistTab === 'shopping') ? (
                      <div className="flex gap-3"><div className="w-1/3"><input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div><div className="flex-1"><input type="text" placeholder="店名 / 商品" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div></div>
                    ) : (
                      <input type="text" placeholder={checklistTab === 'packing' && viewMode === 'checklist' ? "物品名稱" : "標題"} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                    )}
                    {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用</label>
                        <div className="flex gap-2">
                          <div className="relative flex-[2.2]"><select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-base appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select><div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div></div>
                          <input type="number" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formData.cost === 0 ? '' : formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} />
                        </div>
                      </div>
                    )}
                    {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#888]"><MapPin size={16} /><input type="text" placeholder="地點/地址" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`flex-1 bg-transparent border-b ${theme.border} py-1 text-base focus:outline-none focus:${theme.primaryBorder}`} /></div>
                        <div className="flex items-center gap-2 text-[#888]"><Globe size={16} /><input type="url" placeholder="網站連結" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className={`flex-1 bg-transparent border-b ${theme.border} py-1 text-base focus:outline-none focus:${theme.primaryBorder} placeholder:text-xs`} /></div>
                      </div>
                    )}
                  </>
                )}
                {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-1">備註</label>
                    <textarea rows={2} placeholder="備註..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-3 text-base text-[#666] resize-none focus:outline-none focus:${theme.primaryBorder}`} />
                  </div>
                )}
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] shrink-0`}>
              <button type="submit" form="item-form" className={`w-full bg-[#3A3A3A] text-[#F9F8F6] py-3 rounded-lg font-bold text-sm hover:${theme.primaryBg} transition-colors`}>{editingItem ? '儲存' : '新增'}</button>
            </div>
          </div>
        </div>
      )}
      {/* ... Settings, Currency, Companion modals ... same as before ... */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border} animate-in zoom-in-95`}>
            <div className="p-6 shrink-0 text-center mb-0"><h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅程設定</h2></div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="settings-form" onSubmit={handleSettingsSubmit} className="space-y-5">
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">旅程標題</label><input type="text" value={tempSettings.title || ''} onChange={e => setTempSettings({...tempSettings, title: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">出發日</label><input type="date" value={tempSettings.startDate || ''} onChange={handleStartDateChange} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div>
                  <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">回程日</label><input type="date" value={tempSettings.endDate || ''} min={tempSettings.startDate || ''} onChange={(e) => setTempSettings({...tempSettings, endDate: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#888] mb-2 uppercase flex items-center gap-1"><Palette size={12}/> 顏色主題</label>
                  <div className="flex gap-2 justify-between">{Object.values(THEMES).map((t) => (<button key={t.id} type="button" onClick={() => onChangeTheme(t.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${t.bg} border ${t.id === theme.id ? `border-2 ${t.primaryBorder} scale-110 shadow-md` : 'border-gray-200'}`} title={t.label}><div className={`w-4 h-4 rounded-full ${t.primaryBg}`}></div></button>))}</div>
                </div>
                <div className={`text-center bg-[#F2F0EB] py-2 rounded-lg border border-dashed ${theme.border}`}><span className="text-xs text-[#888] font-bold">總天數: </span><span className={`text-sm font-serif font-bold ${theme.primary}`}>{calculateDaysDiff(tempSettings.startDate, tempSettings.endDate)} 天</span></div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] flex gap-3 shrink-0`}><button type="button" onClick={() => setIsSettingsOpen(false)} className={`flex-1 py-2.5 text-xs font-bold text-[#888] hover:${theme.hover} rounded-lg`}>取消</button><button type="submit" form="settings-form" className={`flex-1 ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>完成</button></div>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0"><div className={`w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-3 ${theme.accent}`}><Calculator size={24} /></div><h2 className="text-xl font-serif font-bold text-[#3A3A3A]">通貨設定</h2></div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="currency-form" onSubmit={handleCurrencySubmit} className="space-y-5">
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">旅遊國家</label><div className="relative"><select value={tempCurrency?.selectedCountry?.code || ''} onChange={(e) => { const country = COUNTRY_OPTIONS.find(c => c.code === e.target.value); setTempCurrency({ ...tempCurrency, selectedCountry: country, exchangeRate: country.defaultRate }); }} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-3 text-[#3A3A3A] text-base appearance-none focus:outline-none focus:${theme.primaryBorder}`}>{COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} {c.currency}</option>)}</select><div className="absolute right-3 top-3.5 pointer-events-none text-[#888]">▼</div></div></div>
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">匯率</label><div className="flex items-center gap-3 justify-center"><span className={`text-sm font-bold ${theme.primary} whitespace-nowrap`}>1 {tempCurrency?.selectedCountry?.currency || '???'} =</span><input type="number" step="0.0001" min="0" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" value={tempCurrency?.exchangeRate || 0} onChange={e => setTempCurrency({...tempCurrency, exchangeRate: parseFloat(e.target.value)})} className={`w-28 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] font-bold text-center focus:outline-none focus:${theme.primaryBorder} text-base`} /><span className={`text-sm font-bold ${theme.primary}`}>TWD</span></div></div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] flex gap-3 shrink-0`}><button type="button" onClick={() => setIsCurrencyModalOpen(false)} className={`flex-1 py-2.5 text-xs font-bold text-[#888] hover:${theme.hover} rounded-lg`}>取消</button><button type="submit" form="currency-form" className={`flex-1 ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>確認設定</button></div>
          </div>
        </div>
      )}

      {/* Companion Modal */}
      {isCompanionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0"><div className={`w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-3 ${theme.accent}`}><Users size={24} /></div><h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅伴管理</h2></div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="companion-form" onSubmit={handleAddCompanion} className="space-y-5">
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">新增成員</label><div className="flex gap-2"><input type="text" placeholder="名字..." value={newCompanionName} onChange={(e) => setNewCompanionName(e.target.value)} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /><button type="submit" className="bg-[#3A3A3A] text-white px-4 rounded-lg hover:opacity-90"><Plus size={20} /></button></div></div>
                <div>
                  <div className="flex justify-between items-end mb-1.5"><label className="block text-xs font-bold text-[#888] uppercase">目前成員</label>{companions.length > 0 && <button type="button" onClick={handleClearAllCompanions} className={`text-[10px] text-[#C55A5A] hover:${theme.dangerBg} px-2 py-1 rounded flex items-center gap-1`}><Trash2 size={12} />全て削除</button>}</div>
                  <div className={`bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto`}>
                    {companions.length === 0 ? <div className="text-center py-4 text-[#AAA] text-xs">無</div> : companions.map((c, i) => (
                      <div key={`${c}-${i}`} className={`flex items-center justify-between p-2 bg-white rounded shadow-sm border ${theme.border}`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0"><div className={`w-8 h-8 rounded-full ${getAvatarColor(i)} flex items-center justify-center ${theme.primary} shrink-0 border-2 border-white shadow-sm font-serif font-bold text-sm`}>{c.charAt(0).toUpperCase()}</div>{editingCompanionIndex === i ? <input type="text" value={editingCompanionName} onChange={(e) => setEditingCompanionName(e.target.value)} className={`flex-1 border-b ${theme.primaryBorder} outline-none text-base text-[#3A3A3A] py-0.5 font-serif`} autoFocus onBlur={() => saveEditCompanion(i)} onKeyDown={(e) => {if(e.key==='Enter'){e.preventDefault();saveEditCompanion(i)}}} /> : <span className={`text-sm font-bold text-[#3A3A3A] truncate cursor-pointer hover:${theme.primary} font-serif`} onClick={() => startEditCompanion(i, c)}>{c}</span>}</div>
                        <div className="flex gap-1 ml-2">{editingCompanionIndex === i ? <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => saveEditCompanion(i)} className={`${theme.primary} hover:${theme.hover} p-1.5 rounded`}><Check size={14} /></button> : <button type="button" onClick={() => handleRemoveCompanion(i)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1.5 rounded`}><Minus size={14} /></button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] shrink-0`}><button type="button" onClick={() => setIsCompanionModalOpen(false)} className={`w-full ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>完成</button></div>
          </div>
        </div>
      )}

    </div>
  );
};

// ... (TravelHome and App components remain mostly the same, but the App component's file is included for completeness in a single file workflow if requested, but above is focused on TripPlannerApp.jsx contents)

// Since I must output a single file, I will append the rest of the App component logic here to complete the file as requested.

const TravelHome = ({ projects, allProjectsData, onAddProject, onDeleteProject, onOpenProject, googleUser, handleGoogleLogin, handleGoogleLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickingId, setClickingId] = useState(null);
  
  // Requirement 1: Force Home Page to use 'Mori' theme always
  const theme = THEMES.mori;

  const handleProjectClick = (project) => {
    setClickingId(project.id);
    // Short timeout to show the "saturated" state before switching
    setTimeout(() => {
      onOpenProject(project);
      setClickingId(null);
    }, 150);
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-serif ${theme.selection} flex flex-col`}>
      <nav className={`w-full px-4 md:px-8 py-6 flex justify-between items-center border-b ${theme.border}/50`}>
        <div className="flex items-center gap-2"><div className={`w-4 h-4 ${theme.primaryBg} rounded-full opacity-80`}></div><span className={`text-xl tracking-widest font-bold ${theme.primary}`}> 𝐓𝐑𝐀𝐕𝐄𝐋 </span></div>
        <div>
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
              const projectThemeId = allProjectsData[project.id]?.themeId || 'mori';
              const pTheme = THEMES[projectThemeId];
              const isClicking = clickingId === project.id;
              
              return (
                <div 
                  key={project.id} 
                  onClick={() => handleProjectClick(project)} 
                  className={`group relative py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex justify-between items-center overflow-hidden border
                    ${isClicking ? `${pTheme.primaryBg} border-transparent scale-[0.98]` : `bg-[#FFFFFF] ${theme.border} hover:bg-[#F2F0EB]`}
                  `}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${pTheme.primaryBg.replace('bg-', 'bg-opacity-80 bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="flex flex-col items-start gap-1 pl-2">
                    <span className={`tracking-[0.2em] font-light transition-colors text-left
                       ${isClicking ? 'text-white' : `text-[#464646] group-hover:${pTheme.primary}`}
                    `}>
                      {project.name}
                    </span>
                    <span className={`text-xs font-sans tracking-widest ${isClicking ? 'text-white/80' : 'text-[#888888]'}`}>
                      {formatLastModified(project.lastModified)}
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

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeProject, setActiveProject] = useState(null);
  const [currentThemeId, setCurrentThemeId] = useState('mori');
  
  // --- LocalStorage Logic ---
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('tripPlanner_projects');
    return savedProjects ? JSON.parse(savedProjects) : [{ id: 1, name: '東京 5 日遊', lastModified: new Date().toISOString() }];
  });

  const [allProjectsData, setAllProjectsData] = useState(() => {
    const savedData = localStorage.getItem('tripPlanner_allData');
    return savedData ? JSON.parse(savedData) : { 1: generateNewProjectData('東京 5 日遊') };
  });

  useEffect(() => {
    localStorage.setItem('tripPlanner_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tripPlanner_allData', JSON.stringify(allProjectsData));
  }, [allProjectsData]);

  // --- Google API Logic ---
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    // Check for stored token on load
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
        setGoogleUser({ accessToken: storedToken });
    }

    const loadGapi = () => {
        const script = document.createElement('script');
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
            window.gapi.load('client', () => {
                window.gapi.client.init({}).then(() => {
                   // Load Sheets AND Drive API
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

  // --- Ensure gapi.client uses the stored token ---
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
                        // Persist token
                        localStorage.setItem('google_access_token', tokenResponse.access_token);
                    }
                },
            });
            setTokenClient(client);
        } catch (e) {
            console.error("Error initializing Google Token Client", e);
        }
    }
  }, [gisInited]);

  const handleGoogleLogin = () => {
      if (tokenClient) {
          // Trigger silent prompt or popup if needed (Implicit grant)
          tokenClient.requestAccessToken();
      } else {
          alert("Google 服務尚未載入完成，請稍候再試。");
      }
  };

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

  const theme = THEMES[currentThemeId]; 

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

    // Cloud Deletion Logic
    if (googleUser && gapiInited) {
        // Try to find file ID from allProjectsData directly
        const projectToDeleteData = allProjectsData[id];
        
        if (projectToDeleteData && projectToDeleteData.googleDriveFileId) {
             // If we have a stored ID, delete directly
             try {
                 await window.gapi.client.drive.files.delete({ fileId: projectToDeleteData.googleDriveFileId });
                 console.log(`Cloud file deleted via ID: ${projectToDeleteData.googleDriveFileId}`);
             } catch (err) {
                 console.warn("Failed to delete cloud file via ID (might be already deleted or no permission):", err);
             }
        } else {
             // Fallback: Search by name if no ID (for legacy projects)
             const projectToDelete = projects.find(p => p.id === id);
             if (projectToDelete) {
                const title = `TravelApp_${projectToDelete.name}`;
                try {
                    const q = `name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
                    const searchRes = await window.gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
                    if (searchRes.result.files && searchRes.result.files.length > 0) {
                        const fileId = searchRes.result.files[0].id;
                        await window.gapi.client.drive.files.delete({ fileId });
                        console.log(`Cloud file deleted via Name: ${title}`);
                    }
                } catch (err) {
                    console.error("Failed to delete cloud file via search:", err);
                }
             }
        }
    }

    setProjects(projects.filter(project => project.id !== id));
    setAllProjectsData(prev => { const newData = { ...prev }; delete newData[id]; return newData; });
  };
  
  const handleSaveProjectData = (projectId, newData) => {
    setAllProjectsData(prev => ({ ...prev, [projectId]: { ...prev[projectId], ...newData } }));
    
    setProjects(prevProjects => prevProjects.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            name: (newData.tripSettings && newData.tripSettings.title) ? newData.tripSettings.title : p.name, 
            lastModified: new Date().toISOString() 
          } 
        : p
    ));
    
    if (newData.tripSettings && newData.tripSettings.title && activeProject && activeProject.id === projectId) { 
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