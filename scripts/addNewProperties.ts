// scripts/addNewProperties.ts
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PropertyInput = {
  title: string;
  description: string;
  price: number;
  type: 'SALE' | 'RENT';
  bedrooms: number;
  bathrooms: number;
  bq: number;
  toilets: number;
  area: number | null;
  location: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  images: string[];
  features: string[];
  isFeatured?: boolean;
};

// =====================================
// CRITICAL: DO NOT MODIFY THIS SECTION
// =====================================
// List of featured property titles to preserve
// These are the properties that should remain on the homepage
const featuredPropertyTitles = [
  "Luxury 5 Bedroom Fully Detached Duplex",
  "Contemporary Neatly Furnished 5 bedroom with 2 service quarters",
  "Luxury 6 Bedroom Fully Detached Duplex with Swimming Pool",
  "Elegant 5-Bedroom Fully Detached Duplex with Swimming Pool in a Prime Location",
  "Modern 3-Bedroom Apartment in Lekki Phase 1 with Top-Class Amenities",
  "Massive 8-Bedroom Fully Detached Duplex on 2 Acres"
];
// =====================================

// Add only new non-featured properties here
const newPropertiesToAdd: PropertyInput[] = [
 {
    title: "Newly Built 4-Bedroom Fully Detached Duplex with BQ in Opebi",
    description: "Discover comfort, style, and privacy in this newly built 4-bedroom fully detached duplex, perfectly located inside the serene and secured Awuse Estate, Opebi, Ikeja. This home offers a well-crafted blend of contemporary design and functional living, ideal for families or investors looking for prime Lagos real estate.\n\nAwuse Estate, Opebi, Ikeja – a prime and peaceful area close to major roads, business hubs, and social amenities.\n\nThis is a perfect opportunity for home ownership or investment in one of Ikeja’s most sought-after estates.",
    price: 320000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Opebi, Ikeja",
    latitude: 	6.589719,
    longitude: 3.360950,
    city: "Ikeja",
    state: "Lagos",
    isFeatured: false, // Explicitly set to false for buy page only
    images: [
      "images/properties/sale/bro-abraham/house-1/front-1.jpg",
      "images/properties/sale/bro-abraham/house-1/compound-1.jpg",
      "images/properties/sale/bro-abraham/house-1/living-1.jpg",
      "images/properties/sale/bro-abraham/house-1/kitchen-1.jpg",
      "images/properties/sale/bro-abraham/house-1/kitchen-2.jpg",
      "images/properties/sale/bro-abraham/house-1/kitchen-3.jpg",
      "images/properties/sale/bro-abraham/house-1/room-1.jpg",
      "images/properties/sale/bro-abraham/house-1/room-2.jpg",
      "images/properties/sale/bro-abraham/house-1/toilet-1.jpg",
      "images/properties/sale/bro-abraham/house-1/wardrobe-1.jpg",
      "images/properties/sale/bro-abraham/house-1/stairway-1.jpg",
     
    ],
    features: ["4 spacious all en-suite bedrooms", "1-room Boys’ Quarters (BQ)", "Fully fitted modern kitchen with cabinets and accessories", "POP ceilings with recessed lighting", "Wardrobes in all rooms","Large living and dining area", "Private compound with ample parking", "Secure and well-maintained estate", "Quality finishing and fittings throughout", "Clean water supply and good drainage"],    
  },
  {
    title: " Contemporary 4-Bedroom Fully Detached Duplex with Gym & Communal Swimming Pool",
    description: "Experience elevated living in this exquisitely built 4-bedroom fully detached duplex nestled in a secure and access-controlled estate off Orchid Road, Lekki. Designed for comfort, functionality, and style, this home offers everything you need for luxurious family living.\n\nThis property combines elegance, security, and community amenities, making it perfect for modern families and smart investors.",
    price: 170000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: " Orchid Road, Lekki,Lagos",
    latitude: 	6.446320,
    longitude: 3.477170,
    city: "Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/duchess-homes/house-1/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/front-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-1/living-4.jpeg",
      "images/properties/sale/duchess-homes/house-1/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-1/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-1/room-5.jpeg",
      "images/properties/sale/duchess-homes/house-1/guest-room-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/kitchen-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/bath-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/bath-3.jpeg",
      "images/properties/sale/duchess-homes/house-1/bath-4.jpeg",
      "images/properties/sale/duchess-homes/house-1/bath-5.jpeg",
      "images/properties/sale/duchess-homes/house-1/lounge-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/wardrobe-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/toilet-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/toilet-2.jpeg",
      "images/properties/sale/duchess-homes/house-1/corridor-1.jpeg",
      "images/properties/sale/duchess-homes/house-1/corridor-2.jpeg",
     
    ],
    features: ["Contemporary architectural design with premium finishing", "All rooms en-suite with luxury sanitary wares", "Spacious living room, family lounge & dedicated dining area", "Fully fitted modern kitchen with top-tier appliances", "Gorgeous lighting and motion-sensor stairway lights", "Beautiful wardrobes and quality fittings throughout","Communal swimming pool and gym space","Secure gated estate with access control","Peaceful and family-friendly neighborhood"],
  },
  {
    title: "Luxury 5-Bedroom Fully Detached Duplex with Swimming Pool, BQ & Cinema",
    description: "Step into refined luxury with this gorgeously crafted 5-bedroom fully detached duplex located in the prestigious Lekki County. Built to perfection with high-end finishes and thoughtful design, this property is ideal for both premium living and income-generating investment.\n\nWhether for private use or high-yield rental, this home delivers unmatched elegance, comfort, and value in one of Lagos' most sought-after areas.",
    price: 400000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Lekki County, Lagos",
    latitude: 	6.458985,
    longitude: 3.601521,
    city: "Lekki",
    state: "Lagos",
    isFeatured: false,
    images: [
        "images/properties/sale/duchess-homes/house-2/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/front-3.jpeg",
        "images/properties/sale/duchess-homes/house-2/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/lounge-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-2/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-2/room-5.jpeg",
        "images/properties/sale/duchess-homes/house-2/guest-room-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/entrance-door-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/pool-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/backyard-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-2/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-2/bath-4.jpeg",
        "images/properties/sale/duchess-homes/house-2/bath-5.jpeg",
        "images/properties/sale/duchess-homes/house-2/stairway-1.jpeg",
        "images/properties/sale/duchess-homes/house-2/car-park-1.jpeg",
      
    ],
    features: ["Contemporary modern architecture with superior detailing", "Private swimming pool, cinema room, and BQ", "Expansive living and dining area", "Family lounge for added comfort", "Fully fitted gourmet kitchen","Beautifully designed walk-in closet","Motion sensor stairway lighting","All rooms en-suite with luxury sanitary fittings","Stunning lighting fixtures and ceiling designs","Located in a serene and secured neighborhood"],
  },
    {
        title: "Prime 3-Bedroom Apartment – Perfect for Shortlet or Rental Income",
        description: "Unlock exceptional investment potential with this modern 3-bedroom apartment, perfectly suited for shortlet or long-term rental in the highly desirable Osapa axis of Lekki. Designed with style, comfort, and functionality in mind, this unit offers everything a tenant or guest could desire.\n\nWhether you're an investor looking for rental income or a homeowner seeking modern comfort, this apartment delivers value, convenience, and premium quality.",
        price: 110000000,
        type: "SALE",
        bedrooms: 3,
        bq: 0,
        bathrooms: 3,
        toilets: 4,
        area: null,
        location: "Osapa Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Lekki",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-3/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-3/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-31/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-3/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-3/living-4.jpeg",
        "images/properties/sale/duchess-homes/house-3/living-5.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-5.jpeg",
        "images/properties/sale/duchess-homes/house-3/room-6.jpeg",
        "images/properties/sale/duchess-homes/house-3/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-3/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-3/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-3/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-3/bath-3.jpeg",
        
        ],
        features: ["Contemporary modern architecture with sleek finishes", "Bright and spacious living area with elegant balconies", "Fully fitted kitchen with oven and microwave", "Stylish luxury sanitary ware and alluring lighting", "All rooms en-suite with modern fittings", "Located in a secure estate with 24/7 security", "Situated in a high-demand, serene neighborhood" ],
    },
  {
    title: "Ultra-Modern 5-Bedroom Smart Glasshouse Duplex on 3 Floors – Waterfront, Cinema, & More",
    description: "Live in luxury and technology with this exquisite 3-floor glasshouse duplex, thoughtfully crafted for refined living in one of Lagos’ most prestigious locations. Located in a mini estate with only 6 exclusive homes, this fully automated smart home offers both elegance and next-level convenience.\n\nA curated community of high-level professionals in ICT and Banking.\n\nThis home is not just a residence—it’s a statement. A rare blend of architecture, technology, and lifestyle.",
    price: 850000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Ikoyi, Lagos",
    latitude: 	6.454812,
    longitude: 3.434691,
    city: "Ikoyi",
    state: "Lagos",
    isFeatured: false, 
    images: [
        "images/properties/sale/duchess-homes/house-4/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-4/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-4/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-4/living-4.jpeg",
        "images/properties/sale/duchess-homes/house-4/living-5.jpeg",
        "images/properties/sale/duchess-homes/house-4/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/cinema-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/chandalier-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/pool-1.jpeg",
        "images/properties/sale/duchess-homes/house-4/pool-2.jpeg",
     
    ],
    features: ["Architectural glasshouse masterpiece with a breathtaking waterfront view", "Full smart home automation: Google Nest Hubs, Alexa, smart dashboard, Google WiFi, biometric locks & more", "Expansive family lounge, master's suite with private lounge, island centerpiece, balcony & walk-in closet", "6-seater in-built cinema with 150inches screen and premium leather seats", "Fully fitted and furnished kitchen with 2 pantries, dishwasher, oven, fridge, cutlery warmer & more","All en-suite bedrooms with full-height fitted wardrobes and complimentary air conditioners","Elegant motion sensor stairway lighting, automated curtains/blinds, and luxury chandeliers","Dedicated workstation with bookshelf, laundry room, and additional kitchenette on 1st floor","Swimming pool, communal lounge, and a secure gated mini estate","Top-tier security: CCTV, fire alarms, smoke/water detectors, smart locks, electric fencing","24-hour power via central generator, solar panels, industrial borehole & water treatment plant","Certified documents: Certificate of Occupancy, Contract of Sale, Deed of Assignment, LASBCA fitness certificate, and Lagos State approved solid pile foundation"],
  },
  {
    title: "4-Bedroom Semi-Detached Duplex in Ikota, Lekki",
    description: "Step into refined comfort with this modern 4-bedroom semi-detached duplex, nestled in a secure gated estate in the heart of Ikota. Designed with attention to detail and built for functional luxury, this home offers a blend of elegance and comfort in a serene, well-connected neighborhood.\n\nPerfect for families, investors, or as a dream starter home in Lekki.",
    price: 160000000,
    type: "SALE",
    bedrooms: 4,
    bq: 0,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota Lekki, Lagos",
    latitude: 	6.453056,
    longitude: 3.395833,
    city: "Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/duchess-homes/house-5/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-5/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-5/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-5/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-5/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/kitchen-2.jpeg",
      "images/properties/sale/duchess-homes/house-5/kitchen-3.jpeg",
      "images/properties/sale/duchess-homes/house-5/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/corridor-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/corridor-2.jpeg",
      "images/properties/sale/duchess-homes/house-5/stairway-1.jpeg",
      "images/properties/sale/duchess-homes/house-5/stairway-2.jpeg",
     
    ],
    features: ["Contemporary architecture with luxury modern appurtenances", "Impeccable finishing and beautifully detailed interiors", "Spacious living and dining areas ideal for entertaining", "All rooms en-suite with luxury sanitary fittings", "Fully fitted kitchen with top-quality appliances", "Gorgeous lighting fixtures and tasteful design elements", "Located in a secure, access-controlled estate", "Surrounded by a great neighborhood with easy access to key amenities"],
  },
  {
    title: "5-Bedroom Fully Detached Smart Home with Pool, Cinema, BQ & Elevator",
    description: "Experience true luxury in this exquisitely designed 5-bedroom fully detached duplex, located in the prestigious Lekki County. This masterpiece offers state-of-the-art amenities, premium finishing, and elegant architecture perfect for high-end living.\n\nThis property is ideal for families or investors seeking luxury, functionality, and long-term value in Lekki.",
    price: 700000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Lekki County, Lagos",
    latitude: 	6.458985,
    longitude: 3.601521,
    city: "Lekki",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/duchess-homes/house-6/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/front-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/kitchen-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/bath-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/wardrobe-1-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/stairway-1.jpeg",
      "images/properties/sale/duchess-homes/house-6/stairway-2.jpeg",
      "images/properties/sale/duchess-homes/house-6/pool-1.jpeg",
      
    ],
    features: ["Modern contemporary architecture with sophisticated design", "Expansive living and dining areas for family and entertaining", "Gorgeous lighting and detailed woodwork finishes", "All rooms en-suite for privacy and comfort", "Beautifully fitted kitchen with premium appliances", "Private cinema room for in-home entertainment", "Swimming pool and Boy’s Quarters", "Elevator for effortless movement between floors", "Located in a secure, gated estate with 24/7 security", "Surrounded by a serene and upscale neighborhood"],
  },
    {
        title: " 4-Bedroom Maisonette with Elevator, Communal Pool, Gym & BQ",
        description: "Discover modern elegance in this luxuriously built 4-bedroom maisonette, offering top-tier amenities and breathtaking architectural design in one of Lekki’s most sought-after neighborhoods.\n\nhis property is a perfect blend of class, comfort, and convenience—ideal for family living or short-let investment in Lekki Phase 1.",
        price: 450000000,
        type: "SALE",
        bedrooms: 4,
        bq: 1,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "Lekki Phase 1, Lagos",
        latitude: 	6.447809,
        longitude: 3.472350,
        city: "Lekki",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-7/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-7/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/lounge-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/lounge-3.jpeg",
        "images/properties/sale/duchess-homes/house-7/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-7/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-7/wardrobe-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/wardrobe-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/stairway-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/pool-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/pool-2.jpeg",
        "images/properties/sale/duchess-homes/house-7/pool-3.jpeg",
        "images/properties/sale/duchess-homes/house-7/toilet-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/corridor-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/car-park-1.jpeg",
        "images/properties/sale/duchess-homes/house-7/car-park-2.jpeg",
        
        ],
        features: ["Contemporary modern appurtenances with sleek finishes", "Impeccable architectural detailing throughout", "Spacious living area ideal for comfort and entertaining", "Fully fitted kitchen with high-end appliances", "Stylish motion sensor stairway lights", "All rooms are en-suite with luxury sanitary wares", "Beautiful lighting fixtures that exude class", "Access to communal swimming pool, gym space, and elevator", "Boy’s Quarters (BQ) included","Located in a secure and prestigious neighborhood"],
    },
  {
    title: "Premium 2-Bedroom Apartment with Elevator – Ideal for Shortlet & Rentals",
    description: "This contemporary 2-bedroom apartment is a perfect investment opportunity for short-let and rental income. Designed with modern architecture and located in a prime neighborhood, it offers both comfort and functionality.\n\nWhether for personal use or short-term rental investment, this apartment guarantees excellent value in one of Lekki’s most desirable areas.",
    price: 300000000,
    type: "SALE",
    bedrooms: 2,
    bq: 0,
    bathrooms: 2,
    toilets: 3,
    area: null,
    location: "Lekki Phase 1, Lagos",
    latitude: 	6.447809,
    longitude: 3.472350,
    city: "Lekki",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/duchess-homes/house-8/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-8/front-2.jpeg",
      "images/properties/sale/duchess-homes/house-8/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-8/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-8/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-8/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-8/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-8/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-8/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-8/kitchen-2.jpeg",
      "images/properties/sale/duchess-homes/house-8/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-8/toilet-1.jpeg",
      
    ],
    features: ["Stylish modern design and architecture", "Spacious living area with natural lighting", "Private balconies for relaxation", "Fully fitted kitchen with oven and microwave", "Premium sanitary wares and alluring light fixtures","Elevator access for ease and convenience","24-hour security in a gated, secure estate","Situated in a prestigious and well-connected neighborhood"],
  },
    {
        title: "Outstanding 4-Bedroom Fully Detached Duplex with BQ",
        description: "Experience modern living in this beautifully crafted 4-bedroom fully detached duplex, located in the heart of Ajah, within a serene and secure neighborhood. Designed with attention to detail and upscale features, this home blends elegance, comfort, and functionality.\n\nThis home is ideal for families, professionals, or investors looking for a well-finished modern property in a prime Lekki location.",
        price: 150000000,
        type: "SALE",
        bedrooms: 4,
        bq: 1,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "Ajah Lekki, Lagos",
        latitude: 	6.469620,
        longitude: 3.562870,
        city: "Ajah",
        state: "Lagos",
        isFeatured: false,
        images: [
       "images/properties/sale/duchess-homes/house-9/front-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/living-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/living-2.jpeg",
       "images/properties/sale/duchess-homes/house-9/room-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/room-2.jpeg",
       "images/properties/sale/duchess-homes/house-9/room-3.jpeg",
       "images/properties/sale/duchess-homes/house-9/room-4.jpeg",
       "images/properties/sale/duchess-homes/house-9/kitchen-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/kitchen-2.jpeg",
       "images/properties/sale/duchess-homes/house-9/wardrobe-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/bath-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/bath-2.jpeg",
       "images/properties/sale/duchess-homes/house-9/stairway-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/corridor-1.jpeg",
       "images/properties/sale/duchess-homes/house-9/corridor.jpeg",
       
        ],
        features: ["Outstanding contemporary architecture", "Spacious living area with ambient lighting", "Dining area and Family lounge for entertaining and relaxation", "", "Integrated audio system throughout the home", "Fully equipped modern kitchen with premium fittings", "All rooms en-suite with luxury sanitary wares", "Boy’s Quarters (BQ) included", "High-quality lighting fixtures and finishes", "Located in a secure, gated community", "Surrounded by a well-developed neighborhood"],
    },
    {
        title: "Newly Built 3-Bedroom Terrace Duplex with BQ (Self Compound)",
        description: "Discover comfort, style, and investment potential in this newly built 3-bedroom terrace duplex with a self compound and boys’ quarters. Located in the prime neighborhood of Ikota Lekki, this property offers a modern living experience with impressive rental returns.\n\nWhether you’re a homeowner or an investor looking for high rental yield, this property offers the perfect blend of functionality and profitability.",
        price: 130000000,
        type: "SALE",
        bedrooms: 3,
        bq: 1,
        bathrooms: 3,
        toilets: 4,
        area: null,
        location: "Ikota Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Ikota",
        state: "Lagos",
        isFeatured: false,
        images: [
          "images/properties/sale/duchess-homes/house-10/front-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/living-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/living-2.jpeg",
          "images/properties/sale/duchess-homes/house-10/living-3.jpeg",
          "images/properties/sale/duchess-homes/house-10/room-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/room-2.jpeg",
          "images/properties/sale/duchess-homes/house-10/room-3.jpeg",
          "images/properties/sale/duchess-homes/house-10/room-4.jpeg",
          "images/properties/sale/duchess-homes/house-10/wardrobe-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/kitchen-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/bath-1.jpeg",
          "images/properties/sale/duchess-homes/house-10/bath-2.jpeg",
       
        ],
        features: ["Contemporary architecture with attention to detail", "Impeccable finishing throughout", "Spacious living area and family lounge", "Fully fitted kitchen with premium fixtures", "All rooms en-suite with luxury sanitary wares", "Private self compound with dedicated space"],
    },
    {
        title: "Self Compound 3-Bedroom Terrace duplex",
        description: "This self-compound 3-bedroom terrace duplex is an ideal property for both personal living and real estate investment. Perfectly suited for rental income or shortlet business, it’s located in a secure gated estate within the vibrant Ikota axis of Lekki.\n\nThis property offers both comfort and value, making it a solid opportunity for homeowners and savvy investors",
        price: 120000000,
        type: "SALE",
        bedrooms: 3,
        bq: 1,
        bathrooms: 3,
        toilets: 4,
        area: null,
        location: "Ikota Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Ikota",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-11/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-11/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-11/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-11/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-11/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-11/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/guest-room-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/corridor-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-11/kitchen-2.jpeg",
       
        ],
        features: ["Contemporary modern architecture", "Open-plan gourmet kitchen", "Spacious living area with balcony", "Fully fitted kitchen with premium appliances", "Beautifully crafted wardrobes", "Luxury sanitary wares", "All rooms en-suite", "Stamped concrete flooring", "Gorgeous lighting fixtures", "24hrs power supply", "24hrs security","Located in a serene and secure neighborhood"],
    },
    {
        title: " 4-Bedroom Terrace Duple With Communal Pool & Gym",
        description: "This modern 4-bedroom terrace duplex is situated in the prestigious VGC axis of Lekki, offering both comfort and investment potential. Perfect for shortlet operations or long-term rentals, the property is within a secure gated estate with top-tier amenities and a thriving neighborhood.\n\nThis property combines functionality, modern elegance, and income potential, making it a smart buy for homeowners and investors alike.",
        price: 110000000,
        type: "SALE",
        bedrooms: 4,
        bq: 1,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "VGC lekki, Lagos",
        latitude: 	 6.462051,
        longitude: 3.543320,
        city: "VGC Lekki",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-12/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-12/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/gym-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-12/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-12/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-12/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/toilet-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/stairway-1.jpeg",
        "images/properties/sale/duchess-homes/house-12/stairway-2.jpeg",
        "images/properties/sale/duchess-homes/house-12/pool-1.jpeg",
       
        ],
        features: ["Spacious living area with balcony", "Fully fitted kitchen with quality appliances", "Beautifully crafted wardrobes", "All rooms en-suite", "Luxury sanitary wares", "Communal swimming pool", "Equipped gym space", "24hrs security and electricity", "Secure gated estate in a prime location"],
    },
    {
        title: "Modern 4-Bedroom Semi-Detached Duplex with Pool & Gym",
        description: "Discover comfort, style, and convenience in this beautifully finished 4-bedroom semi-detached duplex, nestled in a secure and serene estate in Ikota, Lekki. With luxurious amenities and spacious interiors, this home is perfect for family living or investment.\n\nWhether you're looking for a comfortable home or a high-yield rental property, this is a perfect choice.",
        price: 150000000,
        type: "SALE",
        bedrooms: 4,
        bq: 0,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "Ikota Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Ikota",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-13/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-13/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-13/living-4.jpeg",
        "images/properties/sale/duchess-homes/house-13/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-13/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-13/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-13/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-13/toilet-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/corridor-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/stairway-1.jpeg",
        "images/properties/sale/duchess-homes/house-13/stairway-2.jpeg",
       
        ],
        features: ["Spacious living area with natural lighting", "Private balcony for relaxation", "Fully fitted modern kitchen", "Elegantly crafted wardrobes", "All rooms en-suite with premium sanitary wares", "Communal swimming pool", "Fully equipped gym", "24-hour security and electricity", "Secure gated estate with great neighborhood appeal"],
    },
    {
        title: "Perfectly Carved 5-Bedroom Luxury Fully Detached Duplex with Swimming Pool & BQ",
        description: "Experience refined living in this exquisitely designed 5-bedroom fully detached duplex, nestled in a secure and well-planned estate in Ajah. From spacious interiors to premium finishes, every detail of this home reflects elegance and functionality.\n\nThis home is a true statement of luxury — ideal for families seeking style, space, and security.",
        price: 250000000,
        type: "SALE",
        bedrooms: 5,
        bq: 1,
        bathrooms: 5,
        toilets: 6,
        area: null,
        location: "Ajah Lekki, Lagos",
        latitude: 	6.469620,
        longitude: 3.562870,
        city: "Ajah",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-14/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/living-3.jpeg",
        "images/properties/sale/duchess-homes/house-14/living-4.jpeg",
        "images/properties/sale/duchess-homes/house-14/living-5.jpeg",
        "images/properties/sale/duchess-homes/house-14/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-14/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-14/room-5.jpeg",
        "images/properties/sale/duchess-homes/house-14/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/kitchen-3.jpeg",
        "images/properties/sale/duchess-homes/house-14/kitchen-4.jpeg",
        "images/properties/sale/duchess-homes/house-14/wardrobe-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-4.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-5.jpeg",
        "images/properties/sale/duchess-homes/house-14/bath-6.jpeg",
        "images/properties/sale/duchess-homes/house-14/corridor-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/corridor-2.jpeg",
        "images/properties/sale/duchess-homes/house-14/pool-1.jpeg",
        "images/properties/sale/duchess-homes/house-14/pool-2.jpeg",
       
        ],
        features: ["Contemporary architecture with impeccable detailing", "Expansive living area and dedicated family lounge", "Elegant dining space", "Fully fitted modern kitchen with high-end appliances", "Beautifully crafted walk-in closet in the master suite", "All bedrooms en-suite with luxury sanitary fittings", "Motion sensor stairway lighting", "Integrated sound system", "Stunning lighting fixtures throughout", "Private swimming pool", "Ample car parking space","Green area for relaxation","Boy’s Quarter","Located in a secure, access-controlled estate","Prime and serene neighborhood"],
    },
    {
        title: "Luxury 4-Bedroom Fully Detached Duplex with Swimming Pool & BQ",
        description: "This perfectly carved 4-bedroom fully detached duplex offers an unmatched blend of sophistication, space, and comfort in one of Lekki’s most desirable neighborhoods. Thoughtfully designed with modern aesthetics and premium features, this home is ideal for discerning homeowners or investors.\n\nWhether for personal use or investment, this home offers exceptional value and lifestyle appeal in the heart of Lekki.",
        price: 220000000,
        type: "SALE",
        bedrooms: 4,
        bq: 1,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "Ajah Lekki, Lagos",
        latitude: 	6.469620,
        longitude: 3.562870,
        city: "Ajah",
        state: "Lagos",
        isFeatured: false,
        images: [
       "images/properties/sale/duchess-homes/house-15/front-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/living-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/lounge-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/room-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/room-2.jpeg",
       "images/properties/sale/duchess-homes/house-15/room-3.jpeg",
       "images/properties/sale/duchess-homes/house-15/room-4.jpeg",
       "images/properties/sale/duchess-homes/house-15/wardrobe-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/kitchen-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/bath-1.jpeg",
       "images/properties/sale/duchess-homes/house-15/bath-2.jpeg",
       "images/properties/sale/duchess-homes/house-15/pool-1.jpeg",
       
        ],
        features: ["Contemporary architecture with sleek finishes", "Spacious living area and family lounge", "Elegant dining space", "Fully fitted modern kitchen with premium cabinetry", "Beautifully carved walk-in closet in the master suite", "All rooms en-suite with luxury sanitary wares", "Motion-sensor stairway lighting", "Integrated sound system", "Private swimming pool", "Ample car parking space", "Beautiful lighting fixtures throughout","Green area for relaxation","Boy’s Quarter (BQ)","Secure gated estate with access control","Prime location in a serene neighborhood"],
    },

];

