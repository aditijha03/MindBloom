/**
 * Distress Detector Module
 * Scans messages for keywords or patterns that indicate crisis-level distress.
 */

const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'want to die', 'end it all', 'hurt myself',
  "cutting myself", "don't want to be here", "make it stop", "no reason to live",
  'hate my life', 'better off dead', 'abuse', 'hit me', 'hitting me',
  'touching me', 'scared of my dad', 'scared of my mom', 'hurt me'
];

/**
 * Basic distress detector
 * @param {string} message - User input message
 * @returns {object} - { isCritical: boolean, score: number }
 */
function analyzeDistress(message) {
  if (!message || typeof message !== 'string') {
    return { isCritical: false, score: 0 };
  }

  const normalizedMessage = message.toLowerCase();
  
  for (const keyword of CRISIS_KEYWORDS) {
    if (normalizedMessage.includes(keyword)) {
      return { isCritical: true, score: 1.0, trigger: keyword };
    }
  }

  return { isCritical: false, score: 0 };
}

module.exports = {
  analyzeDistress
};
