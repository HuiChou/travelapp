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
  Calendar, Tag, ChevronDown, Divide, Share2, Sparkles, Scroll, Feather,
  Ghost, Droplets, Flame, Hammer
} from 'lucide-react';

// --- Icon Registry ---
export const ICON_REGISTRY = {
  Camera, Utensils, Coffee, Train, Hotel, MapPin, Plane, 
  ShoppingBag, Coins, Bus, Car, Ship, Ticket, Palmtree, 
  Tent, Music, Gamepad2, Gift, Shirt, Briefcase, Smartphone, 
  Laptop, Anchor, Umbrella, Sun, Moon, Star, Heart, Smile,
  Flower2, Luggage, Calculator, Wallet, Receipt, Star, 
  Sparkles, Scroll, Feather, Ghost, Droplets, Flame, Hammer
};

export const getIconComponent = (iconName) => ICON_REGISTRY[iconName] || Camera;

// --- Google API ---
export const GOOGLE_CLIENT_ID = "456137719976-dp4uin8ae10f332qbhqm447nllr2u4ec.apps.googleusercontent.com";
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly";

// --- Defaults ---
export const DEFAULT_ITINERARY_CATEGORIES = [
  { id: 'sightseeing', label: '景點', icon: 'Camera', color: 'bg-[#A5D6A7]' }, // 千尋綠
  { id: 'food', label: '美食', icon: 'Utensils', color: 'bg-[#EF9A9A]' }, // 湯屋紅
  { id: 'cafe', label: '小憩', icon: 'Coffee', color: 'bg-[#BCAAA4]' }, // 鍋爐房褐
  { id: 'transport', label: '交通', icon: 'Train', color: 'bg-[#90CAF9]' }, // 河神藍
  { id: 'hotel', label: '住宿', icon: 'Hotel', color: 'bg-[#B39DDB]' }, // 無臉男紫
  { id: 'shopping', label: '購物', icon: 'ShoppingBag', color: 'bg-[#FFF59D]' }, // 金子黃
  { id: 'flight', label: '飛行', icon: 'Plane', color: 'bg-[#E0F7FA]' }, // 白龍風
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'food', label: '餐飲', icon: 'Utensils' },
  { id: 'transport', label: '交通', icon: 'Train' },
  { id: 'shopping', label: '購物', icon: 'ShoppingBag' },
  { id: 'stay', label: '住宿', icon: 'Hotel' },
  { id: 'ticket', label: '票券', icon: 'Ticket' },
  { id: 'other', label: '其他', icon: 'Coins' },
];

// --- Spirited Away Category Colors (神隱少女配色) ---
export const CATEGORY_COLORS = [
  'bg-[#A5D6A7]', // Chihiro Green (千尋綠)
  'bg-[#F48FB1]', // Chihiro Pink (千尋粉)
  'bg-[#EF9A9A]', // Bathhouse Red (湯屋紅)
  'bg-[#FFCC80]', // Gold/Tokens (金幣/藥牌)
  'bg-[#90CAF9]', // Haku Blue (白龍藍)
  'bg-[#B39DDB]', // No Face Purple (無臉男紫)
  'bg-[#80CBC4]', // River Teal (河神青)
  'bg-[#BCAAA4]', // Kamaji Brown (鍋爐爺爺褐)
  'bg-[#CFD8DC]', // Soot Grey (煤炭灰)
  'bg-[#FFF59D]', // Star Candy Yellow (星星糖黃)
  'bg-[#81D4FA]', // Water (水)
  'bg-[#F5F5F5]', // Paper Bird White (紙人白)
];

// --- Avatar Colors (Frog & Characters) ---
export const AVATAR_COLORS = [
  'bg-[#66BB6A]', // Frog Green (青蛙綠)
  'bg-[#EC407A]', // Chihiro Pink
  'bg-[#42A5F5]', // Haku Blue
  'bg-[#7E57C2]', // No Face Purple
  'bg-[#FF7043]', // Yubaba Orange
  'bg-[#26A69A]', // River Teal
  'bg-[#5D4037]', // Kamaji Brown
  'bg-[#78909C]', // Soot Grey
  'bg-[#FFA726]', // Gold
  'bg-[#AB47BC]', // Zeniba Purple
];

