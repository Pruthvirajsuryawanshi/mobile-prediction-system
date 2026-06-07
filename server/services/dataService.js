import fs from 'fs';
import path from 'path';

function parseCSV(csv) {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    const header = lines.shift().split(',').map(h => h.trim());
    return lines.map((line, idx) => {
        const cols = line.split(',').map(c => c.trim());
        const obj = {};
        header.forEach((h, i) => {
            obj[h] = cols[i] || '';
        });
        // normalize fields expected by the app
        const price = Number(obj.Price || (obj.Price && obj.Price.replace(/[^0-9.]/g, ''))) || 0;
        const ram = Number(obj.RAM) || 0;
        const storage = Number(obj.Storage) || 0;
        const camera = Number(obj.Camera) || 0;
        const battery = Number(obj.Battery) || 0;
        const rating = Number(obj.Rating) || 0;

        return {
            id: String(idx + 1),
            name: `${obj.Brand} ${obj.Model}`.trim(),
            brand: obj.Brand,
            price,
            ram,
            storage,
            camera,
            battery,
            has5G: false,
            gamingScore: obj.Gaming && obj.Gaming.toLowerCase().startsWith('y') ? 8 : 5,
            cameraScore: Math.round(rating * 2),
            batteryScore: Math.round(rating * 2),
            performanceScore: Math.round(rating * 2),
            displayScore: Math.round(rating * 2),
            valueScore: Math.round(rating * 2),
            inStock: true,
            views: 0,
            pros: [],
            cons: [],
        };
    });
}

let mobiles = [];
try {
    const csv = fs.readFileSync(path.join(process.cwd(), '..', 'mobile_reco_system', 'mobiles.csv'), 'utf8');
    mobiles = parseCSV(csv);
} catch (e) {
    console.error('Could not load mobiles.csv:', e.message);
    mobiles = [];
}

export function getAllMobiles({ page = 1, limit = 12, category, brand, minPrice, maxPrice, search, sort = 'performanceScore' } = {}) {
    let result = mobiles.slice();

    if (brand) result = result.filter(m => new RegExp(brand, 'i').test(m.brand));
    if (minPrice) result = result.filter(m => m.price >= Number(minPrice));
    if (maxPrice) result = result.filter(m => m.price <= Number(maxPrice));
    if (search) result = result.filter(m => new RegExp(search, 'i').test(m.name));

    const total = result.length;

    result.sort((a, b) => (b[sort] || 0) - (a[sort] || 0));

    const start = (page - 1) * limit;
    const pageItems = result.slice(start, start + Number(limit));

    return { items: pageItems, total };
}

export function getMobileById(id) {
    return mobiles.find(m => m.id === id) || null;
}

export function getTrending(limit = 6) {
    return mobiles.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
}

export function getBrands() {
    return Array.from(new Set(mobiles.map(m => m.brand))).filter(Boolean);
}

export function findByNameRegex(name) {
    const re = new RegExp(name, 'i');
    return mobiles.filter(m => re.test(m.name));
}

export default { getAllMobiles, getMobileById, getTrending, getBrands, findByNameRegex };
