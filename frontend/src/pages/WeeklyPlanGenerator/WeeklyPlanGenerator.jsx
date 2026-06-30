import { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  Printer,
  Calendar,
  Target,
  Zap,
  Bell,
  Plus,
  Trash2
} from 'lucide-react';
import { ACTIVITIES_DB } from '../../data/activities';
import api from '../../api/client';
import styles from './WeeklyPlanGenerator.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CONCERN_TO_SKILL = {
  'Speech Delay': 'Speech & Language',
  'Social Interaction': 'Social & Emotional',
  'Sensory Issues': 'Sensory',
  'Motor Skills': 'Gross & Fine Motor',
  'Focus & Attention': 'Cognitive / Thinking',
  'Emotional Regulation': 'Social & Emotional',
};

const DOMAIN_COLORS = {
  'Speech & Language': '#5492e3',
  'Social & Emotional': '#ec4899',
  'Sensory': '#8b5cf6',
  'Gross & Fine Motor': '#22c55e',
  'Cognitive / Thinking': '#f59e0b',
};

export default function WeeklyPlanGenerator() {
  const [ageGroup, setAgeGroup] = useState('3-5');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [minutes, setMinutes] = useState(30);
  const [plan, setPlan] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  // 1. Initial Load: Load weekly plan and reminders from PostgreSQL
  useEffect(() => {
    const loadData = async () => {
      try {
        const planRes = await api.get('/weekly-plans');
        if (planRes.data && planRes.data.data.plan) {
          const activePlan = planRes.data.data.plan;
          setPlan(activePlan);
          setFeedback(activePlan.feedback || {});
        }

        const remindersRes = await api.get('/reminders');
        if (remindersRes.data && remindersRes.data.data.reminders) {
          setReminders(remindersRes.data.data.reminders);
        }
      } catch (err) {
        console.error('Failed to load weekly plan data from database:', err);
      }
    };

    loadData();

    // Pre-fill from child profile if available
    const profile = JSON.parse(localStorage.getItem('mbChildProfile') || '{}');
    if (profile.age) {
      const age = parseInt(profile.age);
      if (age <= 2) setAgeGroup('0-2');
      else if (age <= 5) setAgeGroup('3-5');
      else setAgeGroup('6-8');
    }
  }, []);

  const addReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;

    try {
      const { data } = await api.post('/reminders', {
        text: newReminder,
        time: reminderTime
      });

      if (data && data.data.reminder) {
        setReminders([...reminders, data.data.reminder]);
        setNewReminder('');
      }
    } catch (err) {
      console.error('Failed to save reminder:', err);
      // Local fallback
      setReminders([...reminders, { id: Date.now(), text: newReminder, time: reminderTime }]);
      setNewReminder('');
    }
  };

  const deleteReminder = async (id) => {
    try {
      if (typeof id === 'string') {
        await api.delete(`/reminders/${id}`);
      }
      setReminders(reminders.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  const concerns = [
    'Speech Delay', 'Social Interaction', 'Sensory Issues',
    'Motor Skills', 'Focus & Attention', 'Emotional Regulation'
  ];

  const handleConcernToggle = (c) => {
    setSelectedConcerns(prev =>
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const generatePlan = async () => {
    let pool = ACTIVITIES_DB.filter(a => a.age === ageGroup);

    // Prioritize activities matching selected concerns
    if (selectedConcerns.length > 0) {
      const targetSkills = selectedConcerns.map(c => CONCERN_TO_SKILL[c]).filter(Boolean);
      const preferred = pool.filter(a => targetSkills.includes(a.skill));
      const rest = pool.filter(a => !targetSkills.includes(a.skill));
      pool = [...preferred, ...rest];
    }

    // Shuffle for variety
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    const profile = JSON.parse(localStorage.getItem('mbChildProfile') || '{}');
    const childId = profile?.id || null;

    const planPayload = {
      childId,
      ageGroup,
      minutes,
      concerns: selectedConcerns,
      activities: DAYS.map((day, i) => ({
        day,
        activity: shuffled[i % shuffled.length] || shuffled[0],
      }))
    };

    try {
      const { data } = await api.post('/weekly-plans', planPayload);
      if (data && data.data.plan) {
        setPlan(data.data.plan);
        setFeedback({});
      }
    } catch (err) {
      console.error('Failed to save weekly plan:', err);
      // Fallback
      setPlan({
        id: 'local-fallback',
        createdAt: new Date().toISOString(),
        activities: planPayload.activities
      });
      setFeedback({});
    }
  };

  const handleFeedback = async (dayIdx, status) => {
    const newStatus = feedback[dayIdx] === status ? null : status;
    const updatedFeedback = { ...feedback, [dayIdx]: newStatus };
    setFeedback(updatedFeedback);

    if (plan && plan.id && plan.id !== 'local-fallback') {
      try {
        await api.patch(`/weekly-plans/${plan.id}/feedback`, { feedback: updatedFeedback });
      } catch (err) {
        console.error('Failed to update weekly plan feedback:', err);
      }
    }
  };

  const doneCount = Object.values(feedback).filter(f => f === 'done').length;
  const partialCount = Object.values(feedback).filter(f => f === 'partial').length;
  const skippedCount = Object.values(feedback).filter(f => f === 'skipped').length;
  const completionPct = plan ? Math.round(((doneCount + partialCount * 0.5) / 7) * 100) : 0;

  const getDomainColor = (skill) => DOMAIN_COLORS[skill] || '#F64A8A';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Calendar size={28} color="#F64A8A" />
        </div>
        <div>
          <h1>Weekly Plan Generator</h1>
          <p>Get a personalised 7-day developmental activity schedule tailored to your child's needs.</p>
        </div>
      </header>

      {!plan ? (
        <section className={styles.formCard}>
          <div className={styles.formGrid}>
            {/* Age Group */}
            <div className={styles.inputGroup}>
              <label>Child's Age Group</label>
              <div className={styles.ageGrid}>
                {[['0-2', '0–2 Years', '👶'], ['3-5', '3–5 Years', '🧒'], ['6-8', '6–8 Years', '🧑']].map(([val, label, emoji]) => (
                  <button
                    key={val}
                    className={`${styles.ageBtn} ${ageGroup === val ? styles.ageBtnActive : ''}`}
                    onClick={() => setAgeGroup(val)}
                  >
                    <span className={styles.ageEmoji}>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div className={styles.inputGroup}>
              <label>Areas of Focus <span className={styles.optional}>(Optional)</span></label>
              <div className={styles.concernGrid}>
                {concerns.map(c => (
                  <button
                    key={c}
                    className={`${styles.concernBtn} ${selectedConcerns.includes(c) ? styles.concernActive : ''}`}
                    onClick={() => handleConcernToggle(c)}
                  >
                    {selectedConcerns.includes(c) && <CheckCircle2 size={14} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slider */}
            <div className={styles.inputGroup}>
              <label>
                Available Daily Time &nbsp;
                <span className={styles.minutesBadge}>{minutes} mins / day</span>
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>15m</span><span>30m</span><span>45m</span><span>60m</span><span>75m</span><span>90m</span><span>120m</span>
              </div>
            </div>
          </div>

          <button className={styles.generateBtn} onClick={generatePlan}>
            <Sparkles size={20} />
            <span>Generate My Weekly Plan</span>
          </button>
        </section>
      ) : (
        <section className={styles.planSection}>
          {/* Plan Toolbar */}
          <div className={styles.planToolbar}>
            <button className={styles.backBtn} onClick={() => setPlan(null)}>
              <ArrowLeft size={16} />
              <span>Change Settings</span>
            </button>
            <div className={styles.toolbarRight}>
              <button className={styles.regenerateBtn} onClick={generatePlan}>
                <RefreshCcw size={16} />
                <span>Regenerate</span>
              </button>
              <button className={styles.printBtn} onClick={() => window.print()}>
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Completion Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <Target size={18} color="#22c55e" />
              <div>
                <div className={styles.statNum}>{doneCount}</div>
                <div className={styles.statLabel}>Completed</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <Clock size={18} color="#f59e0b" />
              <div>
                <div className={styles.statNum}>{partialCount}</div>
                <div className={styles.statLabel}>Partial</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <XCircle size={18} color="#ef4444" />
              <div>
                <div className={styles.statNum}>{skippedCount}</div>
                <div className={styles.statLabel}>Skipped</div>
              </div>
            </div>
            <div className={styles.progressBarWrap}>
              <div className={styles.progressBarLabel}>
                <span>Weekly Progress</span>
                <strong>{completionPct}%</strong>
              </div>
              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill} style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.85rem', color: '#666' }}>
            Plan generated on: {new Date(plan.createdAt).toLocaleDateString()}
          </div>

          {/* 7-Day Grid */}
          <div className={styles.weekGrid}>
            {plan.activities.map((dayPlan, dayIdx) => {
              const act = dayPlan.activity;
              const status = feedback[dayIdx];
              const domainColor = getDomainColor(act?.skill);
              return (
                <div
                  key={dayPlan.day}
                  className={`${styles.dayColumn} ${status === 'done' ? styles.colDone : status === 'partial' ? styles.colPartial : status === 'skipped' ? styles.colSkipped : ''}`}
                >
                  {/* Day Header */}
                  <div className={styles.dayHeader} style={{ borderColor: domainColor }}>
                    <span className={styles.dayShort}>{DAY_SHORT[dayIdx]}</span>
                    <span className={styles.dayFull}>{dayPlan.day}</span>
                  </div>

                  {act ? (
                    <div className={styles.actBody}>
                      <span className={styles.skillBadge} style={{ backgroundColor: `${domainColor}18`, color: domainColor }}>
                        {act.skill}
                      </span>
                      <h4 className={styles.actName}>{act.name}</h4>
                      <p className={styles.actSteps}>{act.steps}</p>
                      <div className={styles.timePill}>
                        <Clock size={12} />
                        <span>{minutes} min</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.restDay}>
                      <span>🌟 Rest Day</span>
                    </div>
                  )}

                  {/* Feedback Buttons */}
                  <div className={styles.feedbackRow}>
                    <button
                      className={`${styles.fBtn} ${status === 'done' ? styles.fDoneActive : ''}`}
                      onClick={() => handleFeedback(dayIdx, 'done')}
                      title="Completed"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                    <button
                      className={`${styles.fBtn} ${status === 'partial' ? styles.fPartialActive : ''}`}
                      onClick={() => handleFeedback(dayIdx, 'partial')}
                      title="Partial"
                    >
                      <Clock size={15} />
                    </button>
                    <button
                      className={`${styles.fBtn} ${status === 'skipped' ? styles.fSkippedActive : ''}`}
                      onClick={() => handleFeedback(dayIdx, 'skipped')}
                      title="Skipped"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={styles.tip}>
            <Zap size={14} /> <strong>Tip:</strong> Mark each activity as Done, Partial, or Skipped to track your week. Click "Regenerate" to get a fresh plan.
          </p>

          <section className={styles.reminderCard}>
            <div className={styles.cardHeader}>
              <Bell size={20} color="#F64A8A" />
              <h3 className={styles.cardTitle}>Daily Reminders</h3>
            </div>
            <p className={styles.reminderDesc}>Set specific times for developmental habits like reading or stretching.</p>
            
            <form className={styles.reminderForm} onSubmit={addReminder}>
              <input 
                type="text" 
                placeholder="Remind me to..." 
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                className={styles.input}
              />
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className={styles.timeInput}
              />
              <button type="submit" className={styles.addBtn}>
                <Plus size={20} />
              </button>
            </form>

            <div className={styles.reminderList}>
              {reminders.map(r => (
                <div key={r.id} className={styles.reminderItem}>
                  <div className={styles.rInfo}>
                    <span className={styles.rTime}>{r.time}</span>
                    <span className={styles.rText}>{r.text}</span>
                  </div>
                  <button className={styles.delBtn} onClick={() => deleteReminder(r.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {reminders.length === 0 && (
                <div className={styles.emptyReminders}>No reminders set for today.</div>
              )}
            </div>
          </section>
        </section>
      )}
    </div>
  );
}
