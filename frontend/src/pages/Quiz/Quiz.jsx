import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Settings,
  Heart,
  Brain,
  ClipboardList,
  Clock,
  ShieldCheck,
  BarChart3,
  Check,
  X,
  RefreshCcw,
  LayoutDashboard,
  ChevronLeft,
  Activity
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { useSaveAssessment } from '../../hooks/useAssessments';
import useAuthStore from '../../store/authStore';
import styles from './Quiz.module.css';

const allQuestions = [
  { label: 'Does the child make eye contact during conversations?', name: 'q1', category: 'Social' },
  { label: 'Does the child respond when called by name?', name: 'q2', category: 'Communication' },
  { label: 'Is the child constantly on the go or unable to sit still?', name: 'q3', category: 'Behavioural', reverse: true },
  { label: 'Does the child show interest in playing with other children?', name: 'q4', category: 'Social' },
  { label: 'Can the child express basic emotions (happy, sad, angry)?', name: 'q5', category: 'Emotional' },
  { label: 'Does the child follow simple instructions (e.g., "pick up the toy")?', name: 'q6', category: 'Cognitive' },
  { label: 'Does the child get upset by sudden changes in routine?', name: 'q7', category: 'Behavioural', reverse: true },
  { label: 'Does the child use gestures like pointing or waving?', name: 'q8', category: 'Communication' },
  { label: 'Can the child identify familiar people (parents, siblings)?', name: 'q9', category: 'Cognitive' },
  { label: 'Does the child show empathy when someone is upset?', name: 'q10', category: 'Emotional' },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [localResult, setLocalResult] = useState(null);
  const navigate = useNavigate();
  const { setResult } = useQuiz();
  const user = useAuthStore(state => state.user);
  const { mutate: saveAssessment } = useSaveAssessment();

  const totalQuestions = allQuestions.length;
  const currentQ = allQuestions[step - 1];
  const progress = step / (totalQuestions + 1);

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [step]: val };
    setAnswers(newAnswers);

    if (step < totalQuestions) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let scoreCount = 0;
    allQuestions.forEach((q, idx) => {
      const answer = finalAnswers[idx + 1];
      if (q.reverse) {
        if (answer === 'no') scoreCount++;
      } else {
        if (answer === 'yes') scoreCount++;
      }
    });

    const score = Math.round((scoreCount / totalQuestions) * 100);
    
    let type = 'fine';
    let text = 'Great! Your child seems to be meeting key developmental milestones on track. Continue providing a supportive environment.';
    
    if (score < 50) {
      type = 'alert';
      text = 'We noticed some areas where your child might need additional support. We recommend consulting a developmental specialist for a professional evaluation.';
    } else if (score < 80) {
      type = 'moderate';
      text = 'Your child is doing well, but there are a few areas that could benefit from extra attention and guided play activities.';
    }

    const res = { score, text, type };
    setLocalResult(res);
    setResult(res);
    setStep(totalQuestions + 1);

    // Save to backend if user is logged in
    if (user) {
      saveAssessment({
        score,
        resultType: type === 'moderate' ? 'warning' : type,
        summary: text,
        responses: finalAnswers
      });
    }
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({});
    setLocalResult(null);
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      Social: Users,
      Communication: MessageSquare,
      Behavioural: Settings,
      Emotional: Heart,
      Cognitive: Brain
    };
    const Icon = icons[cat] || Activity;
    return <Icon size={16} />;
  };

  return (
    <div className={styles.quizPage}>
      {user && (
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#475569',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </button>
      )}

      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress * 100}%` }}></div>
      </div>

      <div className={styles.quizCard}>
        {/* Step 0: Intro */}
        {step === 0 && (
          <div className={styles.introStep}>
            <div className={styles.introIcon}>
              <Activity size={48} color="#8c2a30" />
            </div>
            <h2>Quick Milestone Check</h2>
            <p>This short quiz helps you understand your child's emotional and social development.</p>
            <ul className={styles.infoList}>
              <li><ClipboardList size={18} /> {totalQuestions} simple Yes/No questions</li>
              <li><Clock size={18} /> Takes about 2 minutes</li>
              <li><ShieldCheck size={18} /> Your answers stay private</li>
              <li><BarChart3 size={18} /> Get instant guidance</li>
            </ul>
            <button onClick={() => setStep(1)} className={styles.startBtn}>Begin Assessment</button>
          </div>
        )}

        {/* Steps 1..N: Questions */}
        {currentQ && (
          <div className={styles.questionStep}>
            <div className={styles.questionMeta}>
              <span className={styles.categoryBadge}>
                {getCategoryIcon(currentQ.category)}
                <span className={styles.catLabel}>{currentQ.category}</span>
              </span>
              <span className={styles.counter}>
                Question {step} of {totalQuestions}
              </span>
            </div>

            <h2 className={styles.questionText}>{currentQ.label}</h2>

            <div className={styles.answerBtns}>
              <button
                className={`${styles.answerBtn} ${styles.yesBtn}`}
                onClick={() => handleAnswer('yes')}
              >
                <Check size={20} />
                <span>Yes</span>
              </button>
              <button
                className={`${styles.answerBtn} ${styles.noBtn}`}
                onClick={() => handleAnswer('no')}
              >
                <X size={20} />
                <span>No</span>
              </button>
            </div>

            {step > 1 && (
              <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
                <ChevronLeft size={18} />
                <span>Previous Question</span>
              </button>
            )}
          </div>
        )}

        {/* Final: Result */}
        {localResult && step > totalQuestions && (
          <div className={styles.resultStep}>
            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 120 120" className={styles.scoreSvg}>
                <circle cx="60" cy="60" r="52" className={styles.scoreTrack} />
                <circle
                  cx="60" cy="60" r="52"
                  className={`${styles.scoreFill} ${localResult.type === 'alert' ? styles.fillAlert :
                      localResult.type === 'moderate' ? styles.fillModerate : styles.fillFine
                    }`}
                  strokeDasharray={`${localResult.score * 3.27} 327`}
                />
              </svg>
              <span className={styles.scoreValue}>{localResult.score}%</span>
            </div>

            <div className={`${styles.resultBox} ${localResult.type === 'alert' ? styles.alert :
                localResult.type === 'moderate' ? styles.moderate : styles.fine
              }`}>
              <p>{localResult.text}</p>
            </div>

            <div className={styles.resultActions}>
              <button onClick={handleRetake} className={styles.retakeBtn}>
                <RefreshCcw size={18} />
                <span>Retake Quiz</span>
              </button>
              {user ? (
                <button onClick={() => navigate('/dashboard')} className={styles.dashBtn}>
                  <LayoutDashboard size={18} />
                  <span>View Dashboard</span>
                </button>
              ) : (
                <button onClick={() => navigate('/signup')} className={styles.dashBtn}>
                  <LayoutDashboard size={18} />
                  <span>Sign up to track progress</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
