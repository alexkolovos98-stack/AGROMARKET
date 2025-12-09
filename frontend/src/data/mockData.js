// Mock data for AgroSkroutz - Agricultural Marketplace for Farmers

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
  { id: 6, name: "Λιπάσματα", icon: "FlaskConical", color: "#3498db" }
];

export const featuredProducts = [
  {
    id: 1,
    name: "Τρακτέρ John Deere 5075E 75HP",
    image: "https://images.unsplash.com/photo-1614977645540-7abd88ba8e56?w=400",
    price: 28500,
    originalPrice: 32000,
    rating: 4.8,
    reviews: 127,
    shop: "ΑγροΤεχνική ΕΠΕ",
    category: "Γεωργικά Μηχανήματα",
    isNew: true,
    discount: 11
  },
  {
    id: 2,
    name: "Σύστημα Στάγδην Άρδευσης 1000m²",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    price: 450,
    originalPrice: 520,
    rating: 4.6,
    reviews: 89,
    shop: "Hydro Systems",
    category: "Συστήματα Άρδευσης",
    isNew: false,
    discount: 13
  },
  {
    id: 3,
    name: "Θερμοκήπιο Tunnel 6x30m",
    image: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviews: 56,
    shop: "GreenHouse Pro",
    category: "Θερμοκήπια",
    isNew: true,
    discount: 12
  },
  {
    id: 4,
    name: "Λίπασμα NPK 20-20-20 25kg",
    image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
    price: 38,
    originalPrice: 45,
    rating: 4.7,
    reviews: 234,
    shop: "AgroFert ΑΕ",
    category: "Λιπάσματα",
    isNew: false,
    discount: 16
  },
  {
    id: 5,
    name: "Σπόροι Ντομάτας Belladonna F1",
    image: "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
    price: 12.50,
    originalPrice: 15,
    rating: 4.5,
    reviews: 178,
    shop: "SeedMaster",
    category: "Σπόροι & Φυτά",
    isNew: false,
    discount: 17
  },
  {
    id: 6,
    name: "Ψεκαστήρας Πλάτης 16L",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    price: 65,
    originalPrice: 75,
    rating: 4.4,
    reviews: 312,
    shop: "SprayTech",
    category: "Φυτοφάρμακα",
    isNew: false,
    discount: 13
  },
  {
    id: 7,
    name: "Ζωοτροφή Αγελάδων Premium 50kg",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
    price: 28,
    originalPrice: 32,
    rating: 4.6,
    reviews: 98,
    shop: "FeedPro",
    category: "Ζωοτροφές",
    isNew: false,
    discount: 12
  },
  {
    id: 8,
    name: "Φρέζα Μοτοκαλλιεργητή 7HP",
    image: "https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=400",
    price: 890,
    originalPrice: 1050,
    rating: 4.8,
    reviews: 67,
    shop: "ΑγροΜηχανική",
    category: "Γεωργικά Μηχανήματα",
    isNew: true,
    discount: 15
  }
];

export const deals = [
  {
    id: 1,
    name: "Πριονοκορδέλα Ηλεκτρική 400W",
    image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400",
    price: 189,
    originalPrice: 249,
    discount: 24,
    endsIn: "2 ημέρες"
  },
  {
    id: 2,
    name: "Σετ Άρδευσης Κήπου 50 τεμ.",
    image: "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
    price: 45,
    originalPrice: 65,
    discount: 31,
    endsIn: "5 ώρες"
  },
  {
    id: 3,
    name: "Λίπασμα Βιολογικό 10kg",
    image: "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
    price: 22,
    originalPrice: 30,
    discount: 27,
    endsIn: "1 ημέρα"
  },
  {
    id: 4,
    name: "Σπόροι Mix Λαχανικών",
    image: "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
    price: 8.90,
    originalPrice: 12,
    discount: 26,
    endsIn: "12 ώρες"
  }
];

export const popularSearches = [
  "τρακτέρ john deere",
  "σπόροι ντομάτας",
  "λίπασμα βιολογικό",
  "σύστημα στάγδην",
  "θερμοκήπιο tunnel",
  "ψεκαστήρας ηλεκτρικός",
  "ζωοτροφές κοτόπουλα",
  "φρέζα κήπου",
  "αντλία νερού",
  "σχάρες τρακτέρ"
];

export const shops = [
  { id: 1, name: "ΑγροΤεχνική ΕΠΕ", rating: 4.9, products: 1250, location: "Θεσσαλονίκη" },
  { id: 2, name: "Hydro Systems", rating: 4.8, products: 890, location: "Λάρισα" },
  { id: 3, name: "GreenHouse Pro", rating: 4.7, products: 560, location: "Αθήνα" },
  { id: 4, name: "AgroFert ΑΕ", rating: 4.9, products: 2340, location: "Πάτρα" },
  { id: 5, name: "SeedMaster", rating: 4.6, products: 3450, location: "Ηράκλειο" },
  { id: 6, name: "SprayTech", rating: 4.5, products: 780, location: "Καβάλα" }
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
