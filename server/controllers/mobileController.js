import Mobile from '../models/Mobile.js';

export async function getAllMobiles(req, res) {
  try {
    const { 
      page = 1, limit = 12, category, brand, 
      minPrice, maxPrice, sort = 'performanceScore',
      search 
    } = req.query;

    const query = { inStock: true };

    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortObj = {};
    sortObj[sort] = -1;

    const [mobiles, total] = await Promise.all([
      Mobile.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Mobile.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: mobiles,
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
    const mobile = await Mobile.findById(req.params.id).lean();
    if (!mobile) return res.status(404).json({ success: false, message: 'Phone not found' });

    // Increment views
    Mobile.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, data: mobile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTrendingMobiles(req, res) {
  try {
    const trending = await Mobile.find({ inStock: true })
      .sort({ views: -1, performanceScore: -1 })
      .limit(6)
      .lean();

    res.json({ success: true, data: trending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBrands(req, res) {
  try {
    const brands = await Mobile.distinct('brand');
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
