import { getFilteredPhones } from '../services/recommendationService.js';
import { extractRequirements } from '../ai/openRouter.js';

export async function recommend(req, res) {
  try {
    const { query, budget, brands, priorities, limit = 5 } = req.body;

    let requirements = { budget, brands, priorities };

    // If free-text query, extract requirements
    if (query) {
      const extracted = await extractRequirements(query);
      if (extracted) {
        requirements = { ...requirements, ...extracted };
      }
    }

    const phones = await getFilteredPhones(requirements, Number(limit));

    res.json({
      success: true,
      data: phones,
      count: phones.length,
      appliedFilters: requirements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
