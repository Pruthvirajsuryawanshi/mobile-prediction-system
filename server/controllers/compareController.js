import { getPhonesByName, formatPhonesForAI } from '../services/recommendationService.js';
import { getChatCompletion } from '../ai/openRouter.js';
import { COMPARISON_PROMPT } from '../prompts/systemPrompts.js';

export async function comparePhones(req, res) {
  try {
    const { phoneNames, focusAreas } = req.body;

    if (!phoneNames || phoneNames.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide at least 2 phone names to compare' 
      });
    }

    const phones = await getPhonesByName(phoneNames);

    if (phones.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'One or more phones not found in database. Available phones can be found at /api/mobiles',
      });
    }

    const formattedPhones = formatPhonesForAI(phones);
    const prompt = COMPARISON_PROMPT(formattedPhones);

    if (focusAreas) {
      prompt + `\n\nUser specifically wants to compare: ${focusAreas}`;
    }

    const aiAnalysis = await getChatCompletion(
      [{ role: 'user', content: `Compare these phones: ${JSON.stringify(formattedPhones)}` }],
      prompt
    );

    res.json({
      success: true,
      data: {
        phones,
        aiAnalysis,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
