/**
 * Distress Detector Module
 * Scans messages for keywords or patterns that indicate crisis-level distress.
 */

const CRISIS_PATTERNS = [
  { pattern: /\bkill\s+myself\b/i, trigger: 'kill myself' },
  { pattern: /\bsuicide\b/i, trigger: 'suicide' },
  { pattern: /\bwant\s+to\s+die\b/i, trigger: 'want to die' },
  { pattern: /\bend\s+it\s+all\b/i, trigger: 'end it all' },
  { pattern: /\bhurt\s+myself\b/i, trigger: 'hurt myself' },
  { pattern: /\bcutting\s+myself\b/i, trigger: 'cutting myself' },
  { pattern: /\bdon'?t\s+want\s+to\s+be\s+here\b/i, trigger: "don't want to be here" },
  { pattern: /\bmake\s+it\s+stop\b/i, trigger: 'make it stop' },
  { pattern: /\bno\s+reason\s+to\s+live\b/i, trigger: 'no reason to live' },
  { pattern: /\bhate\s+my\s+life\b/i, trigger: 'hate my life' },
  { pattern: /\bbetter\s+off\s+dead\b/i, trigger: 'better off dead' },
  { pattern: /\babuse\b/i, trigger: 'abuse' },
  { pattern: /\bhit\s+me\b/i, trigger: 'hit me' },
  { pattern: /\bhitting\s+me\b/i, trigger: 'hitting me' },
  { pattern: /\btouching\s+me\b/i, trigger: 'touching me' },
  { pattern: /\bscared\s+of\s+my\s+dad\b/i, trigger: 'scared of my dad' },
  { pattern: /\bscared\s+of\s+my\s+mom\b/i, trigger: 'scared of my mom' },
  { pattern: /\bhurt\s+me\b/i, trigger: 'hurt me' }
];

/**
 * Basic distress detector using regex
 * @param {string} message - User input message
 * @returns {object} - { isCritical: boolean, score: number, trigger: string }
 */
function analyzeDistress(message) {
  if (!message || typeof message !== 'string') {
    return { isCritical: false, score: 0 };
  }

  for (const { pattern, trigger } of CRISIS_PATTERNS) {
    if (pattern.test(message)) {
      return { isCritical: true, score: 1.0, trigger };
    }
  }

  return { isCritical: false, score: 0 };
}

module.exports = {
  analyzeDistress
};
