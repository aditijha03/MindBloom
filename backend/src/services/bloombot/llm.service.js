/**
 * LLM Service for Bloom Bot
 * Integrates with Google Gemini API.
 * Falls back to a mock service if no API key is provided.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate a response using the LLM.
 * @param {string} systemPrompt - The system instructions for Bloom Bot
 * @param {Array} history - Array of { role: 'user' | 'assistant', content: string }
 * @param {string} userMessage - The latest message from the user
 * @param {number} maxTokens - The maximum tokens for the response
 */
async function generateResponse(systemPrompt, history, userMessage, maxTokens = 400) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // If we have an API key, call Gemini
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt
      });

      // Map our app's history format to Gemini's expected format.
      // Gemini API requires the first message in history to have role 'user' (model).
      let startIndex = 0;
      while (startIndex < history.length && history[startIndex].role === 'assistant') {
        startIndex++;
      }
      const validHistory = history.slice(startIndex);

      const formattedHistory = validHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.5,
        }
      });

      const result = await chat.sendMessage(userMessage || "Hello");
      return result.response.text();
    } 
    
    // Fallback: Mock response if no API key
    console.warn('No GEMINI_API_KEY found. Using mock LLM response.');
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Provide some context-aware mock responses based on input
    const msgLower = userMessage ? userMessage.toLowerCase() : '';
    
    if (msgLower.includes('sad') || msgLower.includes('angry') || msgLower.includes('worried')) {
      return "I can see you're feeling some big emotions right now. That's completely normal. Do you want to talk about it, or maybe try a quick breathing game to feel a bit calmer?";
    }
    
    if (msgLower.includes('breathe') || msgLower.includes('yes')) {
      return "Awesome! Let's try Balloon Breathing. Imagine your tummy is a big colorful balloon. Breathe in slowly through your nose and fill the balloon... now breathe out through your mouth and let the air out. Great job!";
    }

    return "I hear you. Tell me a little bit more about that, or we can just hang out in the garden for a bit. I'm here for you.";

  } catch (error) {
    console.error('Error generating LLM response:', error);
    throw error;
  }
}

module.exports = {
  generateResponse
};
