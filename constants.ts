
import { Chef, MenuItem, Order, Box, PromoCode, ContactSettings } from './types';

export const MENU_CATEGORIES = ["الكل", "مشويات", "محاشي", "طواجن", "أكل شعبي", "حلويات"];

export const INITIAL_CHEFS: Chef[] = [
  {
    id: 1,
    name: "ماما فاطمة",
    specialty: "محاشي وممبار",
    rating: 4.9,
    reviews: 120,
    orders: "1.2k",
    img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=500",
    bio: "خبرة 30 سنة في عمايل المحشي والممبار، الطعم اللي يرجعك لبيت العيلة.",
    cover: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2574&auto=format&fit=crop",
    isOpen: true,
    workingHours: "12 م - 11 م",
    deliveryTime: "60-90 دقيقة",
    badges: ["الأكثر طلباً 🏆", "سريعة التحضير ⚡"]
  },
  {
    id: 2,
    name: "شيف حسن",
    specialty: "طواجن ومشويات",
    rating: 4.8,
    reviews: 95,
    orders: "850",
    img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500",
    bio: "أحلى طواجن فخار معمولة على أصولها، وتتبيلات سرية للمشويات.",
    cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop",
    isOpen: true,
    workingHours: "1 م - 12 ص",
    deliveryTime: "45-60 دقيقة",
    badges: ["مشويات أصلية 🔥"]
  },
  {
    id: 3,
    name: "الست أميرة",
    specialty: "معجنات وفطائر",
    rating: 4.9,
    reviews: 150,
    orders: "2k",
    img: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=500",
    bio: "فطير مشلتت بالسمنة البلدي وبيتزا بيتي هشة وطرية.",
    cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop",
    isOpen: false,
    workingHours: "9 ص - 5 م",
    deliveryTime: "60 دقيقة",
    badges: ["توب شيف 🌟", "عجين بيتي 🥯"]
  },
  {
    id: 4,
    name: "خالة نادية",
    specialty: "أكل بيتي مصري",
    rating: 4.7,
    reviews: 80,
    orders: "600",
    img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=500",
    bio: "ملوخية بالأرانب، بط بالمرتة، وكل الأكل المصري الأصيل.",
    cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop",
    isOpen: true,
    workingHours: "12 م - 10 م",
    deliveryTime: "90 دقيقة",
    badges: ["أكل زمان 🥘"]
  },
  {
    id: 5,
    name: "الشيف أحمد",
    specialty: "حلويات شرقية",
    rating: 4.8,
    reviews: 110,
    orders: "900",
    img: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=500",
    bio: "بسبوسة، كنافة، وقطايف زي بتاعة زمان، بالسمنة البلدي.",
    cover: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=2671&auto=format&fit=crop",
    isOpen: true,
    workingHours: "10 ص - 10 م",
    deliveryTime: "40 دقيقة",
    badges: ["حلو شرقي 🍯"]
  },
  {
    id: 6,
    name: "ماما زينب",
    specialty: "أكلات بحرية",
    rating: 4.9,
    reviews: 200,
    orders: "1.5k",
    img: "https://images.unsplash.com/photo-1544124339-da6491f04a33?auto=format&fit=crop&q=80&w=500",
    bio: "أحلى صواني سمك وجمبري، شوربة سي فود، ورز صيادية.",
    cover: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=2574&auto=format&fit=crop",
    isOpen: false,
    workingHours: "11 ص - 9 م",
    deliveryTime: "60-80 دقيقة",
    badges: ["سي فود طازة 🦐"]
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
    { id: 501, name: "نص تيس مندي", price: 850, category: "مشويات", categoryId: 'lunch', chef: "شيف حسن", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=2535&auto=format&fit=crop", rating: 4.9, time: "120 د" },
    { id: 502, name: "كيلو كفتة حاتي", price: 320, category: "مشويات", categoryId: 'lunch', chef: "شيف حسن", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2070&auto=format&fit=crop", rating: 4.7, time: "45 د" },
    { id: 503, name: "فراخ مشوية على الفحم", price: 190, category: "مشويات", categoryId: 'lunch', chef: "ماما فاطمة", img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2070&auto=format&fit=crop", rating: 4.8, time: "60 د" },
    { id: 504, name: "طاجن ورق عنب بالكوارع", price: 280, category: "محاشي", categoryId: 'lunch', chef: "ماما فاطمة", img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=2670&auto=format&fit=crop", rating: 5.0, time: "70 د" },
    { id: 505, name: "محشي كرنب بيتي", price: 120, category: "محاشي", categoryId: 'lunch', chef: "خالة نادية", img: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070&auto=format&fit=crop", rating: 4.9, time: "50 د" },
    { id: 506, name: "مسقعة باللحمة المفرومة", price: 95, category: "أكل شعبي", categoryId: 'lunch', chef: "الست أميرة", img: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=2670&auto=format&fit=crop", rating: 4.6, time: "40 د" },
    { id: 507, name: "طاجن بامية باللحمة الضاني", price: 210, category: "طواجن", categoryId: 'lunch', chef: "خالة نادية", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop", rating: 4.9, time: "60 د" },
    { id: 508, name: "حمام محشي فريك", price: 160, category: "أكل شعبي", categoryId: 'lunch', chef: "ماما زينب", img: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=2574&auto=format&fit=crop", rating: 4.9, time: "50 د" },
    { id: 509, name: "رز معمر بالقشطة", price: 85, category: "طواجن", categoryId: 'lunch', chef: "الست أميرة", img: "https://images.unsplash.com/photo-1627308595186-e8abbd468205?q=80&w=2574&auto=format&fit=crop", rating: 4.8, time: "45 د" },
    { id: 510, name: "بسبوسة بالمكسرات", price: 90, category: "حلويات", categoryId: 'desserts', chef: "الشيف أحمد", img: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=500", rating: 4.9, time: "30 د" },
    { id: 511, name: "كنافة نابلسية", price: 110, category: "حلويات", categoryId: 'desserts', chef: "الشيف أحمد", img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=2671&auto=format&fit=crop", rating: 4.8, time: "35 د" },
    { id: 512, name: "كشري مصري", price: 60, category: "أكل شعبي", categoryId: 'lunch', chef: "ماما زينب", img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=500", rating: 4.7, time: "30 د" },
    { id: 513, name: "فطير مشلتت بالسمنة", price: 150, category: "أكل شعبي", categoryId: 'breakfast', chef: "الست أميرة", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop", rating: 5.0, time: "60 د" },
    { id: 514, name: "صينية جمبري بالزبدة", price: 380, category: "أكل شعبي", categoryId: 'lunch', chef: "ماما زينب", img: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=2574&auto=format&fit=crop", rating: 4.9, time: "50 د" },
    { id: 515, name: "حواوشي اسكندراني", price: 80, category: "أكل شعبي", categoryId: 'lunch', chef: "شيف حسن", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop", rating: 4.8, time: "30 د" },
    { id: 516, name: "أم علي بالمكسرات", price: 65, category: "حلويات", categoryId: 'desserts', chef: "الشيف أحمد", img: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000&auto=format&fit=crop", rating: 4.7, time: "25 د" },
    { id: 517, name: "ممبار بلدي", price: 180, category: "محاشي", categoryId: 'lunch', chef: "ماما فاطمة", img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=500", rating: 4.9, time: "60 د" },
    { id: 518, name: "فتة كوارع بالخل والثوم", price: 250, category: "طواجن", categoryId: 'lunch', chef: "خالة نادية", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop", rating: 4.8, time: "50 د" },
];

export const INITIAL_OFFERS: MenuItem[] = [
  { id: 201, name: "عرض العيلة (محشي + بط)", chef: "ماما فاطمة", chefImg: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=500", oldPrice: 850, price: 650, img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop", discount: "25%" },
  { id: 202, name: "بوكس التوفير (مكرونة + بانيه)", chef: "الست أميرة", chefImg: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=500", oldPrice: 200, price: 150, img: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070&auto=format&fit=crop", discount: "25%" },
  { id: 203, name: "صينية سمك للعزومات", chef: "ماما زينب", chefImg: "https://images.unsplash.com/photo-1544124339-da6491f04a33?auto=format&fit=crop&q=80&w=500", oldPrice: 500, price: 380, img: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=2574&auto=format&fit=crop", discount: "20%" },
];

export const INITIAL_BOXES: Box[] = [
  {
    id: 801,
    name: "بوكس الفطار المصري",
    category: "فطار",
    categoryId: 'breakfast',
    price: 180,
    chef: "غدوة",
    serves: "4 أفراد",
    items: ["فول بالزيت الحار", "طعمية بيتي", "جبنة بالطماطم", "بيض مدحرج", "بتنجان مخلل", "عيش بلدي"],
    img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=2574&auto=format&fit=crop",
    color: "from-yellow-500 to-amber-600",
    accent: "bg-yellow-50 text-yellow-700",
    badge: "فطار ملوكي 👑"
  },
  {
    id: 802,
    name: "بوكس الحلو الشرقي",
    category: "حلويات",
    categoryId: 'desserts',
    price: 220,
    chef: "غدوة",
    serves: "6 أفراد",
    items: ["بسبوسة بالقشطة", "كنافة نابلسية", "قطايف بالمكسرات", "أصابع زينب", "زلابية"],
    img: "https://images.unsplash.com/photo-1599708153386-dc36e39257d0?q=80&w=2574&auto=format&fit=crop",
    color: "from-pink-500 to-rose-600",
    accent: "bg-pink-50 text-pink-700",
    badge: "حلّي يومك 🧁"
  },
  {
    id: 803,
    name: "بوكس الغداء التوفير",
    category: "غداء",
    categoryId: 'lunch',
    price: 350,
    chef: "غدوة",
    serves: "3 أفراد",
    items: ["صينية مكرونة بشاميل", "نص فرخة محمرة", "شوربة لسان عصفور", "سلطة خضراء"],
    img: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070&auto=format&fit=crop",
    color: "from-orange-500 to-red-600",
    accent: "bg-orange-50 text-orange-700",
    badge: "أكثر مبيعاً 🔥"
  },
   {
    id: 804,
    name: "بوكس المشاوي",
    category: "غداء",
    categoryId: 'lunch',
    price: 650,
    chef: "غدوة",
    serves: "5 أفراد",
    items: ["كيلو كفتة", "نص طرب", "نص شيش", "رز بسمتي", "طحينة", "عيش"],
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    color: "from-red-600 to-red-800",
    accent: "bg-red-50 text-red-700",
    badge: "لعشاق اللحوم 🍖"
  }
];

export const INITIAL_BEST_SELLERS: MenuItem[] = [
    { id: 301, name: "محشي مشكل", chef: "ماما فاطمة", price: 150, category: "محاشي", desc: "باذنجان، كوسة، وفلفل بخلطة الرز السرية والبهارات.", img: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070&auto=format&fit=crop" },
    { id: 302, name: "مكرونة بشاميل", chef: "شيف حسن", price: 120, category: "طواجن", desc: "مكرونة قلم مع لحمة مفرومة بلدي وصوص بشاميل غني.", img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=2670&auto=format&fit=crop" },
    { id: 303, name: "ملوخية وفراخ", chef: "خالة نادية", price: 180, category: "أكل مصري", desc: "نص فرخة محمرة بالسمنة مع طبق ملوخية بطشة الكزبرة.", img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2070&auto=format&fit=crop" },
    { id: 304, name: "مسقعة باللحمة", chef: "الست أميرة", price: 90, category: "أكل شعبي", desc: "باذنجان رومي مقلي مع عصاج وصلصة طماطم مسبكة.", img: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=2670&auto=format&fit=crop" },
    { id: 305, name: "كشري مصري", chef: "ماما زينب", price: 60, category: "أكل شعبي", desc: "عدس، رز، ومكرونة مع صلصة ودقة وشطة حسب الطلب.", img: "https://images.unsplash.com/photo-1627308595186-e8abbd468205?q=80&w=2574&auto=format&fit=crop" },
    { id: 306, name: "فتة كوارع", chef: "شيف حسن", price: 250, category: "طواجن", desc: "فتة بالخل والثوم مع قطع كوارع مخلية ودايبة.", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop" },
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
    { id: 1, code: 'WELCOME10', value: 10, type: 'percentage', createdAt: '2024-05-20' },
    { id: 2, code: 'GHADWA20', value: 20, type: 'fixed', createdAt: '2024-05-21' }
];

export const INITIAL_CONTACT_SETTINGS: ContactSettings = {
    phone: "01000000000",
    whatsapp: "201109318581",
    email: "hello@ghadwa.com",
    address: "المعادي، القاهرة، مصر",
    facebookUrl: "#",
    instagramUrl: "#",
    tiktokUrl: "#"
};
