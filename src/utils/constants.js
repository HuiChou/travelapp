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
  Calendar, Tag, ChevronDown, Divide, Share2, Sparkles, Scroll, Feather
} from 'lucide-react';

// --- Icon Registry ---
export const ICON_REGISTRY = {
  Camera, Utensils, Coffee, Train, Hotel, MapPin, Plane, 
  ShoppingBag, Coins, Bus, Car, Ship, Ticket, Palmtree, 
  Tent, Music, Gamepad2, Gift, Shirt, Briefcase, Smartphone, 
  Laptop, Anchor, Umbrella, Sun, Moon, Star, Heart, Smile,
  Flower2, Luggage, Calculator, Wallet, Receipt, Star, 
  Sparkles, Scroll, Feather
};

export const getIconComponent = (iconName) => ICON_REGISTRY[iconName] || Camera;

// --- Google API ---
export const GOOGLE_CLIENT_ID = "456137719976-dp4uin8ae10f332qbhqm447nllr2u4ec.apps.googleusercontent.com";

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

// --- Magical & Vintage Category Colors ---
export const CATEGORY_COLORS = [
  'bg-[#E3DAC9]', // Bone
  'bg-[#D4C5A5]', // Parchment Dark
  'bg-[#C0B283]', // Antique Gold
  'bg-[#D8CAB8]', // Dust
  'bg-[#E6D0CE]', // Faded Red
  'bg-[#CED4DA]', // Silver
  'bg-[#D1E8E2]', // Pale Magic
  'bg-[#D4AF37]', // Gold
  'bg-[#A8B6BF]', // Fog
  'bg-[#BFA5A5]', // Dried Rose
  'bg-[#9E9E9E]', // Stone
  'bg-[#8FBC8F]', // Herbology
  'bg-[#E0FFFF]', // Lumos
  'bg-[#FFE4E1]', // Love Potion
];

// --- Hogwarts House & Magic Avatar Colors ---
export const AVATAR_COLORS = [
  'bg-[#740001]', // Gryffindor Red
  'bg-[#1A472A]', // Slytherin Green
  'bg-[#0E1A40]', // Ravenclaw Blue
  'bg-[#ECB939]', // Hufflepuff Yellow
  'bg-[#5D5D5D]', // Iron/Dark Grey
  'bg-[#4A2E79]', // Deep Magic Purple
  'bg-[#800020]', // Burgundy
  'bg-[#2F4F4F]', // Dark Slate
  'bg-[#B8860B]', // Dark Goldenrod
  'bg-[#483C32]', // Taupe/Owl
  'bg-[#380E38]', // Forbidden Forest Dark
  'bg-[#5C0922]', // Crimson
];

export const COUNTRY_OPTIONS = [
  { code: 'JP', name: '日本', flag: '🇯🇵', currency: 'JPY', symbol: '¥', defaultRate: 0.20 },
  { code: 'KR', name: '韓國', flag: '🇰🇷', currency: 'KRW', symbol: '₩', defaultRate: 0.024 },
  { code: 'TH', name: '泰國', flag: '🇹🇭', currency: 'THB', symbol: '฿', defaultRate: 0.90 },
  { code: 'US', name: '美國', flag: '🇺🇸', currency: 'USD', symbol: '$', defaultRate: 31.5 },
  { code: 'MY', name: '馬來西亞', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', defaultRate: 6.8 },
  { code: 'UK', name: '英國', flag: '🇬🇧', currency: 'GBP', symbol: '£', defaultRate: 40.5 },
];

export const THEMES = {
  magic: { 
    id: 'magic',
    label: '魔法', 
    bg: 'bg-[#F2E8C4]', // 羊皮紙色 (Parchment)
    card: 'bg-[#FFFCF5]', // 象牙白紙張
    primary: 'text-[#740001]', // 葛來分多深紅
    primaryHex: '#740001',
    primaryBg: 'bg-[#740001]',
    primaryBorder: 'border-[#740001]',
    accent: 'text-[#D4AF37]', // 金探子金
    accentHex: '#D4AF37',
    hover: 'hover:bg-[#E6DCC3]',
    subText: 'text-[#5C5548]', // 墨水灰褐
    border: 'border-[#C0B283]', // 古董金邊框
    danger: 'text-[#8B0000]',
    dangerBg: 'bg-[#FFE5E5]',
    navActive: 'text-[#740001]',
    navInactive: 'text-[#8C867A]',
    selection: 'selection:bg-[#D4AF37] selection:text-[#2A2A2A]'
  },
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