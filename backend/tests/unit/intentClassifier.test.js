const { classifyIntent } = require('../../src/services/bloombot/intentClassifier');

describe('intentClassifier - classifyIntent', () => {
  test('should classify as activity_request when keywords match', () => {
    const inputs = [
      'let play a game',
      'I want to try a breathing activity',
      'can we practice a breathe exercise?'
    ];

    inputs.forEach(msg => {
      const res = classifyIntent(msg);
      expect(res.intent).toBe('activity_request');
    });
  });

  test('should classify as information_seeking when keywords match', () => {
    const inputs = [
      'how to handle temper tantrums?',
      'help me understand why my child won\'t sleep'
    ];

    inputs.forEach(msg => {
      const res = classifyIntent(msg);
      expect(res.intent).toBe('information_seeking');
    });
  });

  test('should default to emotional_support for other messages', () => {
    const res = classifyIntent('I feel sad today');
    expect(res.intent).toBe('emotional_support');
  });

  test('should fall back to child userType and middle ageTier when context is empty', () => {
    const res = classifyIntent('hello');
    expect(res.userType).toBe('child');
    expect(res.ageTier).toBe('middle');
  });

  test('should preserve sessionContext attributes when provided', () => {
    const context = { userType: 'parent', ageTier: 'early' };
    const res = classifyIntent('hello', context);
    expect(res.userType).toBe('parent');
    expect(res.ageTier).toBe('early');
  });
});
