const { analyzeDistress } = require('../../src/services/bloombot/distressDetector');

describe('distressDetector - analyzeDistress', () => {
  test('should return isCritical false for safe everyday conversations', () => {
    const safeInputs = [
      'Hello, how can I help you today?',
      'My kid wants to draw a balloon.',
      'I am feeling a little tired after a long day of school.',
      'Can you recommend a breathing game?'
    ];

    safeInputs.forEach(msg => {
      expect(analyzeDistress(msg)).toEqual({ isCritical: false, score: 0 });
    });
  });

  test('should detect crisis keywords and trigger isCritical true', () => {
    const crisisInputs = [
      { msg: 'I want to kill myself, I feel hopeless', trigger: 'kill myself' },
      { msg: 'I keep thinking about suicide', trigger: 'suicide' },
      { msg: 'I think I am going to hurt myself tonight', trigger: 'hurt myself' },
      { msg: 'My parents are abuse and hit me', trigger: 'abuse' }
    ];

    crisisInputs.forEach(({ msg, trigger }) => {
      const result = analyzeDistress(msg);
      expect(result.isCritical).toBe(true);
      expect(result.score).toBe(1.0);
      expect(result.trigger).toBe(trigger);
    });
  });

  test('should handle empty, null, or invalid input types gracefully', () => {
    expect(analyzeDistress('')).toEqual({ isCritical: false, score: 0 });
    expect(analyzeDistress(null)).toEqual({ isCritical: false, score: 0 });
    expect(analyzeDistress(undefined)).toEqual({ isCritical: false, score: 0 });
    expect(analyzeDistress(12345)).toEqual({ isCritical: false, score: 0 });
    expect(analyzeDistress({})).toEqual({ isCritical: false, score: 0 });
  });
});
