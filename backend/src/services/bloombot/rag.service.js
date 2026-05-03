/**
 * RAG Service for Bloom Bot
 * Retrieves knowledge base chunks to inject into the system prompt.
 * For v1, this is mocked to return basic coping strategies.
 */

function retrieveKnowledgeChunks(intent, message) {
  // Mock knowledge base
  const kb = [
    "[SOURCE: Clinical Guidelines] Balloon Breathing: Inhale slowly for 4 seconds, feeling your stomach expand like a balloon. Exhale for 4 seconds, feeling the balloon deflate.",
    "[SOURCE: Child Psychology DB] When a child feels anxious, validating their feeling is the first step before offering solutions.",
    "[SOURCE: Parenting Resilience] A consistent routine helps children feel secure. When facing school refusal, maintain a calm but firm morning routine."
  ];

  return kb.join('\n\n');
}

module.exports = {
  retrieveKnowledgeChunks
};