async function ensureAgentExists(agentId: string, name: string, email: string) {
  try {
    const agent = await prisma.user.upsert({
      where: { id: agentId },
      update: {},
      create: {
        id: agentId,
        name,
        email,
        createdAt: new Date(),
      },
    });
    console.log(`✅ Ensured agent exists: ${agent.name} (ID: ${agent.id})`);
    return agent;
  } catch (error) {
    console.error(`Failed to ensure agent ${agentId}:`, error);
    throw error;
  }
}

async function uploadImageToSupabase(filePath: string): Promise<{ url: string; filePath: string; imageType: string }> {
  const imageType = filePath.split('/')[4]?.split('-')[0]?.toLowerCase() || 'other';
  const supabasePath = filePath;

  try {
    // Check if image exists in Supabase
    const folderPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').pop();
    const { data: listData, error: listError } = await supabase.storage
      .from('properties')
      .list(folderPath);
    if (listError || !listData.some((item) => item.name === fileName)) {
      console.error(`Image not found in Supabase: ${filePath}`);
      return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
    }

    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(supabasePath, 31536000);
    if (error || !data?.signedUrl) {
      console.error(`Failed to create signed URL for ${supabasePath}:`, error?.message);
      return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
    }
    return { url: data.signedUrl, filePath: supabasePath, imageType };
  } catch (error) {
    console.error(`Error processing image ${filePath}:`, error);
    return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
  }
}

