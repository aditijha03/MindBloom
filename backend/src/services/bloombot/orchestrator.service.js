/**
 * Orchestrator Service for Bloom Bot
 * Coordinates the full request pipeline: intent classification, distress detection,
 * RAG retrieval, prompt building, and LLM generation.
 */

const { classifyIntent } = require('./intentClassifier');
const { analyzeDistress } = require('./distressDetector');
const { retrieveKnowledgeChunks } = require('./rag.service');
const { generateResponse } = require('./llm.service');
const { PROMPTS, CRISIS_TEMPLATES } = require('../../config/prompts');

/**
 * Handle an incoming message to Bloom Bot
 * @param {string} message - User's new message
 * @param {Array} history - Array of { role, content }
 * @param {object} sessionContext - { userType: 'child' | 'parent', ageTier: 'early'|'middle'|'tween' }
 */
async function handleMessage(message, history, sessionContext) {
  // 1. Distress Detection (parallel safety process)
  const distress = analyzeDistress(message);
  
  if (distress.isCritical) {
    // CRISIS PATH: Bypass LLM generation
    console.warn(`[SAFETY] Crisis detected. Trigger: ${distress.trigger}`);
    const crisisTemplate = sessionContext?.userType === 'parent' 
      ? CRISIS_TEMPLATES.parent 
      : CRISIS_TEMPLATES.child;
      
    // Ideally log this event to Audit Log Store here
    return {
      text: crisisTemplate,
      isCrisis: true
    };
  }

  // 2. Intent Classification & Persona Routing
  const classification = classifyIntent(message, sessionContext);
  
  // Select system prompt variant
  let systemPromptTemplate = PROMPTS.child; // fallback
  if (classification.userType === 'parent') {
    systemPromptTemplate = PROMPTS.parent;
  } else {
    // Child mode
    if (classification.ageTier === 'early') systemPromptTemplate = PROMPTS.early;
    else if (classification.ageTier === 'tween') systemPromptTemplate = PROMPTS.tween;
    else systemPromptTemplate = PROMPTS.middle; // default for child
  }

  // 3. RAG Retrieval
  const knowledgeChunks = retrieveKnowledgeChunks(classification.intent, message);
  
  // 4. Prompt Builder
  const systemPrompt = systemPromptTemplate.replace('{{RETRIEVED_KNOWLEDGE_CHUNKS}}', knowledgeChunks);

  // Determine max tokens based on persona
  const maxTokens = classification.userType === 'parent' ? 800 : 400;

  // 5. LLM API Call
  // The system prompt contains the persona, safety rules, and RAG knowledge.
  const responseText = await generateResponse(systemPrompt, history, message, maxTokens);

  return {
    text: responseText,
    isCrisis: false
  };
}

module.exports = {
  handleMessage
};
