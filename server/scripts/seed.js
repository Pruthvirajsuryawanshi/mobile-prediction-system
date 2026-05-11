import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mobile from '../models/Mobile.js';

dotenv.config();

const mobiles = [
  {
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 159900,
    processor: "A17 Pro",
    battery: 4441,
    display: "LTPO Super Retina XDR OLED",
    screenSize: "6.7 inches",
    refreshRate: 120,
    camera: 48,
    frontCamera: 12,
    ram: 8,
    storage: 256,
    os: "iOS 17",
    weight: 221,
    chargingSpeed: 27,
    has5G: true,
    gamingScore: 10,
    cameraScore: 10,
    batteryScore: 8,
    performanceScore: 10,
    displayScore: 10,
    valueScore: 7,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop",
    pros: ["Incredible performance", "Best-in-class video", "Premium titanium build"],
    cons: ["Very expensive", "Slow charging compared to rivals"],
    launchYear: 2023,
    category: "ultra-premium"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 129999,
    processor: "Snapdragon 8 Gen 3",
    battery: 5000,
    display: "Dynamic LTPO AMOLED 2X",
    screenSize: "6.8 inches",
    refreshRate: 120,
    camera: 200,
    frontCamera: 12,
    ram: 12,
    storage: 256,
    os: "Android 14",
    weight: 232,
    chargingSpeed: 45,
    has5G: true,
    gamingScore: 10,
    cameraScore: 10,
    batteryScore: 9,
    performanceScore: 10,
    displayScore: 10,
    valueScore: 8,
    image: "https://images.unsplash.com/photo-1707204538965-02798e4f576e?q=80&w=1000&auto=format&fit=crop",
    pros: ["Versatile camera system", "Integrated S-Pen", "Industry-leading display"],
    cons: ["Large and heavy", "Expensive"],
    launchYear: 2024,
    category: "ultra-premium"
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 64999,
    processor: "Snapdragon 8 Gen 3",
    battery: 5400,
    display: "LTPO AMOLED",
    screenSize: "6.82 inches",
    refreshRate: 120,
    camera: 50,
    frontCamera: 32,
    ram: 12,
    storage: 256,
    os: "Android 14",
    weight: 220,
    chargingSpeed: 100,
    has5G: true,
    gamingScore: 9,
    cameraScore: 8,
    batteryScore: 10,
    performanceScore: 10,
    displayScore: 9,
    valueScore: 9,
    image: "https://images.unsplash.com/photo-1706691459293-1b9b940914e9?q=80&w=1000&auto=format&fit=crop",
    pros: ["Super fast charging", "Excellent performance", "Great value"],
    cons: ["No IP68 rating", "Hasselblad tuning is subjective"],
    launchYear: 2024,
    category: "flagship"
  },
  {
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 106999,
    processor: "Google Tensor G3",
    battery: 5050,
    display: "LTPO OLED",
    screenSize: "6.7 inches",
    refreshRate: 120,
    camera: 50,
    frontCamera: 10,
    ram: 12,
    storage: 128,
    os: "Android 14",
    weight: 213,
    chargingSpeed: 30,
    has5G: true,
    gamingScore: 7,
    cameraScore: 10,
    batteryScore: 7,
    performanceScore: 8,
    displayScore: 10,
    valueScore: 7,
    image: "https://images.unsplash.com/photo-1696429117658-0051e59273c5?q=80&w=1000&auto=format&fit=crop",
    pros: ["Smartest AI features", "Best still photography", "Clean Android experience"],
    cons: ["Average battery life", "Performance behind Snapdragon"],
    launchYear: 2023,
    category: "flagship"
  },
  {
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 36999,
    processor: "Snapdragon 8+ Gen 1",
    battery: 4700,
    display: "LTPO OLED",
    screenSize: "6.7 inches",
    refreshRate: 120,
    camera: 50,
    frontCamera: 32,
    ram: 8,
    storage: 128,
    os: "Android 13",
    weight: 201,
    chargingSpeed: 45,
    has5G: true,
    gamingScore: 8,
    cameraScore: 7,
    batteryScore: 8,
    performanceScore: 8,
    displayScore: 8,
    valueScore: 9,
    image: "https://images.unsplash.com/photo-1689158319121-6d7560a04944?q=80&w=1000&auto=format&fit=crop",
    pros: ["Unique Glyph interface", "Clean UI", "Good performance for price"],
    cons: ["Average cameras", "Polarizing design"],
    launchYear: 2023,
    category: "mid-range"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Mobile.deleteMany({});
    console.log("Cleared existing mobiles...");
    
    await Mobile.insertMany(mobiles);
    console.log("Successfully seeded database!");
    
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();
