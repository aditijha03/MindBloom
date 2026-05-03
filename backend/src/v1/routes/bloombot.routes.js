const express = require('express');
const router = express.Router();
const { handleMessage } = require('../../services/bloombot/orchestrator.service');

// Store sessions in memory for V1 mocking. 
// In a real app, use a DB and associate with user IDs/session IDs.
const sessions = new Map();

/**
 * Initialize a new Bloom Bot session
 * POST /api/v1/bloombot/session
 */
router.post('/session', (req, res) => {
  const { userType, ageTier } = req.body;
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  sessions.set(sessionId, {
    context: { userType: userType || 'child', ageTier: ageTier || 'middle' },
    history: []
  });

  res.status(201).json({
    message: 'Session created successfully',
    sessionId,
    disclaimer: userType === 'parent' 
      ? "I'm Bloom, an AI assistant. I can share general information, but I'm not a licensed psychologist."
      : "Hi! I'm Bloom, your AI feelings helper. I'm not a doctor, but I love helping you understand your feelings!"
  });
});

/**
 * Send a message to Bloom Bot
 * POST /api/v1/bloombot/message
 */
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found. Please start a new session.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const session = sessions.get(sessionId);

    // Call orchestrator
    const result = await handleMessage(message, session.history, session.context);

    // Update history if it's not a crisis (or maybe update it anyway, but PRD says crisis pauses flow)
    session.history.push({ role: 'user', content: message });
    session.history.push({ role: 'assistant', content: result.text });

    // Keep history manageable (last 10 turns)
    if (session.history.length > 20) {
      session.history = session.history.slice(session.history.length - 20);
    }

    res.status(200).json({
      text: result.text,
      isCrisis: result.isCrisis
    });
  } catch (error) {
    console.error('Bloom Bot Message Error:', error);
    res.status(500).json({ error: 'Bloom is taking a little rest right now. Please try again in a few minutes!' });
  }
});

/**
 * Get session history
 * GET /api/v1/bloombot/history/:sessionId
 */
router.get('/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.status(200).json({
    history: sessions.get(sessionId).history
  });
});

module.exports = router;
