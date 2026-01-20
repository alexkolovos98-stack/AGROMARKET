// Mock data for AgroPlaza - Agricultural Price Comparison Platform
// Each product has multiple offers from different stores

export const categories = [
  {
    id: 1,
    name: "Σπόροι & Φυτά",
    nameEn: "Seeds & Plants",
    icon: "Sprout",
    image: "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
    count: 12450
  },
  {
    id: 2,
    name: "Λιπάσματα",
    nameEn: "Fertilizers",
    icon: "FlaskConical",
    image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
    count: 8320
  },
  {
    id: 3,
    name: "Συστήματα Άρδευσης",
    nameEn: "Irrigation Systems",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    count: 4230
  },
  {
    id: 4,
    name: "Ζωοτροφές",
    nameEn: "Animal Feed",
    icon: "Wheat",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
    count: 6780
  },
  {
    id: 5,
    name: "Θερμοκήπια",
    nameEn: "Greenhouses",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
    count: 2340
  },
  {
    id: 6,
    name: "Φυτοφάρμακα",
    nameEn: "Pesticides",
    icon: "Bug",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    count: 3560
  },
  {
    id: 7,
    name: "Εργαλεία Κήπου",
    nameEn: "Garden Tools",
    icon: "Shovel",
    image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400",
    count: 9120
  }
];

export const topCategories = [
  { id: 1, name: "Προσφορές", icon: "Tag", color: "#e74c3c" },
  { id: 2, name: "Σπόροι", icon: "Sprout", color: "#27ae60" },
  { id: 3, name: "Άρδευση", icon: "Droplets", color: "#00bcd4" },
  { id: 4, name: "Θερμοκήπια", icon: "Home", color: "#9b59b6" },
  { id: 5, name: "Ζωοτροφές", icon: "Wheat", color: "#e67e22" },
  { id: 6, name: "Φυτοφάρμακα", icon: "Bug", color: "#e91e63" },
  { id: 7, name: "Λιπάσματα", icon: "FlaskConical", color: "#3498db" }
];

// Stores/Shops data
export const shops = [
  { id: 1, name: "ΑγροΤεχνική ΕΠΕ", rating: 4.9, products: 1250, location: "Θεσσαλονίκη", url: "https://agrotechniki.example.com" },
  { id: 2, name: "Hydro Systems", rating: 4.8, products: 890, location: "Λάρισα", url: "https://hydrosystems.example.com" },
  { id: 3, name: "GreenHouse Pro", rating: 4.7, products: 560, location: "Αθήνα", url: "https://greenhousepro.example.com" },
  { id: 4, name: "AgroFert ΑΕ", rating: 4.9, products: 2340, location: "Πάτρα", url: "https://agrofert.example.com" },
  { id: 5, name: "SeedMaster", rating: 4.6, products: 3450, location: "Ηράκλειο", url: "https://seedmaster.example.com" },
  { id: 6, name: "SprayTech", rating: 4.5, products: 780, location: "Καβάλα", url: "https://spraytech.example.com" },
  { id: 7, name: "FarmSupply", rating: 4.7, products: 1890, location: "Βόλος", url: "https://farmsupply.example.com" },
  { id: 8, name: "AgroCenter", rating: 4.8, products: 2100, location: "Ιωάννινα", url: "https://agrocenter.example.com" }
];

