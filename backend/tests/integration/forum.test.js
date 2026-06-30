const request = require('supertest');
const app = require('../../src/app');

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockPostId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const mockCommentId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

  const mockPost = {
    id: mockPostId,
    author_id: 'mock-user-id',
    title: 'Post Title',
    body: 'This is a test post content that meets the minimum length requirement.',
    slug: 'post-title-12345',
    status: 'published',
    profiles: {
      display_name: 'Test Author',
      avatar_url: 'http://example.com/avatar.jpg'
    }
  };

  const mockComment = {
    id: mockCommentId,
    post_id: mockPostId,
    author_id: 'mock-user-id',
    body: 'Comment body text',
    profiles: {
      display_name: 'Test User',
      avatar_url: 'http://example.com/avatar.jpg'
    }
  };

  const createMockQuery = (arrayData, singleData = null, error = null, count = 1) => {
    const query = {};
    const chain = () => query;
    
    query.select = chain;
    query.eq = chain;
    query.is = chain;
    query.textSearch = chain;
    query.lt = chain;
    query.range = chain;
    query.order = chain;
    query.limit = chain;
    query.single = jest.fn().mockResolvedValue({ data: singleData || arrayData[0], error });
    query.insert = chain;
    query.update = chain;
    query.delete = chain;
    
    query.then = (onFulfilled) => Promise.resolve({ data: arrayData, error, count }).then(onFulfilled);
    
    return query;
  };

  const mockFrom = jest.fn().mockImplementation((table) => {
    if (table === 'posts') {
      return createMockQuery([mockPost], mockPost);
    }
    if (table === 'comments') {
      return createMockQuery([mockComment], mockComment);
    }
    return createMockQuery([{}], {});
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

describe('Community Forum Integration Tests', () => {
  const token = 'mock-jwt-token';
  const mockPostId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const mockCommentId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

  test('should list posts successfully without authentication', async () => {
    const res = await request(app)
      .get('/api/v1/posts')
      .query({ page: 1, limit: 10, status: 'published' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(mockPostId);
  });

  test('should create post successfully when authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        title: 'New Post Title', 
        body: 'This is a test post body content that meets the length constraint.', 
        status: 'published' 
      });

    expect(res.status).toBe(201);
    expect(res.body.data.post.id).toBe(mockPostId);
  });

  test('should fail to update post when unauthenticated', async () => {
    const res = await request(app)
      .patch(`/api/v1/posts/${mockPostId}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(401);
  });

  test('should update post successfully when authenticated owner', async () => {
    const res = await request(app)
      .patch(`/api/v1/posts/${mockPostId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.data.post.title).toBe('Post Title');
  });

  test('should list post comments and create a new comment', async () => {
    // 1. List
    let res = await request(app)
      .get(`/api/v1/posts/${mockPostId}/comments`)
      .query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);

    // 2. Create
    res = await request(app)
      .post(`/api/v1/posts/${mockPostId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Comment body text' });

    expect(res.status).toBe(201);
    expect(res.body.data.comment.id).toBe(mockCommentId);
  });
});
