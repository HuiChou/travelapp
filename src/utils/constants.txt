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
  Calendar, Tag, ChevronDown, Divide
} from 'lucide-react';

// --- Icon Registry ---
export const ICON_REGISTRY = {
  Camera, Utensils, Coffee, Train, Hotel, MapPin, Plane, 
  ShoppingBag, Coins, Bus, Car, Ship, Ticket, Palmtree, 
  Tent, Music, Gamepad2, Gift, Shirt, Briefcase, Smartphone, 
  Laptop, Anchor, Umbrella, Sun, Moon, Star, Heart, Smile,
  Flower2, Luggage, Calculator, Wallet, Receipt, Star // Added Star as default
};

export const getIconComponent = (iconName) => ICON_REGISTRY[iconName] || Camera;

// --- Google API ---
export const GOOGLE_CLIENT_ID = "456137719976-dp4uin8ae10f332qbhqm447nllr2u4ec.apps.googleusercontent.com";
// Modify: Added 'https://www.googleapis.com/auth/drive.readonly' to allow seeing all files, not just created ones.
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly";

// --- Defaults ---
export const DEFAULT_ITINERARY_CATEGORIES = [
  { id: 'sightseeing', label: '景點', icon: 'Camera', color: 'bg-[#F2F4F1]' },
  { id: 'food', label: '美食', icon: 'Utensils', color: 'bg-[#F7F0ED]' },
  { id: 'cafe', label: '咖啡', icon: 'Coffee', color: 'bg-[#F4EDE6]' },
  { id: 'transport', label: '交通', icon: 'Train', color: 'bg-[#EFF1F3]' },
  { id: 'hotel', label: '住宿', icon: 'Hotel', color: 'bg-[#EEEFF2]' },
  { id: 'shopping', label: '購物', icon: 'ShoppingBag', color: 'bg-[#F9F5F0]' },
  { id: 'flight', label: '飛行', icon: 'Plane', color: 'bg-[#EFF4F7]' },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'food', label: '餐飲', icon: 'Utensils' },
  { id: 'transport', label: '交通', icon: 'Train' },
  { id: 'shopping', label: '購物', icon: 'ShoppingBag' },
  { id: 'stay', label: '住宿', icon: 'Hotel' },
  { id: 'ticket', label: '票券', icon: 'Ticket' },
  { id: 'other', label: '其他', icon: 'Coins' },
];

export const CATEGORY_COLORS = [
  'bg-[#F2F4F1]', 'bg-[#F7F0ED]', 'bg-[#F4EDE6]', 'bg-[#EFF1F3]', 
  'bg-[#EEEFF2]', 'bg-[#F9F5F0]', 'bg-[#EFF4F7]', 'bg-[#E6F0F5]',
  'bg-[#FFF5F7]', 'bg-[#F7F3EF]', 'bg-[#EAEAEA]', 'bg-[#FFD6D6]',
  'bg-[#D6E4FF]', 'bg-[#D6FFD9]', 'bg-[#FFFBD6]', 'bg-[#EAD6FF]'
];

// --- Morandi Color Palette for Avatars (質感莫蘭迪色系 - 增強差異化) ---
// 重新挑選顏色，確保相鄰色系有足夠對比，避免過於相似
export const AVATAR_COLORS = [
  'bg-[#A8B6BF]', // 霧霾藍 (Dusty Blue) - 冷色
  'bg-[#D6C4C2]', // 藕粉色 (Pale Pinkish) - 暖色/粉
  'bg-[#8C9E9E]', // 鼠尾草綠 (Sage Green) - 綠色系
  'bg-[#C5B8A5]', // 卡其沙 (Sand/Khaki) - 黃色/大地系
  'bg-[#B4A5A5]', // 煙燻玫瑰 (Muted Rose) - 深粉紅
  'bg-[#9FA3A8]', // 冷灰色 (Cool Grey) - 中性色
  'bg-[#B2A496]', // 灰褐色 (Taupe) - 棕色系
  'bg-[#7D8F98]', // 岩石藍 (Slate Blue) - 深藍色系 (加強對比)
  'bg-[#A99F98]', // 暖灰色 (Warm Grey) - 暖灰
  'bg-[#9DA6A0]', // 青瓷灰 (Grey Green) - 淺綠灰
  'bg-[#C8A6A6]', // 豆沙紅 (Bean Red) - 紅色系
  'bg-[#9B8E8E]', // 芋泥灰 (Mauve Grey) - 紫色系
];

export const COUNTRY_OPTIONS = [
  { code: 'JP', name: '日本', flag: '🇯🇵', currency: 'JPY', symbol: '¥', defaultRate: 0.20 },
  { code: 'KR', name: '韓國', flag: '🇰🇷', currency: 'KRW', symbol: '₩', defaultRate: 0.024 },
  { code: 'TH', name: '泰國', flag: '🇹🇭', currency: 'THB', symbol: '฿', defaultRate: 0.90 },
  { code: 'US', name: '美國', flag: '🇺🇸', currency: 'USD', symbol: '$', defaultRate: 31.5 },
  { code: 'MY', name: '馬來西亞', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', defaultRate: 6.8 },
];

export const THEMES = {
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