async function preserveFeaturedProperties() {
  console.log("Preserving existing featured properties...");
  try {
    // First, reset all properties to non-featured
    await prisma.property.updateMany({
      where: { isfeatured: true },
      data: { isfeatured: false }
    });
    
    // Then set the specified properties back to featured
    for (const title of featuredPropertyTitles) {
      const property = await prisma.property.findFirst({
        where: { title: { contains: title } }
      });
      
      if (property) {
        await prisma.property.update({
          where: { id: property.id },
          data: { isfeatured: true }
        });
        console.log(`✅ Preserved featured status for: ${property.title}`);
      } else {
        console.log(`⚠️ Could not find featured property: ${title}`);
      }
    }
    
    console.log("Featured properties preservation complete!");
  } catch (error: any) {
    console.error("Error preserving featured properties:", error.message);
  }
}

async function createProperty(propertyData: PropertyInput) {
  try {
    const areaValue = propertyData.area;
    if (areaValue !== null && typeof areaValue !== 'number') {
      throw new Error(`Invalid area value for "${propertyData.title}": ${areaValue}`);
    }

    // Check if a property with the same title and location already exists
    const existingProperty = await prisma.property.findFirst({
      where: {
        title: propertyData.title,
        location: propertyData.location
      }
    });

    // If property already exists, skip it
    if (existingProperty) {
      console.log(`⏭️ Property already exists: ${propertyData.title} at ${propertyData.location}. Skipping.`);
      return { created: false, property: existingProperty };
    }

    let slug = slugify(`${propertyData.title} ${propertyData.location} ${propertyData.city}`, {
      lower: true,
      strict: true,
    });
    const existing = await prisma.property.findFirst({ where: { slug } });
    if (existing) {
      slug = `${slug}-${uuidv4().slice(0, 8)}`;
    }

    // Ensure agent exists
    await ensureAgentExists('abiterra-admin', 'Abiterra Admin', 'admin@abiterra.com');

    const uploadedImages = await Promise.all(
      propertyData.images.map(async (filePath, index) => {
        const { url, filePath: supabasePath, imageType } = await uploadImageToSupabase(filePath);
        return {
          url,
          filepath: supabasePath,
          imagetype: imageType,
          ismain: index === 0,
          createdat: new Date(),
        };
      })
    );

    // IMPORTANT: Check if this is one of our featured properties
    const shouldBeFeautured = featuredPropertyTitles.some(title => 
      propertyData.title.includes(title)
    );
    
    // Always respect the featured status
    const isFeatured = shouldBeFeautured ? true : false;

    const property = await prisma.property.create({
      data: {
        id: uuidv4(),
        slug,
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        type: propertyData.type as 'SALE' | 'RENT',
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        bq: propertyData.bq,
        toilets: propertyData.toilets,
        area: areaValue,
        location: propertyData.location,
        latitude: propertyData.latitude ?? null,
        longitude: propertyData.longitude ?? null,
        city: propertyData.city,
        state: propertyData.state,
        availability: true,
        status: 'AVAILABLE' as 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED',
        isfeatured: isFeatured, // Properly set the featured flag
        agentid: 'lord-supreme',
        createdat: new Date(),
        updatedat: new Date(),
        image: {
          create: uploadedImages,
        },
        feature: {
          create: propertyData.features.map((name) => ({ name })),
        },
      },
    });

    console.log(`✅ Created property: ${property.title} (ID: ${property.id}, Slug: ${property.slug}, Featured: ${isFeatured})`);
    return { created: true, property };
  } catch (error: any) {
    console.error(`Error creating property "${propertyData.title}":`);
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
    throw error;
  }
}

