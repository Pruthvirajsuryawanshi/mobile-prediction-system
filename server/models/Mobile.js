import mongoose from 'mongoose';

const mobileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  processor: { type: String, required: true },
  battery: { type: Number, required: true },        // in mAh
  display: { type: String, required: true },
  screenSize: { type: String },
  refreshRate: { type: Number, default: 60 },       // in Hz
  camera: { type: Number, required: true },         // main camera MP
  frontCamera: { type: Number },                    // front camera MP
  ram: { type: Number, required: true },            // in GB
  storage: { type: Number, required: true },        // in GB
  os: { type: String },
  weight: { type: Number },                         // in grams
  chargingSpeed: { type: Number },                  // in Watts
  has5G: { type: Boolean, default: false },
  
  // AI scoring (1-10)
  gamingScore: { type: Number, min: 1, max: 10 },
  cameraScore: { type: Number, min: 1, max: 10 },
  batteryScore: { type: Number, min: 1, max: 10 },
  performanceScore: { type: Number, min: 1, max: 10 },
  displayScore: { type: Number, min: 1, max: 10 },
  valueScore: { type: Number, min: 1, max: 10 },   // value for money

  image: { type: String },                          // image URL
  pros: [{ type: String }],
  cons: [{ type: String }],
  
  // metadata
  launchYear: { type: Number },
  category: { 
    type: String, 
    enum: ['budget', 'mid-range', 'flagship', 'ultra-premium'],
    default: 'mid-range'
  },
  inStock: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  
}, { timestamps: true });

// Text index for search
mobileSchema.index({ name: 'text', brand: 'text', processor: 'text' });

export default mongoose.model('Mobile', mobileSchema);
