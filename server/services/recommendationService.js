import Mobile from '../models/Mobile.js';

/**
 * Build MongoDB query from extracted requirements
 */
export function buildQuery(requirements) {
  const query = { inStock: true };

  if (!requirements) return query;

  // Budget filter
  if (requirements.maxBudget) {
    query.price = { $lte: requirements.maxBudget };
  } else if (requirements.budget) {
    query.price = { $lte: requirements.budget };
  }
  if (requirements.minBudget) {
    query.price = { ...query.price, $gte: requirements.minBudget };
  }

  // Brand filter
  if (requirements.brands && requirements.brands.length > 0) {
    query.brand = { $in: requirements.brands.map(b => new RegExp(b, 'i')) };
  }

  // Exclude brands
  if (requirements.excludeBrands && requirements.excludeBrands.length > 0) {
    query.brand = { ...query.brand, $nin: requirements.excludeBrands.map(b => new RegExp(b, 'i')) };
  }

  // RAM filter
  if (requirements.minRam) {
    query.ram = { $gte: requirements.minRam };
  }

  // Storage filter
  if (requirements.minStorage) {
    query.storage = { $gte: requirements.minStorage };
  }

  // 5G filter
  if (requirements.needs5G === true) {
    query.has5G = true;
  }

  // Category filter
  if (requirements.category) {
    query.category = requirements.category;
  }

  return query;
}

/**
 * Build MongoDB sort based on priorities
 */
export function buildSort(priorities) {
  if (!priorities || priorities.length === 0) {
    return { performanceScore: -1 };
  }

  const sortMap = {
    gaming: { gamingScore: -1 },
    camera: { cameraScore: -1 },
    battery: { batteryScore: -1 },
    performance: { performanceScore: -1 },
    display: { displayScore: -1 },
    value: { valueScore: -1 },
  };

  const primaryPriority = priorities[0];
  return sortMap[primaryPriority] || { performanceScore: -1 };
}

/**
 * Get filtered phones from MongoDB
 */
export async function getFilteredPhones(requirements, limit = 5) {
  try {
    const query = buildQuery(requirements);
    const sort = buildSort(requirements?.priorities);

    const phones = await Mobile.find(query)
      .sort(sort)
      .limit(limit)
      .lean();

    return phones;
  } catch (error) {
    console.error('Error filtering phones:', error);
    throw error;
  }
}

/**
 * Get phones by name for comparison
 */
export async function getPhonesByName(phoneNames) {
  try {
    const phones = await Promise.all(
      phoneNames.map(name =>
        Mobile.findOne({ name: new RegExp(name, 'i') }).lean()
      )
    );
    return phones.filter(Boolean);
  } catch (error) {
    console.error('Error getting phones by name:', error);
    throw error;
  }
}

/**
 * Format phones for AI context (only relevant fields)
 */
export function formatPhonesForAI(phones) {
  return phones.map(phone => ({
    name: phone.name,
    brand: phone.brand,
    price: `₹${phone.price.toLocaleString('en-IN')}`,
    processor: phone.processor,
    ram: `${phone.ram}GB`,
    storage: `${phone.storage}GB`,
    camera: `${phone.camera}MP`,
    battery: `${phone.battery}mAh`,
    display: phone.display,
    refreshRate: `${phone.refreshRate}Hz`,
    has5G: phone.has5G,
    scores: {
      gaming: `${phone.gamingScore}/10`,
      camera: `${phone.cameraScore}/10`,
      battery: `${phone.batteryScore}/10`,
      performance: `${phone.performanceScore}/10`,
      display: `${phone.displayScore}/10`,
      value: `${phone.valueScore}/10`,
    },
    pros: phone.pros,
    cons: phone.cons,
  }));
}