async function createProperties(properties: PropertyInput[]) {
  console.log(`Starting to create ${properties.length} new properties...`);

  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
    failures: [] as string[],
  };

  for (const property of properties) {
    try {
      // Check if this is a featured property
      const shouldBeFeautured = featuredPropertyTitles.some(title => 
        property.title.includes(title)
      );
      
      // Set the featured flag properly
      property.isFeatured = shouldBeFeautured;
      
      const result = await createProperty(property);
      if (result.created) {
        results.successful++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      results.failed++;
      results.failures.push(property.title);
    }
  }

  return results;
}

async function main() {
  try {
    // First, ensure our featured properties remain featured
    await preserveFeaturedProperties();
    
    // Then add the new properties
    const results = await createProperties(newPropertiesToAdd);

    console.log('\nNew Properties Creation Summary:');
    console.log(`✅ Successfully created: ${results.successful} properties`);
    console.log(`⏭️ Skipped existing: ${results.skipped} properties`);
    console.log(`❌ Failed to create: ${results.failed} properties`);

    if (results.failures.length > 0) {
      console.log('\nFailed properties:');
      results.failures.forEach((title) => console.log(`- ${title}`));
    }
    
    // Final verification of featured properties
    await preserveFeaturedProperties();
  } catch (error: any) {
    console.error('Batch creation failed:');
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
  } finally {
    await prisma.$disconnect();
  }
}

main();