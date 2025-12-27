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
  Cloud, CloudUpload, CloudDownload, LogIn, LogOut, CheckCircle2, RefreshCw, Printer,
  Calendar, Tag, ChevronDown, Divide, Filter, FileSpreadsheet
} from 'lucide-react';

import { 
    DEFAULT_ITINERARY_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, COUNTRY_OPTIONS, 
    ICON_REGISTRY, getIconComponent, CATEGORY_COLORS, THEMES, AVATAR_COLORS
} from '../utils/constants';

import { 
    generateNewProjectData, getNextDay, calculateDaysDiff, formatDate, 
    timeToMinutes, minutesToTime, formatDurationDisplay, formatMoney, 
    sortItemsByTime, solveDebts, formatInputNumber, getAvatarColor,
    parseProjectDataFromGAPI // Imported new helper
} from '../utils/helpers';

import { BottomNav, PayerAvatar, AvatarSelect } from '../components/UIComponents';

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
  
  // Ensure we always have valid objects even if projectData has missing fields
  const [tripSettings, setTripSettings] = useState(projectData?.tripSettings || generateNewProjectData('Temp').tripSettings);
  const [companions, setCompanions] = useState(Array.isArray(projectData?.companions) ? projectData.companions : ['Me']);
  const [currencySettings, setCurrencySettings] = useState(projectData?.currencySettings?.selectedCountry ? projectData.currencySettings : DEFAULT_CURRENCY_SETTINGS);
  
  const [activeDay, setActiveDay] = useState(0); 
  const [itineraries, setItineraries] = useState(projectData?.itineraries || {});
  const [checklistTab, setChecklistTab] = useState('packing');
  const [packingList, setPackingList] = useState(projectData?.packingList || []);
  const [shoppingList, setShoppingList] = useState(projectData?.shoppingList || []);
  const [foodList, setFoodList] = useState(projectData?.foodList || []);
  const [sightseeingList, setSightseeingList] = useState(projectData?.sightseeingList || []);
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

  // Cloud Load State
  const [cloudFiles, setCloudFiles] = useState([]);
  const [isCloudLoadModalOpen, setIsCloudLoadModalOpen] = useState(false);
  const [isLoadingCloudList, setIsLoadingCloudList] = useState(false);
  const [isProcessingCloudFile, setIsProcessingCloudFile] = useState(false);

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

  // --- Auto Fetch Cloud Files on Login ---
  useEffect(() => {
    if (googleUser && gapiInited) {
        fetchCloudFiles();
    }
  }, [googleUser, gapiInited]);

  const fetchCloudFiles = async () => {
      setIsLoadingCloudList(true);
      try {
          // Query for spreadsheets starting with 'TravelApp_' and not in trash
          const q = "name contains 'TravelApp_' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
          const response = await window.gapi.client.drive.files.list({
              q: q,
              fields: 'files(id, name, modifiedTime)',
              orderBy: 'modifiedTime desc',
              pageSize: 20
          });
          
          const files = response.result.files;
          setCloudFiles(files);
          
          if (files && files.length > 0) {
             if (tripSettings.title === 'Temp' || tripSettings.title === 'My Trip') {
                 setIsCloudLoadModalOpen(true);
             }
          }
      } catch (error) {
          console.error("Error fetching cloud files:", error);
      } finally {
          setIsLoadingCloudList(false);
      }
  };

  const loadFromGoogleSheet = async (fileId, fileName) => {
      setIsProcessingCloudFile(true);
      try {
        const ranges = [
            "專案概覽!A:B", 
            "行程表!A:H", 
            "費用!A:H", 
            "管理類別!A:E", 
            "行李!A:B", 
            "購物!A:F", 
            "美食!A:F", 
            "景點!A:F"
        ];
        
        const response = await window.gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: fileId,
            ranges: ranges,
            valueRenderOption: 'FORMATTED_VALUE'
        });

        // Use the new helper to parse data
        const parsedData = parseProjectDataFromGAPI(fileId, fileName, response.result.valueRanges);

        // --- Batch Update State ---
        setTripSettings(parsedData.tripSettings);
        setCompanions(parsedData.companions);
        setCurrencySettings(parsedData.currencySettings);
        setItineraryCategories(parsedData.categories.itinerary);
        setExpenseCategories(parsedData.categories.expense);
        setItineraries(parsedData.itineraries);
        setExpenses(parsedData.expenses);
        setPackingList(parsedData.packingList);
        setShoppingList(parsedData.shoppingList);
        setFoodList(parsedData.foodList);
        setSightseeingList(parsedData.sightseeingList);
        setGoogleDriveFileId(parsedData.googleDriveFileId);

        setIsCloudLoadModalOpen(false);
        alert(`成功讀取雲端檔案：${parsedData.tripSettings.title}`);

      } catch (error) {
          console.error("Parse Cloud File Error:", error);
          alert("讀取雲端檔案失敗，請確認檔案格式是否正確。");
      } finally {
          setIsProcessingCloudFile(false);
      }
  };


  // --- Auto Save Logic ---
  useEffect(() => {
      // Only auto-save if logged in and API is ready
      if (!googleUser || !gapiInited) return;

      const timer = setTimeout(() => {
          handleSaveToGoogleSheet(true); // silent = true
      }, 5000); // 5 seconds debounce

      return () => clearTimeout(timer);
  }, [tripSettings, itineraries, expenses, packingList, shoppingList, foodList, sightseeingList, googleUser, gapiInited, googleDriveFileId]);

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

          const sightseeingRows = [["地區", "景點名稱", "地點/地址", "預估費用", "完成狀態", "備註"]];
          sightseeingList.forEach(item => sightseeingRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已去" : "未去", item.notes || ""]));

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
                  { properties: { title: '景點' } },
                  { properties: { title: '費用' } },
                  { properties: { title: '管理類別' } }
              ]
          };

          // 2. Check and Rename/Create
          let spreadsheetId = googleDriveFileId;
          let fileExists = false;

          if (spreadsheetId) {
              try {
                  const fileRes = await window.gapi.client.drive.files.get({
                      fileId: spreadsheetId,
                      fields: 'id, name, trashed'
                  });
                  
                  if (!fileRes.result.trashed) {
                      fileExists = true;
                      if (fileRes.result.name !== title) {
                          await window.gapi.client.drive.files.update({
                              fileId: spreadsheetId,
                              resource: { name: title }
                          });
                          if (!isSilent) console.log(`Cloud file renamed to: ${title}`);
                      }
                  }
              } catch (e) {
                  console.warn("Stored File ID not found or inaccessible, falling back to search.");
                  spreadsheetId = null; 
              }
          }

          if (!fileExists) {
              const q = `name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
              const searchRes = await window.gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
              
              if (searchRes.result.files && searchRes.result.files.length > 0) {
                  spreadsheetId = searchRes.result.files[0].id;
              } else {
                  const createResponse = await window.gapi.client.sheets.spreadsheets.create({
                      resource: sheetStructure
                  });
                  spreadsheetId = createResponse.result.spreadsheetId;
              }
              setGoogleDriveFileId(spreadsheetId);
          }
          
          if (fileExists || spreadsheetId) { 
               await window.gapi.client.sheets.spreadsheets.values.batchClear({
                  spreadsheetId,
                  resource: { ranges: ["專案概覽", "行程表", "行李", "購物", "美食", "景點", "費用", "管理類別"] }
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
                      { range: "景點!A1", values: sightseeingRows },
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

  const handleExportToPDF = () => {
    try {
      const title = tripSettings.title || "My Trip";
      const dateRange = `${tripSettings.startDate || 'N/A'} ~ ${tripSettings.endDate || 'N/A'}`;
      
      let content = `
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: "Noto Sans TC", sans-serif; padding: 20px; color: #333; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #5F6F52; margin-bottom: 5px; }
            .meta { text-align: center; color: #888; font-size: 0.9rem; margin-bottom: 30px; }
            h2 { border-bottom: 2px solid #E6E2D3; padding-bottom: 5px; margin-top: 30px; color: #5F6F52; }
            h3 { margin-top: 20px; margin-bottom: 10px; font-size: 1.1rem; color: #A98467; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 0.9rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .amount { text-align: right; }
            .tag { font-size: 0.8rem; padding: 2px 6px; background: #eee; border-radius: 4px; }
            .note { font-size: 0.85rem; color: #666; font-style: italic; display: block; margin-top: 4px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">${dateRange} (${tripSettings.days}天)</div>
      `;

      // Itinerary
      content += `<h2>📅 行程表</h2>`;
      const sortedDays = Object.keys(itineraries).sort((a,b) => parseInt(a)-parseInt(b));
      if (sortedDays.length > 0) {
        sortedDays.forEach(dayIndex => {
          const dayNum = parseInt(dayIndex) + 1;
          const dayDate = formatDate(tripSettings.startDate, dayIndex).text;
          content += `<h3>Day ${dayNum} (${dayDate})</h3>`;
          
          const items = itineraries[dayIndex] || [];
          if (items.length > 0) {
            content += `<table><thead><tr><th width="15%">時間</th><th width="15%">類型</th><th width="30%">項目</th><th width="25%">地點</th><th width="15%">費用</th></tr></thead><tbody>`;
            items.forEach(item => {
              const cat = itineraryCategories.find(c => c.id === item.type) || { label: item.type || '未分類' };
              content += `<tr>
                <td>${item.time}</td>
                <td><span class="tag">${cat.label}</span></td>
                <td><strong>${item.title}</strong>${item.notes ? `<span class="note">${item.notes}</span>` : ''}</td>
                <td>${item.location || '-'}</td>
                <td class="amount">${item.cost > 0 ? formatMoney(item.cost) : '-'}</td>
              </tr>`;
            });
            content += `</tbody></table>`;
          } else {
            content += `<p style="color:#999; font-style:italic;">無行程</p>`;
          }
        });
      } else {
         content += `<p>尚無行程資料。</p>`;
      }

      // Expenses
      content += `<h2>💰 費用預算</h2>`;
      if (expenses.length > 0) {
        content += `<table><thead><tr><th width="15%">日期</th><th width="15%">類別</th><th width="30%">項目</th><th width="20%">付款人</th><th width="20%" class="amount">金額</th></tr></thead><tbody>`;
        const sortedExp = [...expenses].sort((a,b) => new Date(a.date) - new Date(b.date));
        sortedExp.forEach(item => {
          const cat = expenseCategories.find(c => c.id === item.category) || { label: item.category || '未分類' };
          content += `<tr>
            <td>${item.date}</td>
            <td><span class="tag">${cat.label}</span></td>
            <td>${item.title}</td>
            <td>${item.payer}</td>
            <td class="amount">${item.currency || ''} ${formatMoney(item.cost)}</td>
          </tr>`;
        });
        content += `</tbody></table>`;
      } else {
        content += `<p style="color:#999; font-style:italic;">無費用紀錄</p>`;
      }

      // Checklists
      content += `<h2>✅ 檢查清單</h2>`;
      
      content += `<h3>🧳 行李</h3><ul>`;
      if(packingList.length > 0) packingList.forEach(item => content += `<li>[${item.completed ? '✓' : '　'}] ${item.title}</li>`);
      else content += `<li>無資料</li>`;
      content += `</ul>`;

      if (shoppingList.length > 0) {
        content += `<h3>🛍️ 購物</h3><ul>`;
        shoppingList.forEach(item => content += `<li>[${item.completed ? '✓' : '　'}] ${item.title} ${item.region ? `(${item.region})` : ''} - 預算: ${item.cost}</li>`);
        content += `</ul>`;
      }

      if (foodList.length > 0) {
        content += `<h3>🍽️ 美食</h3><ul>`;
        foodList.forEach(item => content += `<li>[${item.completed ? '✓' : '　'}] ${item.title} ${item.region ? `(${item.region})` : ''} - 預算: ${item.cost}</li>`);
        content += `</ul>`;
      }

      if (sightseeingList.length > 0) {
        content += `<h3>📷 景點</h3><ul>`;
        sightseeingList.forEach(item => content += `<li>[${item.completed ? '✓' : '　'}] ${item.title} ${item.region ? `(${item.region})` : ''} - 預算: ${item.cost}</li>`);
        content += `</ul>`;
      }

      content += `
        <script>
          window.onload = function() { setTimeout(function(){ window.print(); }, 500); }
        </script>
        </body></html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("無法開啟列印視窗，請檢查網址列是否封鎖了彈出式視窗 (Pop-up Blocker)。");
        return;
      }
      
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();

    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("匯出 PDF 時發生錯誤: " + err.message);
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
      sightseeingList,
      expenses,
      categories: {
        itinerary: itineraryCategories,
        expense: expenseCategories
      },
      googleDriveFileId: googleDriveFileId // Persist the ID
    });
  }, [tripSettings, companions, currencySettings, itineraries, packingList, shoppingList, foodList, sightseeingList, expenses, itineraryCategories, expenseCategories, googleDriveFileId]);

  const [statsMode, setStatsMode] = useState('real');
  const [statsCategoryFilter, setStatsCategoryFilter] = useState('all');
  const [statsPersonFilter, setStatsPersonFilter] = useState('all');
  const [statsDayFilter, setStatsDayFilter] = useState('all'); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); 

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
  const confirm = (message, action) => { setConfirmAction({ message, onConfirm: action }); };
  
  const sortExpensesByRegionAndCategory = (items) => {
    const catOrder = expenseCategories.map(c => c.id);
    return [...items].sort((a, b) => {
      const regionA = a.region || 'zzzz';
      const regionB = b.region || 'zzzz';
      if (regionA !== regionB) return regionA.localeCompare(regionB);
      return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !window.XLSX) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = window.XLSX.read(bstr, { type: 'binary' });
        
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

        const wsCategories = wb.Sheets["管理類別"];
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
                } else if (type === "費用") newExpCats.push(item);
            });
            if (newItinCats.length > 0) { setItineraryCategories(newItinCats); currentItinCats = newItinCats; }
            if (newExpCats.length > 0) { setExpenseCategories(newExpCats); currentExpCats = newExpCats; }
        }

        const itinLabelToId = {};
        currentItinCats.forEach(c => itinLabelToId[c.label] = c.id);
        const expLabelToId = {};
        currentExpCats.forEach(c => expLabelToId[c.label] = c.id);

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

        const parseList = (sheetName, mapFn) => {
            const ws = wb.Sheets[sheetName];
            if (!ws) return [];
            return window.XLSX.utils.sheet_to_json(ws).map(mapFn);
        };

        setPackingList(parseList("行李", row => ({ id: Date.now() + Math.random(), title: row["物品名稱"] || "未命名", completed: row["狀態"] === "已完成" })));
        setShoppingList(parseList("購物", row => ({ id: Date.now() + Math.random(), region: row["地區"] || "", title: row["商品名稱"] || "未命名", location: row["地點/店名"] || "", cost: parseFloat(row["預估費用"]) || 0, completed: row["購買狀態"] === "已購買", notes: row["備註"] || "" })));
        setFoodList(parseList("美食", row => ({ id: Date.now() + Math.random(), region: row["地區"] || "", title: row["餐廳名稱"] || "未命名", location: row["地點/地址"] || "", cost: parseFloat(row["預估費用"]) || 0, completed: row["完成狀態"] === "已吃", notes: row["備註"] || "" })));
        setSightseeingList(parseList("景點", row => ({ id: Date.now() + Math.random(), region: row["地區"] || "", title: row["景點名稱"] || "未命名", location: row["地點/地址"] || "", cost: parseFloat(row["預估費用"]) || 0, completed: row["完成狀態"] === "已去", notes: row["備註"] || "" })));

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
                     details = shares.map((s, i) => ({ id: Date.now() + i + Math.random(), payer: payer, target: s, amount: shareAmount }));
                 } else {
                     shares = [payer]; 
                     const parts = splitStr.split(",").map(s => s.trim());
                     if (parts.length > 0 && parts[0].includes(":")) {
                         shares = [];
                         details = parts.map((p, i) => {
                             const [name, amt] = p.split(":").map(x => x.trim());
                             const targetName = name === '全員' ? 'ALL' : name;
                             if (!shares.includes(targetName)) shares.push(targetName);
                             return { id: Date.now() + i + Math.random(), payer: payer, target: targetName, amount: parseFloat(amt) || 0 }
                         });
                     }
                 }
                 return { id: Date.now() + Math.random(), date: row["日期"] || new Date().toISOString().split('T')[0], region: row["地區"] || "", category: catId, title: row["項目"] || "未命名", location: row["地點"] || "", payer: payer, cost: cost, currency: row["參考：貨幣代碼"] || "JPY", shares: shares, details: details };
             });
             setExpenses(newExpenses);
        }
        alert("匯入成功！");
      } catch (err) { console.error(err); alert("匯入失敗，請確認檔案格式正確。"); }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleExportToExcel = () => {
    if (!window.XLSX) { alert("Excel 匯出功能尚未載入完成，請稍後再試。"); return; }
    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();

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
    COUNTRY_OPTIONS.forEach((country, index) => {
      const rowIndex = index + 1;
      if (!overviewData[rowIndex]) overviewData[rowIndex] = ["", "", "", "", "", ""];
      while (overviewData[rowIndex].length < 6) overviewData[rowIndex].push("");
      overviewData[rowIndex][4] = country.name;
      overviewData[rowIndex][5] = country.currency;
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overviewData), "專案概覽");

    const itineraryRows = [["Day", "時間", "持續時間(分)", "類型", "標題", "地點", "費用 (外幣)", "備註", "", "參考：類型選項"]];
    Object.keys(itineraries).sort((a,b) => parseInt(a)-parseInt(b)).forEach(dayIndex => {
      (itineraries[dayIndex] || []).forEach(item => {
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itineraryRows), "行程表");

    const packingRows = [["物品名稱", "狀態"]];
    packingList.forEach(item => packingRows.push([item.title, item.completed ? "已完成" : "未完成"]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(packingRows), "行李");

    const shoppingRows = [["地區", "商品名稱", "地點/店名", "預估費用", "購買狀態", "備註"]];
    shoppingList.forEach(item => shoppingRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已購買" : "未購買", item.notes || ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(shoppingRows), "購物");

    const foodRows = [["地區", "餐廳名稱", "地點/地址", "預估費用", "完成狀態", "備註"]];
    foodList.forEach(item => foodRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已吃" : "未吃", item.notes || ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(foodRows), "美食");

    const sightseeingRows = [["地區", "景點名稱", "地點/地址", "預估費用", "完成狀態", "備註"]];
    sightseeingList.forEach(item => sightseeingRows.push([item.region || "", item.title, item.location || "", item.cost || 0, item.completed ? "已去" : "未去", item.notes || ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sightseeingRows), "景點");

    const expenseRows = [["日期", "地區", "類別", "項目", "地點", "付款人", "總金額 (外幣)", "分攤詳情", "", "參考：費用類別"]];
    expenses.forEach(item => {
      const cat = expenseCategories.find(c => c.id === item.category) || { label: item.category };
      let splitStr = "";
      if (item.details && item.details.length > 0) splitStr = item.details.map(d => `${d.target === 'ALL' ? '全員' : d.target}: ${d.amount}`).join(", ");
      else splitStr = `分攤: ${item.shares.join(", ")}`;
      expenseRows.push([new Date(item.date), item.region || "", cat.label, item.title, item.location || "", item.payer, item.cost, splitStr]);
    });
    expenseCategories.forEach((cat, index) => {
        const rowIndex = index + 1;
        if (!expenseRows[rowIndex]) expenseRows[rowIndex] = new Array(10).fill("");
        while(expenseRows[rowIndex].length < 10) expenseRows[rowIndex].push("");
        expenseRows[rowIndex][9] = cat.label;
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expenseRows), "費用");

    const categoryRows = [["類型", "ID", "名稱", "圖示", "顏色"]];
    itineraryCategories.forEach(c => categoryRows.push(["行程", c.id, c.label, c.icon, c.color]));
    expenseCategories.forEach(c => categoryRows.push(["費用", c.id, c.label, c.icon, ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(categoryRows), "管理類別");

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
    if (checklistTab === 'sightseeing') return sightseeingList;
    return [];
  };

  const updateCurrentList = (newList) => {
    if (viewMode === 'itinerary') setItineraries({ ...itineraries, [activeDay]: newList });
    else if (viewMode === 'expenses') setExpenses(newList);
    else if (checklistTab === 'packing') setPackingList(newList);
    else if (checklistTab === 'shopping') setShoppingList(newList);
    else if (checklistTab === 'food') setFoodList(newList);
    else if (checklistTab === 'sightseeing') setSightseeingList(newList);
  };

  const handleDragStart = (e, index) => { dragItem.current = index; if (e.target.closest('.draggable-item')) e.target.closest('.draggable-item').style.opacity = '0.5'; };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = (e) => {
    if (e.target.closest('.draggable-item')) e.target.closest('.draggable-item').style.opacity = '1';
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (viewMode === 'categoryManager') {
      const list = categoryManagerTab === 'itinerary' ? [...itineraryCategories] : [...expenseCategories];
      const dragContent = list[dragItem.current];
      list.splice(dragItem.current, 1);
      list.splice(dragOverItem.current, 0, dragContent);
      if (categoryManagerTab === 'itinerary') setItineraryCategories(list); else setExpenseCategories(list);
    } else {
      const list = [...getCurrentList()];
      const dragContent = list[dragItem.current];
      list.splice(dragItem.current, 1);
      list.splice(dragOverItem.current, 0, dragContent);
      updateCurrentList(list);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDayDrop = (e, targetDayIdx) => {
    e.preventDefault();
    if (dragItem.current === null || activeDay === targetDayIdx || viewMode !== 'itinerary') return;
    const currentList = [...itineraries[activeDay]];
    const itemToMove = currentList[dragItem.current];
    currentList.splice(dragItem.current, 1);
    const targetList = [...(itineraries[targetDayIdx] || [])];
    targetList.push(itemToMove);
    setItineraries({ ...itineraries, [activeDay]: currentList, [targetDayIdx]: targetList });
    dragItem.current = null;
  };

  const openAddModal = () => {
    setEditingItem(null);
    const baseData = { title: '', location: '', cost: '', costType: 'FOREIGN', website: '', notes: '', region: '' };
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
      setFormData({ ...baseData, date: tripSettings.startDate, category: expenseCategories[0]?.id || 'food', payer: 'Me', shares: companions, details: [] });
    } else {
      setFormData(baseData);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    let displayCost = item.cost;
    let currentCostType = item.costType || 'FOREIGN';
    if (currentCostType === 'TWD') displayCost = Math.round(item.cost * currencySettings.exchangeRate);
    if (viewMode === 'expenses' && (!item.details || item.details.length === 0)) {
       const migratedDetails = item.shares.map((sharePerson, idx) => ({ id: Date.now() + idx, payer: item.payer, target: sharePerson, amount: Math.round(item.cost / item.shares.length) }));
       setFormData({ ...item, cost: displayCost, costType: currentCostType, details: migratedDetails });
    } else {
       setFormData({ ...item, cost: displayCost, costType: currentCostType });
    }
    setIsModalOpen(true);
  };

  const openCategoryEditModal = (category = null) => {
    if (category) setCategoryFormData({ ...category, isNew: false });
    else setCategoryFormData({ id: Date.now().toString(), label: '', icon: 'Star', color: 'bg-[#F2F4F1]', isNew: true });
    setIsCategoryEditModalOpen(true);
  };

  const handleCategorySave = (e) => {
    e.preventDefault();
    const isItinerary = categoryManagerTab === 'itinerary';
    const list = isItinerary ? [...itineraryCategories] : [...expenseCategories];
    const newData = { ...categoryFormData };
    delete newData.isNew;
    if (categoryFormData.isNew) { if (isItinerary) setItineraryCategories([...list, newData]); else setExpenseCategories([...list, newData]); } 
    else { const updatedList = list.map(c => c.id === newData.id ? newData : c); if (isItinerary) setItineraryCategories(updatedList); else setExpenseCategories(updatedList); }
    setIsCategoryEditModalOpen(false);
  };

  const handleDeleteCategory = (id) => {
    confirm("確定刪除此類別嗎？已使用此類別的項目將會顯示異常。", () => {
      if (categoryManagerTab === 'itinerary') setItineraryCategories(itineraryCategories.filter(c => c.id !== id));
      else setExpenseCategories(expenseCategories.filter(c => c.id !== id));
    });
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    let newItem = { ...formData, id: editingItem ? editingItem.id : Date.now() };
    if (formData.cost) {
      const rawCost = parseFloat(formData.cost);
      if (formData.costType === 'TWD') newItem.cost = Math.round(rawCost / currencySettings.exchangeRate);
      else newItem.cost = parseFloat(rawCost);
    } else newItem.cost = 0;
    newItem.costType = formData.costType;
    if (viewMode === 'expenses') {
      newItem.currency = currencySettings.selectedCountry.currency;
      if (newItem.details && newItem.details.length > 0) {
         newItem.payer = newItem.details[0].payer;
         const targets = new Set();
         newItem.details.forEach(d => { if (d.target === 'ALL' || d.target === 'EACH') companions.forEach(c => targets.add(c)); else targets.add(d.target); });
         newItem.shares = Array.from(targets);
      }
    }
    if (viewMode === 'itinerary') newItem.duration = parseInt(formData.duration) || 0;
    let list = viewMode === 'expenses' ? [...expenses] : [...getCurrentList()];
    if (editingItem) list = list.map(item => item.id === editingItem.id ? { ...newItem, completed: item.completed } : item);
    else list = [...list, { ...newItem, completed: false }];
    if (viewMode === 'itinerary') list = sortItemsByTime(list);
    if (viewMode === 'expenses') setExpenses(list); else updateCurrentList(list);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => { if (viewMode === 'expenses') setExpenses(expenses.filter(item => item.id !== id)); else updateCurrentList(getCurrentList().filter(item => item.id !== id)); };

  const handleTotalCostChange = (e) => {
    const val = e.target.value.replace(/,/g, '');
    if (isNaN(val)) return;
    const newCost = parseFloat(val) || 0;
    let newDetails = formData.details || [];
    if (newDetails.length > 0) {
        const perLine = Math.floor(newCost / newDetails.length);
        const remainder = newCost - (perLine * newDetails.length);
        newDetails = newDetails.map((d, i) => ({ ...d, amount: i === 0 ? perLine + remainder : perLine }));
    }
    setFormData({...formData, cost: newCost, details: newDetails});
  };

  const addSplitDetail = () => {
    const currentAllocated = (formData.details || []).reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
    const totalCost = parseFloat(formData.cost) || 0;
    const remaining = Math.max(0, totalCost - currentAllocated);
    setFormData({ ...formData, details: [...(formData.details || []), { id: Date.now(), payer: 'Me', target: companions[0] || 'Me', amount: remaining }] });
  };
  const removeSplitDetail = (detailId) => { setFormData({ ...formData, details: formData.details.filter(d => d.id !== detailId) }); };
  const updateSplitDetail = (detailId, field, value) => {
      const updatedDetails = formData.details.map(d => {
          if (d.id !== detailId) return d;
          let updates = { [field]: value };
          if (field === 'payer' && value === 'EACH') updates.target = 'EACH';
          return { ...d, ...updates };
      });
      let newCost = formData.cost;
      if (field === 'amount') newCost = updatedDetails.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      setFormData({ ...formData, details: updatedDetails, cost: newCost });
  };

  const toggleComplete = (id) => updateCurrentList(getCurrentList().map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const handleSettingsSubmit = (e) => { e.preventDefault(); const days = calculateDaysDiff(tempSettings.startDate, tempSettings.endDate); setTripSettings({ ...tempSettings, days }); setIsSettingsOpen(false); if (activeDay >= days) setActiveDay(0); };
  const handleStartDateChange = (e) => { const newStart = e.target.value; const newEnd = getNextDay(newStart); setTempSettings({ ...tempSettings, startDate: newStart, endDate: newEnd }); };
  const handleCurrencySubmit = (e) => { e.preventDefault(); setCurrencySettings({...tempCurrency}); setIsCurrencyModalOpen(false); };
  const handleAddCompanion = (e) => { e.preventDefault(); if (newCompanionName.trim() && !companions.includes(newCompanionName.trim())) { setCompanions([...companions, newCompanionName.trim()]); setNewCompanionName(''); }};
  const handleRemoveCompanion = (index) => { const newCompanions = [...companions]; newCompanions.splice(index, 1); setCompanions(newCompanions); };
  const handleClearAllCompanions = () => setCompanions([]);
  const startEditCompanion = (index, name) => { setEditingCompanionIndex(index); setEditingCompanionName(name); };
  const saveEditCompanion = (index) => { const oldName = companions[index]; const newName = editingCompanionName.trim(); if (newName && newName !== oldName && !companions.includes(newName)) { const newCompanions = [...companions]; newCompanions[index] = newName; setCompanions(newCompanions); } setEditingCompanionIndex(null); };

  // --- Handlers for Header Buttons ---
  const handleOpenCurrencyModal = () => {
      const safeCurrency = currencySettings?.selectedCountry ? currencySettings : DEFAULT_CURRENCY_SETTINGS;
      setTempCurrency({ ...safeCurrency });
      setIsCurrencyModalOpen(true);
  };

  const handleOpenCompanionModal = () => {
      setIsCompanionModalOpen(true);
  };

  const handleOpenSettingsModal = () => {
      if (!tripSettings) return;
      setTempSettings({ ...tripSettings });
      setIsSettingsOpen(true);
  };

  // --- Statistics Logic (Enhanced) ---
  const statisticsData = useMemo(() => {
    const personStats = {};
    companions.forEach(c => { personStats[c] = { paid: 0, share: 0, balance: 0 }; });
    const getSafeStat = (name) => { if (!personStats[name]) personStats[name] = { paid: 0, share: 0, balance: 0 }; return personStats[name]; };
    const categoryStats = { real: {}, personal: {} };
    let personalExpensesList = [];
    const dailyTotals = {}; 

    // Filter source expenses
    const filteredSourceExpenses = expenses.filter(exp => {
        let matchesDay = true;
        if (statsDayFilter !== 'all') {
            const dayIndex = parseInt(statsDayFilter);
            const targetDate = formatDate(tripSettings.startDate, dayIndex).full;
            matchesDay = exp.date === targetDate;
        }
        let matchesCategory = true;
        if (statsCategoryFilter !== 'all') {
            matchesCategory = exp.category === statsCategoryFilter;
        }
        return matchesDay && matchesCategory;
    });

    filteredSourceExpenses.forEach(exp => {
      const amount = exp.cost || 0;
      const category = exp.category || 'other';
      if (!categoryStats.real[category]) categoryStats.real[category] = 0;
      categoryStats.real[category] += amount;

      // Accumulate Daily Totals
      const dateKey = exp.date;
      if (!dailyTotals[dateKey]) dailyTotals[dateKey] = 0;
      dailyTotals[dateKey] += amount;

      if (exp.details && exp.details.length > 0) {
          exp.details.forEach((d, idx) => {
              const dAmount = parseFloat(d.amount) || 0;
              let payer = d.payer || 'Unknown';
              let target = d.target || 'Unknown';
              let currentPayers = payer === 'EACH' ? companions : [payer];
              let currentTargets = (target === 'ALL' || target === 'EACH') ? companions : [target];
              const totalLineCost = dAmount;
              const paidPerPerson = totalLineCost / currentPayers.length;
              currentPayers.forEach(p => getSafeStat(p).paid += paidPerPerson);
              const sharePerPerson = totalLineCost / currentTargets.length;
              currentTargets.forEach(t => getSafeStat(t).share += sharePerPerson);

              if (target === 'ALL' || target === 'EACH') {
                  companions.forEach(c => personalExpensesList.push({ ...exp, id: `${exp.id}_${idx}_${c}`, cost: sharePerPerson, payer: c, realPayer: (payer === 'EACH' ? c : payer), isVirtual: true, noteSuffix: `(${target === 'EACH' ? '各付' : '均攤'})` }));
                  if (!categoryStats.personal[category]) categoryStats.personal[category] = 0;
                  categoryStats.personal[category] += totalLineCost;
              } else {
                  personalExpensesList.push({ ...exp, id: `${exp.id}_${idx}`, cost: totalLineCost, payer: target, realPayer: (payer === 'EACH' ? target : payer), isVirtual: true, noteSuffix: `` });
                  if (!categoryStats.personal[category]) categoryStats.personal[category] = 0;
                  categoryStats.personal[category] += totalLineCost;
              }
          });
      } else {
          const payer = exp.payer || 'Unknown';
          getSafeStat(payer).paid += amount;
          personalExpensesList.push({ ...exp, realPayer: payer, payer: payer }); 
          if (!categoryStats.personal[category]) categoryStats.personal[category] = 0;
          categoryStats.personal[category] += amount;
      }
    });
    Object.keys(personStats).forEach(p => personStats[p].balance = personStats[p].paid - personStats[p].share);
    const transactions = solveDebts(personStats);
    
    const sortedDailyTotals = Object.entries(dailyTotals).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, total]) => ({ date, total }));

    return { personStats, categoryStats, transactions, personalExpensesList, sortedDailyTotals };
  }, [expenses, companions, expenseCategories, statsDayFilter, statsCategoryFilter, tripSettings.startDate]);

  const renderDetailedList = () => {
    const sourceList = statsMode === 'real' ? expenses : statisticsData.personalExpensesList;
    let filteredExpenses = sourceList.filter(e => {
        let matchesDay = true;
        if (statsDayFilter !== 'all') {
            const dayIndex = parseInt(statsDayFilter);
            const targetDate = formatDate(tripSettings.startDate, dayIndex).full;
            matchesDay = e.date === targetDate;
        }
        let matchesCategory = true;
        if (statsCategoryFilter !== 'all') {
            matchesCategory = e.category === statsCategoryFilter;
        }
        return matchesDay && matchesCategory;
    });

    if (statsPersonFilter !== 'all') filteredExpenses = filteredExpenses.filter(e => e.payer === statsPersonFilter);
    const sortedExpenses = sortExpensesByRegionAndCategory(filteredExpenses);

    if (sortedExpenses.length === 0) return <div className="text-center text-[#888] py-8 text-sm">無符合條件的資料</div>;

    return sortedExpenses.map((exp, index) => {
       const prevExp = sortedExpenses[index - 1];
       const currentCategory = exp.category;
       const categoryDef = expenseCategories.find(c => c.id === currentCategory) || { label: '未分類', icon: 'Coins' };
       const twd = Math.round((exp.cost || 0) * currencySettings.exchangeRate);
       let categoryHeader = null;
       
       if (index === 0 || currentCategory !== prevExp?.category) {
         const CatIcon = getIconComponent(categoryDef.icon);
         const categoryTotal = sortedExpenses.filter(e => e.category === currentCategory).reduce((sum, e) => sum + (e.cost || 0), 0);
         categoryHeader = (
           <div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-2 px-1 mb-2 mt-4 border-b ${theme.border} flex justify-between items-center animate-in fade-in first:mt-0`}>
             <div className={`text-sm font-bold ${theme.primary} flex items-center gap-2`}><CatIcon size={16} /> {categoryDef.label}</div>
             <div className="text-right"><div className={`text-xs font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(categoryTotal)}</div></div>
           </div>
         );
       }
       const ItemIcon = getIconComponent(categoryDef.icon);
       return (
         <React.Fragment key={exp.id}>
           {categoryHeader}
           <div className={`${theme.card} p-3 rounded-xl border ${theme.border} flex justify-between items-center shadow-sm`}>
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full ${theme.hover} flex items-center justify-center ${theme.primary} shrink-0`}><ItemIcon size={16} /></div>
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-bold text-[#3A3A3A] font-serif truncate">{exp.title}</div>
                 <div className="text-[10px] text-[#888] mt-1 flex flex-wrap gap-1 items-center">
                   {statsMode === 'personal' ? (
                     <><span className="flex items-center gap-1"><span>付款:</span><PayerAvatar name={exp.payer} companions={companions} theme={theme}/><span>{exp.payer}</span></span><span className={`text-[#E6E2D3] mx-1`}>|</span><span className="flex items-center gap-1"><span>代墊:</span><PayerAvatar name={exp.realPayer} companions={companions} theme={theme}/><span>{exp.realPayer}</span></span></>
                   ) : (
                     <><span className="flex items-center gap-1"><span>代墊:</span><PayerAvatar name={exp.payer} companions={companions} theme={theme}/><span>{exp.payer}</span></span><span className={`text-[#E6E2D3] mx-1`}>|</span><span className="flex items-center gap-1"><span>分攤:</span>{exp.details && exp.details.some(d => d.target === 'ALL' || d.target === 'EACH') ? <span className={`${theme.hover} px-1 rounded ${theme.primary}`}>全員</span> : <span>{exp.shares ? exp.shares.length : 0}人</span>}</span></>
                   )}
                 </div>
               </div>
             </div>
             <div className="text-right shrink-0"><div className={`text-sm font-bold ${theme.accent} font-serif`}>{exp.currency} {formatMoney(exp.cost)}</div><div className="text-[10px] text-[#999] font-medium">(NT$ {formatMoney(twd)})</div></div>
           </div>
         </React.Fragment>
       );
    });
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-[#464646] font-sans pb-32 ${theme.selection}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
      <header className={`sticky top-0 z-[60] ${theme.bg}/95 backdrop-blur-md border-b ${theme.border}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-start gap-4 flex-1 min-w-0">
               {onBack && (<button onClick={onBack} className={`text-[#888] hover:${theme.primary} transition-colors p-2 -ml-3 rounded-full ${theme.hover} shrink-0`} title="回首頁"><Home size={28} strokeWidth={2.5} /></button>)}
               <div className="min-w-0 flex-1">
                 <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide text-[#3A3A3A] flex items-center gap-2 truncate pr-2"><span className="truncate">{tripSettings.title}</span></h1>
                 <div className={`text-xs font-serif ${theme.subText} mt-1 tracking-widest uppercase pl-1 flex items-center gap-2 truncate`}><span>{tripSettings.startDate.replace(/-/g, '.')}</span><ArrowRight size={12} className="shrink-0" /><span>{tripSettings.endDate.replace(/-/g, '.')}</span><span className={`border-l ${theme.border} pl-2 ml-1 shrink-0`}>{tripSettings.days} 天</span></div>
               </div>
            </div>
            <div className="flex gap-2 shrink-0 relative items-center">
              {googleUser && (<div className="hidden sm:flex items-center gap-1 mr-1">{isAutoSaving || isSyncing ? (<div className="flex items-center gap-1 text-[10px] text-[#A98467] font-bold"><Loader2 size={12} className="animate-spin"/> 儲存中</div>) : (<div className="flex items-center gap-1 text-[10px] text-[#5F6F52] font-bold opacity-70"><Cloud size={12}/> 已同步</div>)}</div>)}
              <button type="button" onClick={handleOpenCurrencyModal} className={`p-2 rounded-full flex items-center gap-1.5 border border-transparent hover:${theme.border} ${theme.hover} ${theme.accent}`}><Coins size={18} /><span className="text-[10px] font-bold hidden sm:inline-block">{currencySettings?.selectedCountry?.currency || 'JPY'}</span></button>
              <button type="button" onClick={handleOpenCompanionModal} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Users size={20} /></button>
              <button type="button" onClick={handleOpenSettingsModal} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><Settings size={20} /></button>
              <div className="relative">
                <button onClick={() => setIsFileMenuOpen(!isFileMenuOpen)} className={`p-2 rounded-full transition-colors ${theme.subText} ${theme.hover}`}><FileText size={20} /></button>
                {isFileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFileMenuOpen(false)}></div>
                    <div className={`absolute right-0 top-full mt-2 w-64 ${theme.card} rounded-xl shadow-xl border ${theme.border} p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-200`}>
                      <div className={`px-4 py-2 text-xs font-bold text-[#888] uppercase tracking-wider border-b ${theme.border} mb-1 flex justify-between items-center`}><span>雲端同步 (Google)</span>{googleUser && <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 size={10}/> 已登入</span>}</div>
                      <button onClick={() => { handleSaveToGoogleSheet(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 text-[#3A3A3A]`} disabled={isSyncing}>{isSyncing ? <Loader2 size={16} className="animate-spin text-[#3A3A3A]"/> : <RefreshCw size={16} className={theme.primary}/>} {isSyncing ? "同步中..." : "立即手動同步"}</button>
                      <button onClick={() => { setIsFileMenuOpen(false); setIsCloudLoadModalOpen(true); fetchCloudFiles(); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 text-[#3A3A3A]`}><CloudDownload size={16} className={theme.primary}/> 讀取雲端檔案</button>
                      <div className={`my-1 border-b ${theme.border}`}></div>
                      <div className="px-4 py-2 text-xs font-bold text-[#888] uppercase tracking-wider">本機檔案</div>
                      <button onClick={() => { fileInputRef.current.click(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : 'text-[#3A3A3A]'}`} disabled={!isXlsxLoaded}>{isXlsxLoaded ? <Upload size={16} /> : <Loader2 size={16} className="animate-spin" />} 匯入 Excel</button>
                      <button onClick={() => { handleExportToExcel(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 ${!isXlsxLoaded ? 'opacity-50 cursor-not-allowed' : 'text-[#3A3A3A]'}`} disabled={!isXlsxLoaded}>{isXlsxLoaded ? <Download size={16} /> : <Loader2 size={16} className="animate-spin" />} 匯出 Excel</button>
                      <button onClick={() => { handleExportToPDF(); setIsFileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg hover:${theme.hover} text-sm font-bold flex items-center gap-3 text-[#3A3A3A]`}><Printer size={16} /> 匯出 PDF / 列印</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {viewMode === 'itinerary' && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {Array.from({ length: tripSettings.days }).map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveDay(idx)} 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={(e) => handleDayDrop(e, idx)}
                  className={`flex flex-col items-center justify-center min-w-[4.5rem] py-2 px-1 rounded-xl transition-all border ${activeDay === idx ? `bg-[#3A3A3A] text-[#F9F8F6] border-[#3A3A3A] shadow-md transform scale-105` : `${theme.card} ${theme.subText} ${theme.border}`}`}
                >
                  <span className="text-[10px] font-bold tracking-wider">Day {idx + 1}</span>
                  <span className="text-sm font-serif font-medium mt-0.5">{formatDate(tripSettings.startDate, idx).text}</span>
                </button>
              ))}
            </div>
          )}
          {viewMode === 'checklist' && (
            <div className="mt-6 flex bg-[#EBE9E4] p-1 rounded-xl">
              {[{id:'packing',label:'行李',icon:Luggage},{id:'shopping',label:'購物',icon:ShoppingBag},{id:'sightseeing',label:'景點',icon:Camera},{id:'food',label:'美食',icon:Utensils}].map(tab => (
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
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color || theme.hover} ${theme.primary} border border-[#F0F0F0]`}><CatIcon size={20} /></div>
                          <div><div className="text-sm font-bold text-[#3A3A3A]">{cat.label}</div><div className="text-[10px] text-[#999] font-mono">ID: {cat.id}</div></div>
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
            {/* Filter Section */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div className={`flex items-center gap-2 p-2 bg-[#EBE9E4] rounded-lg shrink-0`}>
                    <Filter size={16} className="text-[#888] ml-1"/>
                    <select 
                        value={statsDayFilter} 
                        onChange={(e) => setStatsDayFilter(e.target.value)} 
                        className={`bg-transparent text-xs font-bold text-[#3A3A3A] focus:outline-none`}
                    >
                        <option value="all">所有日期</option>
                        {Array.from({ length: tripSettings.days }).map((_, idx) => (
                            <option key={idx} value={idx}>{formatDate(tripSettings.startDate, idx).text}</option>
                        ))}
                    </select>
                    <div className="w-px h-4 bg-[#CCC] mx-1"></div>
                    <select 
                        value={statsCategoryFilter} 
                        onChange={(e) => setStatsCategoryFilter(e.target.value)} 
                        className={`bg-transparent text-xs font-bold text-[#3A3A3A] focus:outline-none max-w-[100px]`}
                    >
                        <option value="all">所有類別</option>
                        {expenseCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* People Filter (View Only) */}
            <div className="overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
              <div className="flex gap-3 min-w-max">
                <div onClick={() => setStatsPersonFilter('all')} className={`border rounded-xl p-3 shadow-sm min-w-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all ${statsPersonFilter === 'all' ? 'bg-[#3A3A3A] border-[#3A3A3A] text-white' : `${theme.card} ${theme.border} text-[#3A3A3A] ${theme.hover}`}`}>
                   <div className="text-xs font-bold mb-1">ALL</div><Users size={16} />
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

            {/* Settlement Suggestion */}
            <div className={`${theme.card} rounded-2xl p-5 border ${theme.border} shadow-sm`}>
              <h3 className="text-sm font-bold text-[#888] mb-4 flex items-center gap-2"><ArrowLeftRight size={16}/> 結算建議 (依篩選)</h3>
              <div className="space-y-3">
                {statisticsData.transactions.length > 0 ? (
                  statisticsData.transactions.map((tx, i) => (
                      <div key={i} className={`flex items-center justify-between text-sm border-b ${theme.border} pb-3 last:border-0`}>
                          <div className="flex items-center gap-2 flex-1"><span className="font-bold text-[#3A3A3A]">{tx.from}</span><ArrowRight size={14} className="text-[#CCC]" /><span className="font-bold text-[#3A3A3A]">{tx.to}</span></div>
                          <div className={`font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(tx.amount)}</div>
                      </div>
                  ))
                ) : ( <div className="text-center text-[#888] text-xs py-2">已結清</div> )}
              </div>
            </div>

            {/* Daily Breakdown */}
            {statisticsData.sortedDailyTotals.length > 0 && (
                <div className={`${theme.card} rounded-2xl p-5 border ${theme.border} shadow-sm`}>
                    <h3 className="text-sm font-bold text-[#888] mb-4 flex items-center gap-2"><Calendar size={16}/> 每日消費明細</h3>
                    <div className="space-y-2">
                        {statisticsData.sortedDailyTotals.map(({ date, total }) => (
                            <div key={date} className={`flex justify-between items-center text-sm py-2 border-b ${theme.border} last:border-0`}>
                                <div className="text-[#3A3A3A] font-serif">{date}</div>
                                <div className={`font-bold ${theme.accent} font-serif`}>{currencySettings.selectedCountry.currency} {formatMoney(total)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3"><h3 className="text-sm font-bold text-[#888] pl-1">詳細清單</h3>{renderDetailedList()}</div>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {viewMode === 'itinerary' && <div className={`absolute left-[4.5rem] top-4 bottom-4 w-px ${theme.border} -z-10`}></div>}
            {getCurrentList().map((item, index) => {
              if (viewMode === 'expenses') {
                const categoryDef = expenseCategories.find(c => c.id === item.category) || { label: '未分類', icon: 'Coins' };
                const Icon = getIconComponent(categoryDef.icon);
                const twd = Math.round(item.cost * currencySettings.exchangeRate);
                const mainAmount = `${item.currency} ${formatMoney(item.cost)}`;
                const subAmount = `(NT$ ${formatMoney(twd)})`;
                
                let groupHeader = null;
                const prevItem = getCurrentList()[index - 1];
                if (index === 0 || (item.region || '未分類') !== (prevItem?.region || '未分類')) {
                   groupHeader = (<div className={`sticky top-0 z-10 ${theme.bg}/95 backdrop-blur-sm py-3 px-1 mb-2 border-b ${theme.border} text-lg font-bold ${theme.primary} flex items-center gap-2 animate-in fade-in mt-6 first:mt-0`}><MapIcon size={18} /> {item.region || '未分類'}</div>);
                }
                const payerDisplay = item.details && item.details.length > 0 ? [...new Set(item.details.map(d => d.payer === 'EACH' ? '各付' : d.payer))].join(' | ') : item.payer;
                return (
                  <React.Fragment key={item.id}>
                    {groupHeader}
                    <div className={`draggable-item group ${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm flex gap-4 items-start relative hover:shadow-md transition-all`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                      <div className={`w-10 h-10 rounded-full ${theme.hover} flex items-center justify-center ${theme.primary} shrink-0 mt-1`}><Icon size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-bold text-[#3A3A3A] font-serif leading-tight pr-2 flex items-center flex-wrap gap-2">
                             <span>{item.title}</span>
                             <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.title, item.id + '_title'); }} className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`} title="複製標題">{copiedId === (item.id + '_title') ? <Check size={12} className={theme.primary} /> : <Copy size={12} />}</button>
                           </h3>
                           <div className="flex gap-2 shrink-0"><button onClick={() => { setEditingItem(item); openEditModal(item); }} className={`text-[#999] hover:${theme.primary} p-1`}><Edit3 size={16}/></button><button onClick={() => handleDeleteItem(item.id)} className={`text-[#999] hover:${theme.danger} p-1`}><Trash2 size={16}/></button></div>
                        </div>
                        <div className="text-xs text-[#888] mb-2 flex items-center gap-2"><Calendar size={12} className={theme.accent}/><span>{item.date}</span><span>•</span><span className={`${theme.accent} font-bold`}>{payerDisplay} ● 支付</span></div>
                        <div className="flex justify-between items-end"><div className={`text-[10px] text-[#666] ${theme.bg} px-2 py-1.5 rounded flex flex-wrap items-center gap-x-2 gap-y-1`}><span className="font-bold">分攤:</span>{item.shares && item.shares.map((share, idx) => (<React.Fragment key={share}><div className="flex items-center gap-1"><PayerAvatar name={share} companions={companions} theme={theme} size="w-3 h-3" /><span>{share}</span></div>{idx < item.shares.length - 1 && <span className="text-[#CCC]">|</span>}</React.Fragment>))}</div>
                        <div className="text-right shrink-0 ml-2"><div className={`text-sm font-serif font-bold ${theme.accent}`}>{mainAmount}</div><div className="text-[10px] text-[#999] font-medium">{subAmount}</div></div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              } 
              if (viewMode === 'itinerary') {
                const categoryDef = itineraryCategories.find(c => c.id === item.type) || { label: '其他', icon: 'Camera', color: 'bg-[#F2F4F1]' };
                const Icon = getIconComponent(categoryDef.icon);
                const endTimeStr = minutesToTime(timeToMinutes(item.time) + item.duration);
                // Remove twdAmount variable as we don't display it anymore to fix to Travel Currency
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
                            <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryDef.color || theme.hover} ${theme.primary} shrink-0`}><Icon size={20} strokeWidth={1.5} /></div><span className="text-xs font-bold tracking-widest text-[#999999] uppercase border border-[#EBE9E4] px-1.5 py-0.5 rounded-sm">{categoryDef.label}</span></div>
                            <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity"><button onClick={() => updateCurrentList([...getCurrentList(), {...item, id: Date.now(), title: `${item.title} (Copy)`}])} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Copy size={14} /></button><button onClick={() => openEditModal(item)} className={`p-1.5 text-[#999999] hover:${theme.primary} ${theme.hover} rounded`}><Edit3 size={14} /></button><button onClick={() => handleDeleteItem(item.id)} className={`p-1.5 text-[#999999] hover:${theme.danger} hover:${theme.dangerBg} rounded`}><Trash2 size={14} /></button></div>
                          </div>
                          <div className="pl-2">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="flex-1"><h3 className="text-xl font-bold text-[#3A3A3A] font-serif leading-tight flex items-center flex-wrap gap-2"><span>{item.title}</span><button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.title, item.id + '_title'); }} className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder} opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0`} title="複製標題">{copiedId === (item.id + '_title') ? <Check size={12} className={theme.primary} /> : <Copy size={12} />}</button>{item.website && <a href={item.website} target="_blank" rel="noreferrer" className={`text-[#888] hover:${theme.accent}`} onClick={e => e.stopPropagation()}><Globe size={14} /></a>}</h3></div>
                                {/* Removed TWD sub-display here to comply with "Fixed to Travel Currency" */}
                                {item.cost > 0 && (<div className="text-right shrink-0"><div className={`text-sm font-serif font-bold ${theme.accent} flex items-center justify-end gap-1`}><Coins size={12} />{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div></div>)}
                            </div>
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
              return (
                <div key={item.id} className="draggable-item group relative" draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd}>
                  <div onClick={() => toggleComplete(item.id)} className={`${theme.card} rounded-xl p-4 border ${theme.border} shadow-sm transition-all flex gap-4 items-start cursor-pointer ${item.completed ? 'opacity-50 grayscale' : ''}`}>
                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${item.completed ? `${theme.primaryBg} ${theme.primaryBorder} text-white` : `bg-white ${theme.border} text-transparent hover:${theme.primaryBorder}`}`}><Check size={12} strokeWidth={3} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-lg font-bold font-serif hover:${theme.primary} transition-colors ${item.completed ? 'text-[#AAA] line-through' : 'text-[#3A3A3A]'}`} onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>{item.title}</h3>
                            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.title, item.id + '_title'); }} className={`w-6 h-6 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:${theme.primary} hover:${theme.primaryBorder} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`} title="複製標題">{copiedId === (item.id + '_title') ? <Check size={12} className={theme.primary} /> : <Copy size={12} />}</button>
                          </div>
                          {item.cost > 0 && (checklistTab !== 'packing') && !item.completed && (<div className="text-right shrink-0"><div className={`text-sm font-bold ${theme.accent}`}>{currencySettings.selectedCountry.symbol} {formatMoney(item.cost)}</div></div>)}
                      </div>
                      {(checklistTab !== 'packing') && (<div className="mt-2 space-y-1">{item.location && (<div className="flex items-center gap-1 -ml-1 text-xs text-[#666]"><MapPin size={12} className={theme.accent} /><span>{item.location}</span></div>)}{item.notes && <div className={`text-[10px] text-[#888] ${theme.hover} p-1.5 rounded inline-block flex items-center gap-1`}><Tag size={10} className={theme.accent}/> {item.notes}</div>}</div>)}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className={`text-[#999] hover:${theme.danger} opacity-0 group-hover:opacity-100 p-1`}><Trash2 size={20} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {viewMode !== 'statistics' && viewMode !== 'categoryManager' && (
        <button onClick={() => setViewMode('categoryManager')} className={`fixed bottom-24 right-6 w-14 h-14 bg-[#3A3A3A] text-[#F9F8F6] rounded-full shadow-lg shadow-[#3A3A3A]/30 hover:scale-105 ${theme.primaryBg} transition-all flex items-center justify-center z-50 animate-in zoom-in duration-300 group`} title="管理類別">
          <LayoutList size={26} strokeWidth={1.5} />
        </button>
      )}

      <BottomNav theme={theme} viewMode={viewMode} setViewMode={setViewMode} openAddModal={openAddModal} />

      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
          <div className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border ${theme.border} animate-in zoom-in-95`}>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2 font-serif">確認</h3><p className="text-sm text-[#666] mb-6">{confirmAction.message}</p>
            <div className="flex gap-3"><button onClick={() => setConfirmAction(null)} className={`flex-1 py-2 text-xs font-bold text-[#888] hover:bg-[#F0F0F0] rounded-lg`}>取消</button><button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className={`flex-1 py-2 text-xs font-bold text-white ${theme.primaryBg} rounded-lg`}>確定</button></div>
          </div>
        </div>
      )}

      {/* Cloud File Load Modal */}
      {isCloudLoadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3A3A3A]/40 backdrop-blur-sm">
           <div className={`bg-[#FDFCFB] w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[80vh] border ${theme.border} animate-in zoom-in-95`}>
             <div className="p-4 border-b border-[#F0F0F0] flex justify-between items-center bg-white rounded-t-xl">
                 <h2 className="text-lg font-bold font-serif text-[#3A3A3A] flex items-center gap-2"><CloudDownload size={20}/> 選擇雲端檔案</h2>
                 <button onClick={() => setIsCloudLoadModalOpen(false)}><X size={20} className="text-[#999] hover:text-[#333]" /></button>
             </div>
             <div className="p-2 overflow-y-auto flex-1 bg-[#F9F8F6]">
                 {isLoadingCloudList ? (
                     <div className="flex flex-col items-center justify-center py-10 text-[#888] gap-2">
                         <Loader2 size={30} className="animate-spin text-[#A98467]"/>
                         <span className="text-sm font-bold">搜尋 Google Drive 中...</span>
                     </div>
                 ) : isProcessingCloudFile ? (
                     <div className="flex flex-col items-center justify-center py-10 text-[#888] gap-2">
                         <Loader2 size={30} className="animate-spin text-[#5F6F52]"/>
                         <span className="text-sm font-bold">讀取並解析檔案中...</span>
                     </div>
                 ) : cloudFiles.length === 0 ? (
                     <div className="text-center py-10 text-[#888]">
                         <FileSpreadsheet size={40} className="mx-auto mb-2 opacity-20"/>
                         <p className="text-sm font-bold">找不到以 "TravelApp_" 開頭的檔案</p>
                         <p className="text-xs mt-1">請先儲存過一次檔案，或檢查雲端垃圾桶。</p>
                     </div>
                 ) : (
                     <div className="space-y-2">
                         {cloudFiles.map(file => (
                             <button 
                                key={file.id}
                                onClick={() => loadFromGoogleSheet(file.id, file.name)}
                                className={`w-full text-left p-3 rounded-lg border ${theme.border} bg-white hover:border-[#A98467] hover:shadow-md transition-all group`}
                             >
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full bg-[#EBE9E4] flex items-center justify-center group-hover:bg-[#A98467] group-hover:text-white transition-colors`}>
                                         <FileSpreadsheet size={20}/>
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <div className="font-bold text-[#3A3A3A] truncate text-sm">{file.name}</div>
                                         <div className="text-[10px] text-[#888] mt-0.5">最後修改: {new Date(file.modifiedTime).toLocaleString()}</div>
                                     </div>
                                     <Download size={16} className="text-[#CCC] group-hover:text-[#A98467]"/>
                                 </div>
                             </button>
                         ))}
                     </div>
                 )}
             </div>
             <div className="p-3 border-t border-[#F0F0F0] bg-white rounded-b-xl flex justify-between items-center">
                 <button onClick={fetchCloudFiles} className="text-xs font-bold text-[#A98467] flex items-center gap-1 hover:underline"><RefreshCw size={12}/> 重新整理</button>
                 <button onClick={() => setIsCloudLoadModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[#888] hover:bg-[#F0F0F0] rounded-lg">關閉</button>
             </div>
           </div>
        </div>
      )}

      {/* Modals rendered at the end to ensure they are on top */}
      {isCategoryEditModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border} animate-in zoom-in-95`}>
             <div className="p-6 border-b border-[#F0F0F0]"><h2 className="text-lg font-bold font-serif text-[#3A3A3A]">{categoryFormData.isNew ? '新增類別' : '編輯類別'}</h2></div>
             <div className="p-6 space-y-4 overflow-y-auto">
               <div><label className="block text-xs font-bold text-[#888] mb-1">類別 ID (唯一)</label><input type="text" disabled={!categoryFormData.isNew} value={categoryFormData.id} onChange={e => setCategoryFormData({...categoryFormData, id: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none ${!categoryFormData.isNew ? 'opacity-50 cursor-not-allowed' : ''}`} /></div>
               <div><label className="block text-xs font-bold text-[#888] mb-1">類別名稱</label><input type="text" value={categoryFormData.label} onChange={e => setCategoryFormData({...categoryFormData, label: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder}`} /></div>
               {categoryManagerTab === 'itinerary' && (
                 <div><label className="block text-xs font-bold text-[#888] mb-2">標籤顏色</label><div className="grid grid-cols-8 gap-2">{CATEGORY_COLORS.map(color => (<button key={color} onClick={() => setCategoryFormData({...categoryFormData, color})} className={`w-8 h-8 rounded-full ${color} border ${categoryFormData.color === color ? 'border-2 border-[#5F6F52] scale-110' : 'border-[#E0E0E0]'}`}></button>))}</div></div>
               )}
               <div><label className="block text-xs font-bold text-[#888] mb-2">圖示</label><div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-1 border rounded-lg bg-[#FAFAFA]">{Object.keys(ICON_REGISTRY).map(iconName => { const IconComp = ICON_REGISTRY[iconName]; return (<button key={iconName} onClick={() => setCategoryFormData({...categoryFormData, icon: iconName})} className={`aspect-square flex items-center justify-center rounded hover:bg-[#EEE] ${categoryFormData.icon === iconName ? `${theme.primaryBg} text-white` : 'text-[#666]'}`}><IconComp size={20} /></button>); })}</div></div>
             </div>
             <div className="p-4 border-t border-[#F0F0F0] flex gap-2"><button onClick={() => setIsCategoryEditModalOpen(false)} className="flex-1 py-2 text-xs font-bold text-[#888] hover:bg-[#F0F0F0] rounded-lg">取消</button><button onClick={handleCategorySave} className={`flex-1 py-2 text-xs font-bold text-white ${theme.primaryBg} rounded-lg`}>儲存</button></div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border ${theme.border}`}>
            <div className={`px-6 py-4 bg-[#F7F5F0] border-b ${theme.border} flex justify-between items-center shrink-0`}><h2 className="text-base font-bold text-[#3A3A3A] font-serif tracking-wide">{editingItem ? '編輯' : '新增'}</h2><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-[#999]" /></button></div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="item-form" onSubmit={handleSubmitItem} className="space-y-4">
                {viewMode === 'itinerary' && (
                  <>
                    <div className="grid grid-cols-5 gap-1 mb-2">{itineraryCategories.map((cat) => { const CatIcon = getIconComponent(cat.icon); return (<button key={cat.id} type="button" onClick={() => setFormData({...formData, type: cat.id})} className={`py-2 px-0.5 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${formData.type === cat.id ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}><CatIcon size={16} /><span className="text-[10px] scale-90 truncate w-full text-center">{cat.label}</span></button>) })}</div>
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
                      <div className="mb-3"><label className="block text-xs font-bold text-[#888] mb-1">類別</label><div className="grid grid-cols-4 sm:grid-cols-6 gap-2">{expenseCategories.map((cat) => { const CatIcon = getIconComponent(cat.icon); return (<button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${formData.category === cat.id ? `${theme.primaryBorder} ${theme.primaryBg} text-white` : `${theme.border} bg-white text-[#888] ${theme.hover}`}`}><CatIcon size={16} /><span>{cat.label}</span></button>); })}</div></div>
                      <div className="mb-3"><label className="block text-xs font-bold text-[#888] mb-1">日期</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 text-base text-[#3A3A3A] focus:outline-none focus:${theme.primaryBorder}`} /></div>
                      <div className="flex gap-3"><div className="w-1/3"><input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div><div className="flex-1"><input type="text" placeholder="項目名稱" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div></div>
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用 (總額)</label>
                        <div className="flex gap-2"><div className="relative flex-[2.2]"><select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-base appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select><div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div></div><input type="text" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formatInputNumber(formData.cost)} onChange={handleTotalCostChange} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} /></div>
                      </div>
                      <div className={`bg-[#F2F0EB] p-3 rounded-lg border ${theme.border}`}>
                        <div className="flex justify-between items-center mb-2"><label className={`text-xs font-bold ${theme.primary}`}>分攤方式</label></div>
                        <div className="space-y-2 mb-3">{formData.details && formData.details.map((detail, idx) => { const currentCurrencyLabel = formData.costType === 'TWD' ? 'TWD' : currencySettings.selectedCountry.currency; return (<div key={detail.id} className={`flex flex-wrap items-center gap-2 bg-white p-2 rounded border ${theme.border} shadow-sm text-xs`}><AvatarSelect value={detail.payer} options={[...companions, 'EACH']} onChange={(val) => updateSplitDetail(detail.id, 'payer', val)} theme={theme} companions={companions} /><ArrowRight size={10} className="text-[#CCC]" /><AvatarSelect value={detail.target} options={[...companions, 'ALL', 'EACH']} onChange={(val) => updateSplitDetail(detail.id, 'target', val)} theme={theme} companions={companions} disabled={detail.payer === 'EACH'} /><div className="flex-1 flex items-center justify-end gap-1"><span className="text-[10px] text-[#888]">{currentCurrencyLabel}</span><input type="text" inputMode="decimal" value={formatInputNumber(detail.amount)} onFocus={(e) => e.target.select()} onChange={(e) => { const val = e.target.value.replace(/,/g, ''); if (!isNaN(val)) { updateSplitDetail(detail.id, 'amount', val === '' ? 0 : parseFloat(val)); } }} className={`w-20 text-right border-b ${theme.border} focus:${theme.primaryBorder} focus:outline-none bg-transparent font-bold text-base`} /></div>{formData.details.length > 1 && (<button type="button" onClick={() => removeSplitDetail(detail.id)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1 rounded`}><X size={12} /></button>)}</div>); })}</div>
                        <button type="button" onClick={addSplitDetail} className={`w-full py-2 border border-dashed border-[#A98467] text-[#A98467] rounded hover:bg-[#FDFCFB] text-xs font-bold flex items-center justify-center gap-1 transition-colors`} style={{ borderColor: theme.accentHex, color: theme.accentHex }}><Plus size={12} /> 新增分帳</button>
                      </div>
                  </>
                ) : (
                  <>
                    {(checklistTab === 'food' || checklistTab === 'shopping' || checklistTab === 'sightseeing') ? (
                      <div className="flex gap-3"><div className="w-1/3"><input type="text" placeholder="地區" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div><div className="flex-1"><input type="text" placeholder="店名 / 景點 / 商品" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} /></div></div>
                    ) : (
                      <input type="text" placeholder={checklistTab === 'packing' && viewMode === 'checklist' ? "物品名稱" : "標題"} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b ${theme.border} py-2 text-base font-serif font-bold text-[#3A3A3A] placeholder-[#CCC] focus:outline-none focus:${theme.primaryBorder}`} />
                    )}
                    {(viewMode === 'itinerary' || checklistTab !== 'packing') && (
                      <div>
                        <label className="block text-xs font-bold text-[#888] mb-1">預算 / 費用</label>
                        <div className="flex gap-2"><div className="relative flex-[2.2]"><select value={formData.costType} onChange={(e) => setFormData({...formData, costType: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg pl-3 pr-8 py-2.5 text-[#3A3A3A] text-base appearance-none focus:outline-none focus:${theme.primaryBorder} h-10 font-bold`}><option value="FOREIGN">{currencySettings.selectedCountry.flag} {currencySettings.selectedCountry.currency}</option><option value="TWD">🇹🇼 TWD</option></select><div className="absolute right-3 top-3.5 pointer-events-none text-[#888] text-[10px]">▼</div></div><input type="text" onFocus={(e) => e.target.select()} onKeyDown={blockInvalidChar} inputMode="decimal" placeholder="0" value={formatInputNumber(formData.cost)} onChange={handleTotalCostChange} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder} font-serif h-10`} /></div>
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
                  <div><label className="block text-xs font-bold text-[#888] mb-1">備註</label><textarea rows={2} placeholder="備註..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg p-3 text-base text-[#666] resize-none focus:outline-none focus:${theme.primaryBorder}`} /></div>
                )}
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] shrink-0`}><button type="submit" form="item-form" className={`w-full bg-[#3A3A3A] text-[#F9F8F6] py-3 rounded-lg font-bold text-sm hover:${theme.primaryBg} transition-colors`}>{editingItem ? '儲存' : '新增'}</button></div>
          </div>
        </div>
      )}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border} animate-in zoom-in-95`}>
            <div className="p-6 shrink-0 text-center mb-0"><h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅程設定</h2></div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="settings-form" onSubmit={handleSettingsSubmit} className="space-y-5">
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">旅程標題</label><input type="text" value={tempSettings.title || ''} onChange={e => setTempSettings({...tempSettings, title: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">出發日</label><input type="date" value={tempSettings.startDate || ''} onChange={handleStartDateChange} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div><div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">回程日</label><input type="date" value={tempSettings.endDate || ''} min={tempSettings.startDate || ''} onChange={(e) => setTempSettings({...tempSettings, endDate: e.target.value})} className={`w-full bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /></div></div>
                <div><label className="block text-xs font-bold text-[#888] mb-2 uppercase flex items-center gap-1"><Palette size={12}/> 顏色主題</label><div className="flex gap-2 justify-between">{Object.values(THEMES).map((t) => (<button key={t.id} type="button" onClick={() => onChangeTheme(t.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${t.bg} border ${t.id === theme.id ? `border-2 ${t.primaryBorder} scale-110 shadow-md` : 'border-gray-200'}`} title={t.label}><div className={`w-4 h-4 rounded-full ${t.primaryBg}`}></div></button>))}</div></div>
                <div className={`text-center bg-[#F2F0EB] py-2 rounded-lg border border-dashed ${theme.border}`}><span className="text-xs text-[#888] font-bold">總天數: </span><span className={`text-sm font-serif font-bold ${theme.primary}`}>{calculateDaysDiff(tempSettings.startDate, tempSettings.endDate)} 天</span></div>
              </form>
            </div>
            <div className={`p-4 border-t ${theme.border} bg-[#FDFCFB] flex gap-3 shrink-0`}><button type="button" onClick={() => setIsSettingsOpen(false)} className={`flex-1 py-2.5 text-xs font-bold text-[#888] hover:${theme.hover} rounded-lg`}>取消</button><button type="submit" form="settings-form" className={`flex-1 ${theme.primaryBg} text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-90`}>完成</button></div>
          </div>
        </div>
      )}
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
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
      {isCompanionModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#3A3A3A]/20 backdrop-blur-[2px]">
          <div className={`bg-[#FDFCFB] w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] border ${theme.border}`}>
            <div className="p-6 shrink-0 text-center mb-0"><div className={`w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-3 ${theme.accent}`}><Users size={24} /></div><h2 className="text-xl font-serif font-bold text-[#3A3A3A]">旅伴管理</h2></div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <form id="companion-form" onSubmit={handleAddCompanion} className="space-y-5">
                <div><label className="block text-xs font-bold text-[#888] mb-1.5 uppercase">新增成員</label><div className="flex gap-2"><input type="text" placeholder="名字..." value={newCompanionName} onChange={(e) => setNewCompanionName(e.target.value)} className={`flex-1 bg-[#F7F5F0] border ${theme.border} rounded-lg px-3 py-2.5 text-[#3A3A3A] text-base focus:outline-none focus:${theme.primaryBorder}`} /><button type="submit" className="bg-[#3A3A3A] text-white px-4 rounded-lg hover:opacity-90"><Plus size={20} /></button></div></div>
                <div>
                  <div className="flex justify-between items-end mb-1.5"><label className="block text-xs font-bold text-[#888] uppercase">目前成員</label>{companions.length > 0 && <button type="button" onClick={handleClearAllCompanions} className={`text-[10px] text-[#C55A5A] hover:${theme.dangerBg} px-2 py-1 rounded flex items-center gap-1`}><Trash2 size={12} />全て削除</button>}</div>
                  <div className={`bg-[#F7F5F0] border ${theme.border} rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto`}>{companions.length === 0 ? <div className="text-center py-4 text-[#AAA] text-xs">無</div> : companions.map((c, i) => (<div key={`${c}-${i}`} className={`flex items-center justify-between p-2 bg-white rounded shadow-sm border ${theme.border}`}><div className="flex items-center gap-3 flex-1 min-w-0"><div className={`w-8 h-8 rounded-full ${getAvatarColor(i)} flex items-center justify-center ${theme.primary} shrink-0 border-2 border-white shadow-sm font-serif font-bold text-sm`}>{c.charAt(0).toUpperCase()}</div>{editingCompanionIndex === i ? <input type="text" value={editingCompanionName} onChange={(e) => setEditingCompanionName(e.target.value)} className={`flex-1 border-b ${theme.primaryBorder} outline-none text-base text-[#3A3A3A] py-0.5 font-serif`} autoFocus onBlur={() => saveEditCompanion(i)} onKeyDown={(e) => {if(e.key==='Enter'){e.preventDefault();saveEditCompanion(i)}}} /> : <span className={`text-sm font-bold text-[#3A3A3A] truncate cursor-pointer hover:${theme.primary} font-serif`} onClick={() => startEditCompanion(i, c)}>{c}</span>}</div><div className="flex gap-1 ml-2">{editingCompanionIndex === i ? <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => saveEditCompanion(i)} className={`${theme.primary} hover:${theme.hover} p-1.5 rounded`}><Check size={14} /></button> : <button type="button" onClick={() => handleRemoveCompanion(i)} className={`text-[#C55A5A] hover:${theme.dangerBg} p-1.5 rounded`}><Minus size={14} /></button>}</div></div>))}</div>
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

export default TripPlanner;