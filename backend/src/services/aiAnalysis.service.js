/**
 * AI Analysis Service
 * Evaluates Quick Quiz and Screening Module questionnaires using Gemini,
 * and falls back to a rule-based evaluation if GEMINI_API_KEY is not defined.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Perform AI analysis on developmental questions and milestones.
 * @param {Object} params
 * @param {string} params.type - 'quiz' | 'screening'
 * @param {Object} params.responses - Map of question labels/IDs to user answers
 * @param {string} [params.ageGroup] - Child's age group (e.g. '3-5')
 * @param {Object} [params.milestones] - Map of milestone text to boolean checked status
 */
async function analyzeResponses({ type, responses, ageGroup = '', milestones = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        },
        systemInstruction: `You are MindBloom's child development AI assistant. You act as a compassionate, professional developmental pediatrician and child psychologist.
Analyze the child's developmental check answers (and milestone checklist, if provided) to provide an accurate evaluation.
Output your response as a valid JSON object matching the following structure:
{
  "score": 85, // integer 0-100 indicating milestone meeting rate/score
  "resultType": "fine", // must be exactly one of: "fine" (Green/on track), "warning" (Yellow/needs attention), "alert" (Red/consult specialist)
  "summary": "Detailed, empathetic summary of the child's development...",
  "recommendations": [
    "Specific activity recommendation 1 with practical steps.",
    "Specific activity recommendation 2..."
  ],
  "detailedBreakdown": {
    "social": "Detailed analysis of social milestones...",
    "communication": "Detailed analysis of communication milestones...",
    "cognitive": "Detailed analysis of cognitive milestones...",
    "behavioural": "Detailed analysis of behavioural milestones..."
  }
}

Guidelines for evaluation:
- Keep the tone warm, reassuring, but professional and objective.
- Always include a clear disclaimer that this is educational, non-diagnostic guidance, and consulting a pediatrician is recommended for severe concerns.
- If answers suggest difficulties (e.g., struggles with eye contact, expressing feelings, repetitive movements, severe tantrums, reading/writing difficulties), assign appropriate "warning" or "alert" flag and write specific suggestions addressing those specific categories.`
      });

      const prompt = `
Analyze this assessment:
Type: ${type}
Age Group: ${ageGroup || 'N/A'}

Responses (Question -> Answer):
${JSON.stringify(responses, null, 2)}

Milestones Checked Status (if screening):
${JSON.stringify(milestones, null, 2)}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (err) {
      console.error('Gemini AI Analysis failed, falling back to rule-based analysis:', err);
      // Fallback on API call error
    }
  }

  // Graceful rule-based fallback
  return runRuleBasedAnalysis({ type, responses, ageGroup, milestones });
}

/**
 * Fallback local rule-based analysis
 */
function runRuleBasedAnalysis({ type, responses, ageGroup, milestones }) {
  let score = 50;
  let scoreCount = 0;
  let totalCount = 0;
  let criticalFlags = 0;

  // Simple response parsing to calculate a score
  Object.entries(responses).forEach(([key, val]) => {
    totalCount++;
    const answer = String(val).toLowerCase();
    
    // In Quick Quiz (Yes/No), Yes is generally positive, unless reverse.
    // In Screening, positive answers are: "Plays cooperatively", "Consistently", "Most of the time", "Always", "Usually", "Very easily", "Somewhat easily", "Shows empathy/comforts", "Rarely or never", "No difficulty"
    const positiveOptions = [
      'yes', 'plays cooperatively', 'consistently', 'most of the time', 
      'always', 'usually', 'very easily', 'somewhat easily', 
      'shows empathy/comforts', 'rarely or never', 'no difficulty', 'mild difficulty'
    ];
    const negativeOptions = [
      'no', 'avoids other children', 'rarely', 'with some difficulty', 
      'very difficult', 'constantly', 'often', 'almost always', 
      'moderate difficulty', 'severe difficulty'
    ];

    if (positiveOptions.some(opt => answer.includes(opt))) {
      scoreCount += 1.0;
    } else if (negativeOptions.some(opt => answer.includes(opt))) {
      scoreCount += 0.0;
      if (['constantly', 'often', 'almost always', 'severe difficulty'].some(opt => answer.includes(opt))) {
        criticalFlags++;
      }
    } else {
      // Middle answers (like "Sometimes", "Plays alongside but separate", "Watches but doesn't join")
      scoreCount += 0.5;
    }
  });

  if (totalCount > 0) {
    score = Math.round((scoreCount / totalCount) * 100);
  }

  // Adjust score if milestone checklist is provided
  if (milestones && Object.keys(milestones).length > 0) {
    const totalMilestones = Object.keys(milestones).length;
    const metMilestones = Object.values(milestones).filter(Boolean).length;
    const milestoneScore = Math.round((metMilestones / totalMilestones) * 100);
    // Combine questionnaire (60%) and milestones (40%)
    score = Math.round((score * 0.6) + (milestoneScore * 0.4));
  }

  let resultType = 'fine';
  let summary = '';
  let recommendations = [];

  if (score < 50 || criticalFlags >= 2) {
    resultType = 'alert';
    summary = `Based on the assessment, your child is experiencing significant challenges in meeting several developmental milestones for their age group (${ageGroup || 'checked age'}). We detected concerns in areas like behavioral regulation, learning support, or social communication. We strongly recommend sharing these findings with a pediatrician or developmental specialist for a comprehensive clinical evaluation.`;
    recommendations = [
      "Schedule a consultation with your primary care pediatrician to discuss these specific indicators.",
      "Engage in structured, low-stress cooperative play for 15-20 minutes daily, letting the child lead the activity.",
      "Establish a highly consistent daily visual routine to reduce behavioral tantrums and help them feel secure.",
      "Incorporate tactile/fine-motor exercises like playdough or sensory bins to build muscle coordination and focus."
    ];
  } else if (score < 80) {
    resultType = 'warning';
    summary = `Your child is progressing well overall but could benefit from targeted support in a few developmental milestones. There are moderate indicators in communication, attention, or social interaction where additional focus would be highly beneficial.`;
    recommendations = [
      "Incorporate interactive reading sessions—ask open-ended questions about the characters' feelings and actions.",
      "Practice turn-taking games (e.g., board games or rolling a ball back and forth) to strengthen social-emotional development.",
      "Break down multi-step instructions into clear, single actions and praise your child immediately upon completion.",
      "Design quiet spaces or structured play times to help them develop attention focus in a distraction-free environment."
    ];
  } else {
    resultType = 'fine';
    summary = `Fantastic! Your child is meeting key developmental milestones on track for their age group. They show healthy indicators across social, emotional, and cognitive categories. Keep encouraging their natural curiosity and growth in a supportive home environment.`;
    recommendations = [
      "Provide open-ended play materials like building blocks, art supplies, and dress-up clothes to encourage creative thinking.",
      "Visit local parks, libraries, or community playgroups to continue supporting cooperative peer interactions.",
      "Keep practicing verbal expression by asking them to tell stories or explain how their favorite objects work."
    ];
  }

  return {
    score,
    resultType,
    summary,
    recommendations,
    detailedBreakdown: {
      social: "Social interactions are developing normally, encourage cooperative play and shared attention.",
      communication: "Communication skills appear consistent. Continue to expand vocabulary and conversational turn-taking.",
      cognitive: "Cognitive skills show good progress. Promote problem-solving through puzzle solving and counting games.",
      behavioural: "Behavior is adaptive. Support emotional self-regulation through consistent routines and boundaries."
    }
  };
}

module.exports = {
  analyzeResponses
};
