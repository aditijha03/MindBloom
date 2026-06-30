const request = require('supertest');
const app = require('../../src/app');

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockProfileId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const mockProfile = {
    id: mockProfileId,
    display_name: 'Test Parent Name',
    bio: 'Parenting biography info',
    avatar_url: 'http://example.com/avatar.jpg'
  };

  const createMockQuery = (data, error = null) => {
    const query = {};
    const chain = () => query;
    
    query.select = chain;
    query.eq = chain;
    query.single = jest.fn().mockResolvedValue({ data, error });
    query.update = chain;
    
    query.then = (onFulfilled) => Promise.resolve({ data, error }).then(onFulfilled);
    
    return query;
  };

  const mockFrom = jest.fn().mockImplementation((table) => {
    if (table === 'profiles') {
      return createMockQuery(mockProfile);
    }
    return createMockQuery({});
  });

  return {
    createClient: jest.fn().mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: mockProfileId,
              email: 'parent@example.com',
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

describe('User Profiles Integration Tests', () => {
  const token = 'mock-jwt-token';
  const mockProfileId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  test('should return 401 unauthenticated when fetching /me without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  test('should fetch current user profile successfully when authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.profile.id).toBe(mockProfileId);
    expect(res.body.data.profile.display_name).toBe('Test Parent Name');
  });

  test('should update current user profile details successfully', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'New Display Name', bio: 'New parenting biography' });

    expect(res.status).toBe(200);
    expect(res.body.data.profile.display_name).toBe('Test Parent Name');
  });

  test('should fetch user profile by ID successfully', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${mockProfileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.profile.id).toBe(mockProfileId);
  });
});
