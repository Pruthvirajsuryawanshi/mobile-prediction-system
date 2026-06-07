import dataService from '../services/dataService.js';

export async function getAllMobiles(req, res) {
    try {
        const { page = 1, limit = 12, category, brand, minPrice, maxPrice, sort = 'performanceScore', search } = req.query;
        const { items, total } = dataService.getAllMobiles({ page: Number(page), limit: Number(limit), category, brand, minPrice, maxPrice, search, sort });

        res.json({
            success: true,
            data: items,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getMobileById(req, res) {
    try {
        const mobile = dataService.getMobileById(req.params.id);
        if (!mobile) return res.status(404).json({ success: false, message: 'Phone not found' });

        // Note: views are kept in-memory
        mobile.views = (mobile.views || 0) + 1;

        res.json({ success: true, data: mobile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getTrendingMobiles(req, res) {
    try {
        const trending = dataService.getTrending(6);
        res.json({ success: true, data: trending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getBrands(req, res) {
    try {
        const brands = dataService.getBrands();
        res.json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
