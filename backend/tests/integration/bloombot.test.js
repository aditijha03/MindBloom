const request = require('supertest');
const app = require('../../src/app');

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            startChat: jest.fn().mockImplementation(() => {
              return {
                sendMessage: jest.fn().mockResolvedValue({
                  response: {
                    text: jest.fn().mockReturnValue('Mocked Gemini Response')
                  }
                })
              };
            })
          };
        })
      };
    })
  };
});

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSingleSession = {
    id: 'mock-session-id',
    user_id: 'mock-user-id',
    user_type: 'child',
    age_tier: 'middle',
    history: [{ role: 'assistant', content: 'Hi! I\'m Bloom...' }]
  };

  const mockSessionInsert = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({ data: { id: 'mock-session-id' }, error: null })
    }))
  }));

  const mockSessionUpdate = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockResolvedValue({ data: null, error: null })
  }));

  const mockSessionSelect = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({ data: mockSingleSession, error: null })
    }))
  }));

  const mockAuditInsert = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
  }));

  const mockFrom = jest.fn().mockImplementation((table) => {
    if (table === 'chat_sessions') {
      return {
        insert: mockSessionInsert,
        update: mockSessionUpdate,
        select: mockSessionSelect
      };
    }
    if (table === 'audit_logs') {
      return {
        insert: mockAuditInsert
      };
    }
    return {
      insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: {}, error: null }) }) }),
      select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: {}, error: null }) }) })
    };
  });

  return {
    createClient: jest.fn().mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
              user_metadata: { role: 'user' }
            }
          },
          error: null
        })
      },
      from: mockFrom
    })
  };
});

describe('Bloom Bot Integration Tests', () => {
  const token = 'mock-jwt-token';

  test('should return 401 Unauthorized when accessing /session without token', async () => {
    const res = await request(app)
      .post('/api/v1/bloombot/session')
      .send({ userType: 'child', ageTier: 'middle' });
    expect(res.status).toBe(401);
  });

  test('should successfully start a new chat session with valid JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/bloombot/session')
      .set('Authorization', `Bearer ${token}`)
      .send({ userType: 'child', ageTier: 'middle' });

    expect(res.status).toBe(201);
    expect(res.body.sessionId).toBe('mock-session-id');
    expect(res.body.disclaimer).toContain('AI feelings helper');
  });

  test('should process user messages and return LLM response', async () => {
    const res = await request(app)
      .post('/api/v1/bloombot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'mock-session-id', message: 'Hello Bloom' });

    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
    expect(res.body.isCrisis).toBe(false);
  });

  test('should intercept crisis keywords and flag critical triggers', async () => {
    const res = await request(app)
      .post('/api/v1/bloombot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'mock-session-id', message: 'I feel like I want to suicide' });

    expect(res.status).toBe(200);
    expect(res.body.isCrisis).toBe(true);
    expect(res.body.text).toContain('Vandrevala Foundation');
  });
});
