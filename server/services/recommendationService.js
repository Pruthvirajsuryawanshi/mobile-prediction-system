import dataService from './dataService.js';

/**
 * Get filtered phones from CSV-backed data service
 */
export async function getFilteredPhones(requirements, limit = 5) {
    try {
        const sort = (requirements?.priorities && requirements.priorities[0]) || 'performanceScore';
        const { items } = dataService.getAllMobiles({ page: 1, limit, brand: requirements?.brands?.[0], minPrice: requirements?.minBudget || requirements?.minPrice, maxPrice: requirements?.maxBudget || requirements?.budget, search: requirements?.search, sort });
        return items;
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
        const phones = phoneNames.flatMap(name => dataService.findByNameRegex(name));
        return phones;
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
        price: `₹${(phone.price || 0).toLocaleString('en-IN')}`,
        processor: phone.processor || 'Unknown',
        ram: `${phone.ram || 0}GB`,
        storage: `${phone.storage || 0}GB`,
        camera: `${phone.camera || 0}MP`,
        battery: `${phone.battery || 0}mAh`,
        display: phone.display || 'Unknown',
        refreshRate: phone.refreshRate ? `${phone.refreshRate}Hz` : '60Hz',
        has5G: phone.has5G || false,
        scores: {
            gaming: `${phone.gamingScore || 0}/10`,
            camera: `${phone.cameraScore || 0}/10`,
            battery: `${phone.batteryScore || 0}/10`,
            performance: `${phone.performanceScore || 0}/10`,
            display: `${phone.displayScore || 0}/10`,
            value: `${phone.valueScore || 0}/10`,
        },
        pros: phone.pros || [],
        cons: phone.cons || [],
    }));
}