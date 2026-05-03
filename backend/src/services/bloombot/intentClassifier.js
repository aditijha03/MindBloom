/**
 * Intent Classifier Module
 * In a full production system, this might use an LLM or ML classifier.
 * For v1, we extract intent and context from the session payload provided by the frontend.
 */

function classifyIntent(message, sessionContext) {
  // sessionContext contains { userType: 'child' | 'parent', ageTier: 'early' | 'middle' | 'tween' }
  const userType = sessionContext?.userType || 'child';
  let ageTier = sessionContext?.ageTier;
  
  if (userType === 'child' && !ageTier) {
    ageTier = 'middle'; // default fallback
  }

  // Basic intent parsing could happen here (e.g. emotion_support, activity_request)
  let intent = 'emotional_support';
  const msgLower = message ? message.toLowerCase() : '';
  
  if (msgLower.includes('breathe') || msgLower.includes('game') || msgLower.includes('activity')) {
    intent = 'activity_request';
  } else if (msgLower.includes('how to') || msgLower.includes('help me understand')) {
    intent = 'information_seeking';
  }

  return {
    userType,
    ageTier,
    intent
  };
}

module.exports = {
  classifyIntent
};
