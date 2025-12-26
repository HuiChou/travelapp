import { AVATAR_COLORS, DEFAULT_ITINERARY_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, COUNTRY_OPTIONS } from './constants';

export const getAvatarColor = (index) => {
  if (index < 0 || index === undefined) return 'bg-[#E0E0E0]';
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

export const formatInputNumber = (val) => {
  if (val === '' || val === undefined || val === null) return '';
  const num = parseFloat(val.toString().replace(/,/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;
  if (hours >= 24) hours = hours % 24;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatDurationDisplay = (minutes) => {
  if (minutes < 0) return "時間重疊";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}小時 ${m}分`;
  if (h > 0) return `${h}小時`;
  return `${m}分`;
};

export const formatMoney = (amount) => amount ? Math.round(amount).toLocaleString() : '0';

export const getNextDay = (dateStr) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

export const calculateDaysDiff = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays >= 1 ? diffDays + 1 : 1; 
};

export const formatDate = (dateString, addDays) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { text: 'N/A', day: '', full: '' };
  date.setDate(date.getDate() + addDays);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()];
  return { text: `${month}/${day}`, day: weekDay, full: date.toISOString().split('T')[0] };
};

export const sortItemsByTime = (items) => [...items].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

export const solveDebts = (balances) => {
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

export const formatLastModified = (isoString) => {
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

// --- Generators ---
export const getDefaultItinerary = () => ({
  0: [
    { id: 101, type: 'flight', title: '抵達東京', time: '10:00', duration: 60, location: '成田機場', cost: 0, website: '', notes: '領取 Wifi' },
    { id: 102, type: 'transport', title: '搭乘 NEX 前往新宿', time: '11:30', duration: 60, location: 'JR成田機場站', cost: 3070, website: 'https://www.jreast.co.jp/', notes: '需要指定席券' },
  ],
  1: [
    { id: 201, type: 'sightseeing', title: '明治神宮', time: '09:00', duration: 120, location: '原宿', cost: 0, website: '', notes: '感受早晨的空氣' },
  ]
});

export const getDefaultPackingList = () => [
  { id: 1, title: '護照 (Passport)', completed: false },
  { id: 2, title: 'Wifi 分享器', completed: false },
];

export const getDefaultShoppingList = () => [
  { id: 1, region: '東京車站', title: '東京香蕉', location: '東京車站一番街', cost: 1200, completed: false, notes: '伴手禮用' },
  { id: 2, region: '新宿', title: '藥妝 (EVE)', location: '松本清', cost: 5000, completed: false, notes: '免稅櫃台在2F' },
];

export const getDefaultFoodList = () => [
  { id: 1, region: '涉谷', title: '挽肉與米', location: '涉谷道玄坂', cost: 2000, notes: '早上9點開始發整理券', completed: false },
  { id: 2, region: '新宿', title: 'Harbs', location: 'Lumine Est 新宿', cost: 1500, notes: '水果千層必吃', completed: false },
];

export const getDefaultSightseeingList = () => [
  { id: 1, region: '淺草', title: '雷門淺草寺', location: '淺草', cost: 0, completed: false, notes: '求籤、買御守' },
  { id: 2, region: '澀谷', title: 'SHIBUYA SKY', location: 'Scramble Square', cost: 2200, completed: false, notes: '需提前一個月預約夕陽場' },
];

export const generateNewProjectData = (title) => {
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
      notes: '先代墊全額',
      costType: 'FOREIGN'
    }
  ];

  return {
    themeId: 'mori',
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
    sightseeingList: getDefaultSightseeingList(),
    expenses: defaultExpenses,
    googleDriveFileId: null
  };
};