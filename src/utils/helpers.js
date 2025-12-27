import { AVATAR_COLORS, DEFAULT_ITINERARY_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, COUNTRY_OPTIONS, ICON_REGISTRY } from './constants';

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

// --- Cloud Data Parser (New Optimization) ---
export const parseProjectDataFromGAPI = (fileId, fileName, valueRanges) => {
  const getSheetData = (rangeName) => {
      const range = valueRanges.find(r => r.range.includes(rangeName));
      return range ? range.values : [];
  };

  // --- Parse Overview ---
  const overviewData = getSheetData("專案概覽") || [];
  const ovMap = {};
  overviewData.forEach(row => { if(row[0]) ovMap[row[0]] = row[1]; });
  
  // Logic: Use internal title, fallback to filename if empty
  const title = ovMap["專案標題"] || fileName.replace('TravelApp_', '').replace('.xlsx', '');
  const startDate = ovMap["出發日期"] || new Date().toISOString().split('T')[0];
  const endDate = ovMap["回國日期"] || getNextDay(startDate);
  const days = calculateDaysDiff(startDate, endDate);
  
  const companionsStr = ovMap["旅行人員"] || "Me";
  const newCompanions = companionsStr.split(",").map(s => s.trim()).filter(s => s);
  
  // Find Currency
  const countryName = ovMap["旅行國家"];
  const currencyCode = ovMap["貨幣代碼"];
  const exchangeRate = parseFloat(ovMap["匯率 (1外幣 = TWD)"]) || 1;
  const selectedCountry = COUNTRY_OPTIONS.find(c => c.name === countryName || c.currency === currencyCode) || COUNTRY_OPTIONS[0];

  // --- Parse Categories ---
  const catData = getSheetData("管理類別") || [];
  const newItinCats = [];
  const newExpCats = [];
  
  if (catData.length > 1) {
      for(let i=1; i<catData.length; i++) {
          const row = catData[i];
          if (!row || row.length === 0) continue;
          const item = {
              id: row[1] ? String(row[1]) : `cat_${Date.now()}_${Math.random()}`,
              label: row[2] || "未命名",
              icon: ICON_REGISTRY[row[3]] ? row[3] : 'Star',
              color: row[4] || ''
          };
          if (row[0] === "行程") {
              if (!item.color) item.color = 'bg-[#F2F4F1]';
              newItinCats.push(item);
          } else if (row[0] === "費用") {
              newExpCats.push(item);
          }
      }
  }
  
  let currentItinCats = newItinCats.length > 0 ? newItinCats : DEFAULT_ITINERARY_CATEGORIES;
  let currentExpCats = newExpCats.length > 0 ? newExpCats : DEFAULT_EXPENSE_CATEGORIES;

  const itinLabelToId = {};
  currentItinCats.forEach(c => itinLabelToId[c.label] = c.id);
  const expLabelToId = {};
  currentExpCats.forEach(c => expLabelToId[c.label] = c.id);

  // --- Parse Itinerary ---
  const itinData = getSheetData("行程表") || [];
  const newItineraries = {};
  if (itinData.length > 1) {
      for (let i=1; i<itinData.length; i++) {
          const row = itinData[i];
          if (!row[0]) continue;
          const dayStr = row[0] || "Day 1";
          const dayIndex = parseInt(dayStr.replace("Day ", "")) - 1;
          if (dayIndex < 0 || isNaN(dayIndex)) continue;
          
          if (!newItineraries[dayIndex]) newItineraries[dayIndex] = [];
          
          const typeLabel = row[3];
          const typeId = itinLabelToId[typeLabel] || currentItinCats[0].id;

          newItineraries[dayIndex].push({
              id: Date.now() + Math.random() + i,
              type: typeId,
              title: row[4] || "未命名",
              time: row[1] || "09:00",
              duration: parseInt(row[2]) || 60,
              location: row[5] || "",
              cost: parseFloat(row[6]) || 0,
              notes: row[7] || ""
          });
      }
  }

  // --- Parse Expenses ---
  const expenseData = getSheetData("費用") || [];
  const newExpenses = [];
  if (expenseData.length > 1) {
       for (let i=1; i<expenseData.length; i++) {
          const row = expenseData[i];
          if (!row[0]) continue; 

          const catLabel = row[2];
          const catId = expLabelToId[catLabel] || currentExpCats[0].id;
          const payer = row[5] || "Me";
          const cost = parseFloat(row[6] && typeof row[6] === 'string' ? row[6].replace(/,/g,'') : row[6]) || 0;
          
          const splitStr = row[7] || "";
          let shares = [payer];
          let details = [];

          if (splitStr.includes("分攤:")) {
              const sharesPart = splitStr.replace("分攤:", "").trim();
              shares = sharesPart.split(",").map(s => s.trim());
              const shareAmount = Math.round(cost / shares.length);
              details = shares.map((s, idx) => ({ id: Date.now() + idx + Math.random(), payer: payer, target: s, amount: shareAmount }));
          } else {
               shares = [payer]; 
               const parts = splitStr.split(",").map(s => s.trim());
               if (parts.length > 0 && parts[0].includes(":")) {
                   shares = [];
                   details = parts.map((p, idx) => {
                       const [name, amt] = p.split(":").map(x => x.trim());
                       const targetName = name === '全員' ? 'ALL' : name;
                       if (!shares.includes(targetName)) shares.push(targetName);
                       return { id: Date.now() + idx + Math.random(), payer: payer, target: targetName, amount: parseFloat(amt) || 0 }
                   });
               }
          }

          newExpenses.push({
              id: Date.now() + Math.random() + i,
              date: row[0],
              region: row[1] || "",
              category: catId,
              title: row[3] || "未命名",
              location: row[4] || "",
              payer: payer,
              cost: cost,
              currency: currencyCode,
              shares: shares,
              details: details
          });
       }
  }

  // --- Parse Checklists ---
  const parseSimpleList = (sheetName, mapFn) => {
      const data = getSheetData(sheetName) || [];
      if (data.length <= 1) return [];
      return data.slice(1).map(mapFn).filter(item => item !== null);
  };

  const newPacking = parseSimpleList("行李", (row, i) => 
      row[0] ? { id: Date.now() + i, title: row[0], completed: row[1] === "已完成" } : null
  );
  
  const newShopping = parseSimpleList("購物", (row, i) => 
       row[1] ? { id: Date.now() + i, region: row[0]||"", title: row[1], location: row[2]||"", cost: parseFloat(row[3])||0, completed: row[4]==="已購買", notes: row[5]||"" } : null
  );

  const newFood = parseSimpleList("美食", (row, i) => 
       row[1] ? { id: Date.now() + i, region: row[0]||"", title: row[1], location: row[2]||"", cost: parseFloat(row[3])||0, completed: row[4]==="已吃", notes: row[5]||"" } : null
  );

  const newSightseeing = parseSimpleList("景點", (row, i) => 
       row[1] ? { id: Date.now() + i, region: row[0]||"", title: row[1], location: row[2]||"", cost: parseFloat(row[3])||0, completed: row[4]==="已去", notes: row[5]||"" } : null
  );

  return {
    themeId: 'mori', // Default theme for imported projects
    tripSettings: { title, startDate, endDate, days },
    companions: newCompanions,
    currencySettings: { selectedCountry, exchangeRate },
    categories: {
      itinerary: currentItinCats,
      expense: currentExpCats
    },
    itineraries: newItineraries,
    expenses: newExpenses,
    packingList: newPacking,
    shoppingList: newShopping,
    foodList: newFood,
    sightseeingList: newSightseeing,
    googleDriveFileId: fileId
  };
};