export const COUNTRY_OPTIONS = [
  { code: 'JP', name: '日本', flag: '🇯🇵', currency: 'JPY', symbol: '¥', defaultRate: 0.20 },
  { code: 'KR', name: '韓國', flag: '🇰🇷', currency: 'KRW', symbol: '₩', defaultRate: 0.024 },
  { code: 'TH', name: '泰國', flag: '🇹🇭', currency: 'THB', symbol: '฿', defaultRate: 0.90 },
  { code: 'US', name: '美國', flag: '🇺🇸', currency: 'USD', symbol: '$', defaultRate: 31.5 },
  { code: 'MY', name: '馬來西亞', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', defaultRate: 6.8 },
  { code: 'UK', name: '英國', flag: '🇬🇧', currency: 'GBP', symbol: '£', defaultRate: 40.5 },
];

// --- Spirited Away Themes (Updated with richer CSS variables if needed in future) ---
export const THEMES = {
  chihiro: { 
    id: 'chihiro',
    label: '千尋 (Chihiro)', 
    bg: 'bg-[#F1F8E9]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#388E3C]', 
    primaryHex: '#388E3C',
    primaryBg: 'bg-[#388E3C]',
    primaryBorder: 'border-[#388E3C]',
    accent: 'text-[#EC407A]',
    accentHex: '#EC407A',
    hover: 'hover:bg-[#DCEDC8]',
    subText: 'text-[#689F38]',
    border: 'border-[#C5E1A5]',
    danger: 'text-[#D32F2F]',
    dangerBg: 'bg-[#FFEBEE]',
    navActive: 'text-[#388E3C]',
    navInactive: 'text-[#9CCC65]',
    selection: 'selection:bg-[#C5E1A5] selection:text-[#1B5E20]'
  },
  bathhouse: { 
    id: 'bathhouse',
    label: '湯屋 (Bathhouse)', 
    bg: 'bg-[#FFF3E0]', // 稍微溫暖一點的背景，像木頭
    card: 'bg-[#FFFBFA]', 
    primary: 'text-[#D32F2F]', // 湯屋深紅
    primaryHex: '#D32F2F',
    primaryBg: 'bg-[#D32F2F]',
    primaryBorder: 'border-[#D32F2F]',
    accent: 'text-[#FFB300]', // 奢華金
    accentHex: '#FFB300',
    hover: 'hover:bg-[#FFCDD2]',
    subText: 'text-[#B71C1C]',
    border: 'border-[#EF9A9A]',
    danger: 'text-[#C62828]',
    dangerBg: 'bg-[#FFEBEE]',
    navActive: 'text-[#D32F2F]',
    navInactive: 'text-[#E57373]',
    selection: 'selection:bg-[#FFCDD2] selection:text-[#880E4F]'
  },
  haku: { 
    id: 'haku',
    label: '河神 (Haku)', 
    bg: 'bg-[#E0F7FA]', 
    card: 'bg-[#FFFFFF]',
    primary: 'text-[#00838F]', 
    primaryHex: '#00838F',
    primaryBg: 'bg-[#00838F]',
    primaryBorder: 'border-[#00838F]',
    accent: 'text-[#00ACC1]',
    accentHex: '#00ACC1',
    hover: 'hover:bg-[#B2EBF2]',
    subText: 'text-[#006064]',
    border: 'border-[#80DEEA]',
    danger: 'text-[#D32F2F]',
    dangerBg: 'bg-[#FFEBEE]',
    navActive: 'text-[#006064]',
    navInactive: 'text-[#4DD0E1]',
    selection: 'selection:bg-[#B2EBF2] selection:text-[#006064]'
  },
  noface: { 
    id: 'noface',
    label: '無臉男 (No-Face)', 
    bg: 'bg-[#212121]', 
    card: 'bg-[#424242]', 
    primary: 'text-[#E1BEE7]', 
    primaryHex: '#E1BEE7',
    primaryBg: 'bg-[#7B1FA2]', 
    primaryBorder: 'border-[#7B1FA2]',
    accent: 'text-[#FFCA28]', // 金子更亮一點
    accentHex: '#FFCA28',
    hover: 'hover:bg-[#616161]',
    subText: 'text-[#BDBDBD]', 
    border: 'border-[#616161]',
    danger: 'text-[#EF9A9A]',
    dangerBg: 'bg-[#424242]',
    navActive: 'text-[#E1BEE7]',
    navInactive: 'text-[#9E9E9E]',
    selection: 'selection:bg-[#7B1FA2] selection:text-[#FFFFFF]',
    isDark: true
  },
  kamaji: { 
    id: 'kamaji',
    label: '鍋爐爺爺 (Kamaji)', 
    bg: 'bg-[#3E2723]', 
    card: 'bg-[#4E342E]', 
    primary: 'text-[#FFCC80]', 
    primaryHex: '#FFCC80',
    primaryBg: 'bg-[#E65100]', // 更深的爐火橘
    primaryBorder: 'border-[#E65100]',
    accent: 'text-[#A5D6A7]', // 藥草綠
    accentHex: '#A5D6A7',
    hover: 'hover:bg-[#5D4037]',
    subText: 'text-[#D7CCC8]',
    border: 'border-[#8D6E63]',
    danger: 'text-[#FFAB91]',
    dangerBg: 'bg-[#3E2723]',
    navActive: 'text-[#FFCC80]',
    navInactive: 'text-[#A1887F]',
    selection: 'selection:bg-[#E65100] selection:text-[#FFFFFF]',
    isDark: true
  }
};