const express = require('express');
const router = express.Router();
const { handleMessage } = require('../../services/bloombot/orchestrator.service');
const { getSupabaseUserClient } = require('../../config/supabase');
const { authenticate } = require('../../middleware/authenticate');

// Secure all bot routes
router.use(authenticate);

/**
 * Initialize a new Bloom Bot session
 * POST /api/v1/bloombot/session
 */
router.post('/session', async (req, res) => {
  try {
    const { userType, ageTier } = req.body;
    const userId = req.user.id;
    const token = req.token;
    
    const userClient = getSupabaseUserClient(token);
    
    const disclaimer = userType === 'parent' 
      ? "I'm Bloom, an AI assistant. I can share general information, but I'm not a licensed psychologist."
      : "Hi! I'm Bloom, your AI feelings helper. I'm not a doctor, but I love helping you understand your feelings!";
      
    const initialHistory = [{ role: 'assistant', content: disclaimer }];
    
    const { data: session, error } = await userClient
      .from('chat_sessions')
      .insert({
        user_id: userId,
        user_type: userType || 'child',
        age_tier: ageTier || 'middle',
        history: initialHistory
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('DB Insert Error:', error);
      throw error;
    }
    
    res.status(201).json({
      message: 'Session created successfully',
      sessionId: session.id,
      disclaimer
    });
  } catch (error) {
    console.error('Bloom Bot Session Error:', error);
    res.status(500).json({ error: 'Failed to initialize session. Please try again.' });
  }
});

/**
 * Send a message to Bloom Bot
 * POST /api/v1/bloombot/message
 */
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const token = req.token;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const userClient = getSupabaseUserClient(token);

    // Fetch the session from the DB
    const { data: session, error: fetchError } = await userClient
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return res.status(404).json({ error: 'Session not found. Please start a new session.' });
    }

    // Call orchestrator - passing token and client IP for audit logging
    const result = await handleMessage(
      message, 
      session.history, 
      session.user_type === 'parent' ? { userType: 'parent' } : { userType: 'child', ageTier: session.age_tier },
      token,
      req.ip
    );

    // Update history
    const updatedHistory = [...session.history];
    updatedHistory.push({ role: 'user', content: message });
    updatedHistory.push({ role: 'assistant', content: result.text });

    // Keep history manageable (last 10 turns = 20 messages)
    let finalHistory = updatedHistory;
    if (updatedHistory.length > 20) {
      finalHistory = updatedHistory.slice(updatedHistory.length - 20);
    }

    // Save updated history back to database
    const { error: updateError } = await userClient
      .from('chat_sessions')
      .update({ history: finalHistory })
      .eq('id', sessionId);

    if (updateError) {
      console.error('DB Update Error:', updateError);
      throw updateError;
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
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const token = req.token;
    
    const userClient = getSupabaseUserClient(token);
    const { data: session, error } = await userClient
      .from('chat_sessions')
      .select('history')
      .eq('id', sessionId)
      .single();
      
    if (error || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json({
      history: session.history
    });
  } catch (error) {
    console.error('Bloom Bot History Error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history.' });
  }
});

module.exports = router;
