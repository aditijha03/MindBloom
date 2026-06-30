const request = require('supertest');
const app = require('../../src/app');

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockPlan = {
    id: 'mock-plan-id',
    user_id: 'mock-user-id',
    child_id: 'mock-child-id',
    age_group: '3-5',
    minutes: 30,
    concerns: ['Speech Delay'],
    activities: [{ day: 'Monday', activity: { name: 'Reading' } }],
    feedback: {}
  };

  const mockReminder = {
    id: 'mock-reminder-id',
    user_id: 'mock-user-id',
    text: 'Do stretch',
    time: '09:00'
  };

  const mockPlanInsert = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({ data: mockPlan, error: null })
    }))
  }));

  const mockPlanSelect = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => ({
      order: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue({ data: [mockPlan], error: null })
      }))
    }))
  }));

  const mockPlanUpdate = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({ data: mockPlan, error: null })
        }))
      }))
    }))
  }));

  const mockReminderInsert = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({ data: mockReminder, error: null })
    }))
  }));

  const mockReminderSelect = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => ({
      order: jest.fn().mockResolvedValue({ data: [mockReminder], error: null })
    }))
  }));

  const mockReminderDelete = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({ data: mockReminder, error: null })
        }))
      }))
    }))
  }));

  const mockFrom = jest.fn().mockImplementation((table) => {
    if (table === 'weekly_plans') {
      return {
        insert: mockPlanInsert,
        select: mockPlanSelect,
        update: mockPlanUpdate
      };
    }
    if (table === 'reminders') {
      return {
        insert: mockReminderInsert,
        select: mockReminderSelect,
        delete: mockReminderDelete
      };
    }
    return {};
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

describe('Weekly Plans & Reminders Integration Tests', () => {
  const token = 'mock-jwt-token';

  test('should fail to fetch plan if unauthenticated', async () => {
    const res = await request(app).get('/api/v1/weekly-plans');
    expect(res.status).toBe(401);
  });

  test('should fetch latest plan successfully if authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/weekly-plans')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.plan.id).toBe('mock-plan-id');
    expect(res.body.data.plan.age_group).toBe('3-5');
  });

  test('should create a new weekly plan successfully', async () => {
    const res = await request(app)
      .post('/api/v1/weekly-plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        childId: 'mock-child-id',
        ageGroup: '3-5',
        minutes: 30,
        concerns: ['Speech Delay'],
        activities: [{ day: 'Monday', activity: { name: 'Reading' } }]
      });

    expect(res.status).toBe(201);
    expect(res.body.data.plan.id).toBe('mock-plan-id');
  });

  test('should update plan feedback successfully', async () => {
    const res = await request(app)
      .patch('/api/v1/weekly-plans/mock-plan-id/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ feedback: { 0: 'done' } });

    expect(res.status).toBe(200);
    expect(res.body.data.plan.id).toBe('mock-plan-id');
  });

  test('should manage daily reminders (list, create, delete)', async () => {
    // 1. List Reminders
    let res = await request(app)
      .get('/api/v1/reminders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.reminders.length).toBe(1);

    // 2. Create Reminder
    res = await request(app)
      .post('/api/v1/reminders')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Do stretch', time: '09:00' });

    expect(res.status).toBe(201);
    expect(res.body.data.reminder.id).toBe('mock-reminder-id');

    // 3. Delete Reminder
    res = await request(app)
      .delete('/api/v1/reminders/mock-reminder-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.reminder.id).toBe('mock-reminder-id');
  });
});