// Products with multiple store offers (price comparison model)
export const products = [
  {
    id: 1,
    name: "Σπόροι Ντομάτας Belladonna F1",
    description: "Υβριδική ποικιλία ντομάτας υψηλής απόδοσης. Ανθεκτική σε ασθένειες, κατάλληλη για θερμοκήπιο και υπαίθρια καλλιέργεια. Συσκευασία 1000 σπόρων.",
    image: "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
    category: "Σπόροι & Φυτά",
    categoryId: 1,
    brand: "SeedCorp",
    specs: {
      "Τύπος": "Υβρίδιο F1",
      "Ποσότητα": "1000 σπόροι",
      "Βλαστικότητα": "95%+",
      "Κατάλληλο για": "Θερμοκήπιο/Υπαίθρια"
    },
    rating: 4.5,
    reviewCount: 178,
    offers: [
      { shopId: 5, price: 12.50, originalPrice: 15.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://seedmaster.example.com/product/123" },
      { shopId: 1, price: 13.20, originalPrice: 15.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrotechniki.example.com/product/456" },
      { shopId: 4, price: 14.00, originalPrice: null, availability: "Διαθέσιμο", shipping: "3-4 ημέρες", url: "https://agrofert.example.com/product/789" },
      { shopId: 7, price: 14.50, originalPrice: 16.00, availability: "Τελευταία τεμάχια", shipping: "2-3 ημέρες", url: "https://farmsupply.example.com/product/101" }
    ]
  },
  {
    id: 2,
    name: "Σύστημα Στάγδην Άρδευσης 1000m²",
    description: "Ολοκληρωμένο σύστημα στάγδην άρδευσης για κήπο ή αγρό έως 1000τμ. Περιλαμβάνει σωλήνες, σταλάκτες, συνδέσμους και φίλτρο.",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    category: "Συστήματα Άρδευσης",
    categoryId: 3,
    brand: "IrriTech",
    specs: {
      "Κάλυψη": "1000 m²",
      "Μήκος σωλήνα": "500m",
      "Σταλάκτες": "200 τεμ.",
      "Πίεση λειτουργίας": "1-3 bar"
    },
    rating: 4.6,
    reviewCount: 89,
    offers: [
      { shopId: 2, price: 450.00, originalPrice: 520.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://hydrosystems.example.com/product/234" },
      { shopId: 1, price: 465.00, originalPrice: 520.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrotechniki.example.com/product/567" },
      { shopId: 8, price: 480.00, originalPrice: null, availability: "Διαθέσιμο", shipping: "3-5 ημέρες", url: "https://agrocenter.example.com/product/890" }
    ]
  },
  {
    id: 3,
    name: "Θερμοκήπιο Tunnel 6x30m",
    description: "Επαγγελματικό θερμοκήπιο τύπου tunnel με γαλβανισμένο σκελετό. Κάλυψη με διπλό πολυαιθυλένιο UV σταθεροποιημένο.",
    image: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
    category: "Θερμοκήπια",
    categoryId: 5,
    brand: "GreenStruct",
    specs: {
      "Διαστάσεις": "6m x 30m",
      "Ύψος κορυφής": "3.5m",
      "Σκελετός": "Γαλβανισμένος χάλυβας",
      "Κάλυψη": "Διπλό PE UV"
    },
    rating: 4.9,
    reviewCount: 56,
    offers: [
      { shopId: 3, price: 2800.00, originalPrice: 3200.00, availability: "Διαθέσιμο", shipping: "5-7 ημέρες", url: "https://greenhousepro.example.com/product/345" },
      { shopId: 1, price: 2950.00, originalPrice: 3200.00, availability: "Κατόπιν παραγγελίας", shipping: "10-15 ημέρες", url: "https://agrotechniki.example.com/product/678" },
      { shopId: 8, price: 3100.00, originalPrice: null, availability: "Διαθέσιμο", shipping: "7-10 ημέρες", url: "https://agrocenter.example.com/product/901" }
    ]
  },
  {
    id: 4,
    name: "Λίπασμα NPK 20-20-20 25kg",
    description: "Ισορροπημένο κοκκώδες λίπασμα γενικής χρήσης. Κατάλληλο για όλες τις καλλιέργειες. Υψηλή περιεκτικότητα σε θρεπτικά στοιχεία.",
    image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
    category: "Λιπάσματα",
    categoryId: 2,
    brand: "NutriGrow",
    specs: {
      "Σύνθεση": "N-P-K 20-20-20",
      "Βάρος": "25 kg",
      "Μορφή": "Κοκκώδες",
      "Εφαρμογή": "Βασική/Επιφανειακή"
    },
    rating: 4.7,
    reviewCount: 234,
    offers: [
      { shopId: 4, price: 38.00, originalPrice: 45.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrofert.example.com/product/456" },
      { shopId: 1, price: 39.50, originalPrice: 45.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrotechniki.example.com/product/789" },
      { shopId: 7, price: 40.00, originalPrice: null, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://farmsupply.example.com/product/012" },
      { shopId: 8, price: 41.00, originalPrice: 45.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://agrocenter.example.com/product/345" }
    ]
  },
  {
    id: 5,
    name: "Ψεκαστήρας Πλάτης 16L Μπαταρίας",
    description: "Επαναφορτιζόμενος ψεκαστήρας πλάτης με δοχείο 16 λίτρων. Μπαταρία λιθίου μεγάλης διάρκειας. Ιδανικός για φυτοφάρμακα και λιπάσματα.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    category: "Φυτοφάρμακα",
    categoryId: 6,
    brand: "SprayMaster",
    specs: {
      "Χωρητικότητα": "16 L",
      "Μπαταρία": "12V Lithium",
      "Αυτονομία": "4-5 ώρες",
      "Πίεση": "2-4 bar"
    },
    rating: 4.4,
    reviewCount: 312,
    offers: [
      { shopId: 6, price: 65.00, originalPrice: 75.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://spraytech.example.com/product/567" },
      { shopId: 1, price: 68.00, originalPrice: 75.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrotechniki.example.com/product/890" },
      { shopId: 7, price: 69.90, originalPrice: null, availability: "Τελευταία τεμάχια", shipping: "2-3 ημέρες", url: "https://farmsupply.example.com/product/123" }
    ]
  },
  {
    id: 6,
    name: "Ζωοτροφή Αγελάδων Premium 50kg",
    description: "Πλήρης σύνθετη ζωοτροφή για γαλακτοπαραγωγές αγελάδες. Υψηλή περιεκτικότητα σε πρωτεΐνες και ενέργεια για μέγιστη απόδοση.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
    category: "Ζωοτροφές",
    categoryId: 4,
    brand: "FeedPro",
    specs: {
      "Βάρος": "50 kg",
      "Πρωτεΐνη": "18%",
      "Ενέργεια": "2800 kcal/kg",
      "Τύπος": "Pellet"
    },
    rating: 4.6,
    reviewCount: 98,
    offers: [
      { shopId: 7, price: 28.00, originalPrice: 32.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://farmsupply.example.com/product/234" },
      { shopId: 1, price: 29.50, originalPrice: 32.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://agrotechniki.example.com/product/567" },
      { shopId: 8, price: 30.00, originalPrice: null, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://agrocenter.example.com/product/890" }
    ]
  },
  {
    id: 7,
    name: "Σετ Εργαλείων Κήπου 12 τεμ.",
    description: "Πλήρες σετ εργαλείων κήπου από ανοξείδωτο ατσάλι. Περιλαμβάνει φτυάρι, τσουγκράνα, ψαλίδι κλαδέματος και άλλα απαραίτητα εργαλεία.",
    image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400",
    category: "Εργαλεία Κήπου",
    categoryId: 7,
    brand: "GardenPro",
    specs: {
      "Τεμάχια": "12",
      "Υλικό": "Ανοξείδωτο ατσάλι",
      "Λαβές": "Εργονομικές",
      "Θήκη": "Ναι"
    },
    rating: 4.7,
    reviewCount: 156,
    offers: [
      { shopId: 7, price: 45.00, originalPrice: 55.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://farmsupply.example.com/product/345" },
      { shopId: 1, price: 47.90, originalPrice: 55.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://agrotechniki.example.com/product/678" },
      { shopId: 8, price: 49.00, originalPrice: null, availability: "Τελευταία τεμάχια", shipping: "3-4 ημέρες", url: "https://agrocenter.example.com/product/901" }
    ]
  },
  {
    id: 8,
    name: "Αντλία Νερού Υποβρύχια 1HP",
    description: "Υποβρύχια αντλία νερού 1HP για γεωτρήσεις και πηγάδια. Ανοξείδωτη κατασκευή, υψηλή απόδοση και χαμηλή κατανάλωση ενέργειας.",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    category: "Συστήματα Άρδευσης",
    categoryId: 3,
    brand: "AquaPump",
    specs: {
      "Ισχύς": "1 HP (750W)",
      "Παροχή": "5000 L/h",
      "Μανομετρικό": "45m",
      "Υλικό": "Inox 304"
    },
    rating: 4.8,
    reviewCount: 89,
    offers: [
      { shopId: 2, price: 185.00, originalPrice: 220.00, availability: "Διαθέσιμο", shipping: "2-3 ημέρες", url: "https://hydrosystems.example.com/product/456" },
      { shopId: 1, price: 195.00, originalPrice: 220.00, availability: "Διαθέσιμο", shipping: "1-2 ημέρες", url: "https://agrotechniki.example.com/product/789" },
      { shopId: 8, price: 199.00, originalPrice: null, availability: "Κατόπιν παραγγελίας", shipping: "5-7 ημέρες", url: "https://agrocenter.example.com/product/012" }
    ]
  }
];

// For backward compatibility and simpler listing views
export const featuredProducts = products.map(p => ({
  id: p.id,
  name: p.name,
  image: p.image,
  category: p.category,
  categoryId: p.categoryId,
  rating: p.rating,
  reviews: p.reviewCount,
  // Price from cheapest offer
  price: Math.min(...p.offers.map(o => o.price)),
  originalPrice: p.offers[0].originalPrice,
  offerCount: p.offers.length,
  // Lowest price shop
  lowestPriceShop: shops.find(s => s.id === p.offers.reduce((min, o) => o.price < min.price ? o : min, p.offers[0]).shopId)?.name
}));

export const popularSearches = [
  "σπόροι ντομάτας",
  "λίπασμα βιολογικό",
  "σύστημα στάγδην",
  "θερμοκήπιο tunnel",
  "ψεκαστήρας ηλεκτρικός",
  "ζωοτροφές κοτόπουλα",
  "φρέζα κήπου",
  "αντλία νερού",
  "βαμβάκι σπόροι",
  "γεωργικά εφόδια",
  "άρδευση σταγόνας",
  "λαχανικά σπόροι",
  "ζιζανιοκτόνο",
  "εντομοκτόνο",
  "μυκητοκτόνο"
];

export const manufacturers = [
  { id: 1, name: "John Deere", logo: "JD" },
  { id: 2, name: "Kubota", logo: "KB" },
  { id: 3, name: "New Holland", logo: "NH" },
  { id: 4, name: "Massey Ferguson", logo: "MF" },
  { id: 5, name: "STIHL", logo: "ST" },
  { id: 6, name: "Husqvarna", logo: "HQ" },
  { id: 7, name: "Gardena", logo: "GD" },
  { id: 8, name: "Honda", logo: "HD" }
];

// Deals - Time-limited offers derived from products with discounts
export const deals = [
  {
    id: 101,
    name: "Σπόροι Ντομάτας Belladonna F1",
    image: "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
    price: 12.50,
    originalPrice: 15.00,
    discount: 17,
    endsIn: "2 ημέρες"
  },
  {
    id: 102,
    name: "Σύστημα Στάγδην Άρδευσης 1000m²",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    price: 450.00,
    originalPrice: 520.00,
    discount: 13,
    endsIn: "5 ημέρες"
  },
  {
    id: 103,
    name: "Θερμοκήπιο Tunnel 6x30m",
    image: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
    price: 2800.00,
    originalPrice: 3200.00,
    discount: 12,
    endsIn: "3 ημέρες"
  },
  {
    id: 104,
    name: "Λίπασμα NPK 20-20-20 25kg",
    image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
    price: 38.00,
    originalPrice: 45.00,
    discount: 16,
    endsIn: "1 ημέρα"
  }
];
