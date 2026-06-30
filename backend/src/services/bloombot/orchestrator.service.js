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
const { getSupabaseUserClient } = require('../../config/supabase');

/**
 * Handle an incoming message to Bloom Bot
 * @param {string} message - User's new message
 * @param {Array} history - Array of { role, content }
 * @param {object} sessionContext - { userType: 'child' | 'parent', ageTier: 'early'|'middle'|'tween' }
 * @param {string} token - User's JWT access token
 * @param {string} ipAddress - Client IP address
 */
async function handleMessage(message, history, sessionContext, token, ipAddress) {
  // 1. Distress Detection (parallel safety process)
  const distress = analyzeDistress(message);
  
  if (distress.isCritical) {
    // CRISIS PATH: Bypass LLM generation
    console.warn(`[SAFETY] Crisis detected. Trigger: ${distress.trigger}`);
    const crisisTemplate = sessionContext?.userType === 'parent' 
      ? CRISIS_TEMPLATES.parent 
      : CRISIS_TEMPLATES.child;
      
    // Log this event to Audit Log Store
    if (token) {
      try {
        const userClient = getSupabaseUserClient(token);
        const { data: { user } } = await userClient.auth.getUser();
        
        await userClient
          .from('audit_logs')
          .insert({
            user_id: user ? user.id : null,
            action: 'CRISIS_TRIGGERED',
            resource_type: 'bloombot',
            resource_id: 'distress_detector',
            ip_address: ipAddress || '127.0.0.1',
            metadata: {
              trigger: distress.trigger,
              message_preview: message.substring(0, 100),
              user_type: sessionContext?.userType || 'child'
            }
          });
      } catch (logErr) {
        console.error('Failed to write crisis audit log:', logErr);
      }
    }
    
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
