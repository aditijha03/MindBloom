import { useState, useEffect } from 'react';
import { 
  Palette, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import { MILESTONES_DB, SCREENING_QUIZ } from '../../data/screening';
import { useQuiz } from '../../context/QuizContext';
import { useSaveAssessment } from '../../hooks/useAssessments';
import styles from './ScreeningModule.module.css';

import { useLocation, Link } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';

export default function ScreeningModule() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'milestones';
  });
  const [ageGroup, setAgeGroup] = useState('3-4');
  const [checkedMilestones, setCheckedMilestones] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [finalResult, setFinalResult] = useState(null);
  const { setResult } = useQuiz();
  const { mutate: saveAssessment } = useSaveAssessment();

  const milestones = MILESTONES_DB[ageGroup] || [];
  
  const handleMilestoneToggle = (m) => {
    setCheckedMilestones(prev => ({...prev, [m]: !prev[m]}));
  };

  const progress = milestones.length > 0 
    ? Math.round((Object.keys(checkedMilestones).filter(k => checkedMilestones[k]).length / milestones.length) * 100) 
    : 0;

  const handleQuizAnswer = (id, opt) => {
    setQuizAnswers(prev => ({...prev, [id]: opt}));
  };

  const calculateScore = () => {
    if (Object.keys(quizAnswers).length < SCREENING_QUIZ.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let totalPoints = 0;
    const maxPoints = SCREENING_QUIZ.length * 3;

    SCREENING_QUIZ.forEach(q => {
      const answer = quizAnswers[q.id];
      if (answer) {
        const optionIndex = q.options.indexOf(answer);
        if (optionIndex !== -1) {
          totalPoints += (3 - optionIndex); // Index 0 = 3 pts, 3 = 0 pts
        }
      }
    });

    const score = Math.round((totalPoints / maxPoints) * 100);
    
    let flag = 'Green';
    let message = 'Your child is meeting most developmental milestones well. Continue to encourage their growth with guided play.';
    
    if (score < 50) {
      flag = 'Red';
      message = 'We noticed some areas where your child might need additional support. We recommend consulting a developmental specialist for a professional evaluation.';
    } else if (score < 80) {
      flag = 'Yellow';
      message = 'Your child is doing well, but there are a few areas that could benefit from extra attention and guided play activities.';
    }
    
    setFinalResult({ score, flag, message });
    if (setResult) setResult({ score, text: message, type: flag === 'Green' ? 'fine' : (flag === 'Yellow' ? 'moderate' : 'alert') });
    setActiveTab('result');

    // Save actual screening to database for progress tracking
    saveAssessment({
      score,
      resultType: flag === 'Green' ? 'fine' : (flag === 'Yellow' ? 'warning' : 'alert'),
      summary: message,
      responses: quizAnswers
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Developmental Screening</h1>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'milestones' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            1. Milestones
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'quiz' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            2. Detailed Quiz
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'result' ? styles.activeTab : ''}`}
            disabled={!finalResult}
            onClick={() => setActiveTab('result')}
          >
            3. Result
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {activeTab === 'milestones' && (
          <section className={styles.milestoneSection}>
            <div className={styles.controls}>
              <h3>Milestones for {ageGroup} years</h3>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className={styles.ageSelect}>
                {Object.keys(MILESTONES_DB).map(age => (
                  <option key={age} value={age}>{age} yrs</option>
                ))}
              </select>
            </div>

            <div className={styles.progressBox}>
              <div className={styles.progressLabels}>
                <span>Completion Progress</span>
                <span>{progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className={styles.milestoneList}>
              {milestones.map((m, i) => (
                <label key={i} className={styles.milestoneItem}>
                  <input 
                    type="checkbox" 
                    checked={!!checkedMilestones[m]} 
                    onChange={() => handleMilestoneToggle(m)}
                  />
                  <span className={styles.milestoneText}>{m}</span>
                </label>
              ))}
            </div>

            <div className={styles.actionRow}>
              <button className={styles.primaryBtn} onClick={() => setActiveTab('quiz')}>
                <span>Next: Take Detailed Quiz</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        )}

        {activeTab === 'quiz' && (
          <section className={styles.quizSection}>
            <div className={styles.quizHeader}>
              <h3>Developmental Questionnaire</h3>
              <p>Answer these 10 questions to help us assess your child's social, communication, behavioural, emotional, and cognitive development.</p>
            </div>

            <div className={styles.questionList}>
              {SCREENING_QUIZ.map((q) => (
                <div key={q.id} className={`${styles.questionCard} ${quizAnswers[q.id] ? styles.answered : ''}`}>
                  <div className={styles.questionMeta}>
                    <span className={styles.categoryBadge}>{q.category}</span>
                    <span className={styles.questionCounter}>Q{q.id} of {SCREENING_QUIZ.length}</span>
                  </div>
                  <p className={styles.questionText}>{q.question}</p>
                  <div className={styles.optionsGrid}>
                    {q.options.map(opt => (
                      <button 
                        key={opt}
                        className={`${styles.optionBtn} ${quizAnswers[q.id] === opt ? styles.activeOption : ''}`}
                        onClick={() => handleQuizAnswer(q.id, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actionRow}>
              <button className={styles.secondaryBtn} onClick={() => setActiveTab('milestones')}>
                <ChevronLeft size={18} />
                <span>Back to Milestones</span>
              </button>
              <button className={styles.primaryBtn} onClick={calculateScore}>
                <span>Submit & See Result</span>
              </button>
            </div>
          </section>
        )}

        {activeTab === 'result' && finalResult && (
          <section className={styles.resultSection}>
            <div className={`${styles.resultCard} ${styles[finalResult.flag.toLowerCase()]}`}>
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 36 36" className={styles.circularChart}>
                  <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={styles.circle} strokeDasharray={`${finalResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className={styles.percentage}>{finalResult.score}%</text>
                </svg>
              </div>
              
              <div className={styles.resultMeta}>
                <div className={styles.flagHeader}>
                  {finalResult.flag === 'Green' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className={styles.flagBadge}>{finalResult.flag} Flag</span>
                </div>
                <h2>Developmental Summary</h2>
                <p className={styles.resultMessage}>{finalResult.message}</p>
                
                {finalResult.flag !== 'Green' && (
                  <div className={styles.specialistBox}>
                    <p>It's always better to be sure. Talk to a professional today.</p>
                    <Link to="/contact" className={styles.consultBtn}>
                      <UserPlus size={18} />
                      <span>Consult a Specialist</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3>Next Steps</h3>
              <div className={styles.stepsGrid}>
                <Link to="/activities" className={styles.stepCard}>
                  <div className={styles.stepIconBox}>
                    <Palette size={24} color="#8c2a30" />
                  </div>
                  <h4>Try Recommended Activities</h4>
                  <p>Based on your result, we've picked activities to support growth.</p>
                </Link>
                <Link to="/progress" className={styles.stepCard}>
                  <div className={styles.stepIconBox}>
                    <BarChart3 size={24} color="#8c2a30" />
                  </div>
                  <h4>Track Progress</h4>
                  <p>Keep a regular log of milestones to see improvements over time.</p>
                </Link>
              </div>
              <button className={styles.retakeBtn} onClick={() => { setQuizAnswers({}); setFinalResult(null); setActiveTab('milestones'); }}>
                <RefreshCcw size={18} />
                <span>Retake Screening</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
