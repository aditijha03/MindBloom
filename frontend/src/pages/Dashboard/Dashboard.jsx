import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smile, 
  Meh, 
  Frown, 
  Zap, 
  Palette, 
  Search, 
  LineChart, 
  Calendar, 
  Heart,
  Award,
  Baby,
  UserCheck,
  SmilePlus
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useMe } from '../../hooks/useProfile';
import { useQuiz } from '../../context/QuizContext';
import styles from './Dashboard.module.css';

const quotes = [
  "Play is the highest form of research.",
  "Every child is a different kind of flower, and all together, make this world a beautiful garden.",
  "Children are not things to be molded, but are people to be unfolded.",
  "There is no such thing as a perfect parent. So just be a real one."
];

export default function Dashboard() {
  const user = useAuthStore(state => state.user);
  const { data: apiProfile, isLoading: isProfileLoading } = useMe();
  const { result } = useQuiz();
  const [profile, setProfile] = useState(null);
  const [mood, setMood] = useState('');
  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('mbChildProfile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const parentName = apiProfile?.display_name || user?.displayName || 'Parent';
  const childName = profile?.name || 'Your Child';
  const childAge = profile?.age || '3';

  const moods = [
    { icon: Smile, label: 'Happy' },
    { icon: Meh, label: 'Neutral' },
    { icon: Frown, label: 'Sad' },
    { icon: Frown, label: 'Angry' },
    { icon: Zap, label: 'Excited' },
  ];

  const tools = [
    { id: 'activities', title: 'Activity Library', desc: 'Personalised developmental play', icon: Palette, color: 'pink', link: '/activities' },
    { id: 'screening', title: 'Developmental Screening', desc: 'Milestone tracking & quiz', icon: Search, color: 'blue', link: '/screening' },
    { id: 'progress', title: 'Progress Tracking', desc: 'Visual charts of growth', icon: LineChart, color: 'green', link: '/progress' },
    { id: 'weekly', title: 'Weekly Plan', desc: 'Tailored 7-day guidance', icon: Calendar, color: 'purple', link: '/weekly' },
    { id: 'parent', title: 'Parent Guidance', icon: Heart, desc: 'Forum & support tools', color: 'orange', link: '/parent' },
  ];

  const milestones = [
    { age: '0-1', label: 'First words, crawling, and responsive smiles.' },
    { age: '1-2', label: 'Walking, short phrases, and early pretend play.' },
    { age: '2-3', label: 'Running, sentences, and playing alongside peers.' },
    { age: '3-4', label: 'Complex stories, drawing, and interactive play.' },
    { age: '4-5', label: 'Following rules, clear speech, and skipping.' },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <p className={styles.greetLabel}>{greeting},</p>
            <h1>{parentName}</h1>
            <p className={styles.quoteText}>"{quote}"</p>
          </div>
          <div className={styles.dateBadge}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </section>

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.pink}`}>
            <Award size={20} className={styles.statIcon} />
            <div className={styles.statData}>
              <h4>Quiz Score</h4>
              <p>{result ? `${result.score}%` : 'N/A'}</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.blue}`}>
            <Baby size={20} className={styles.statIcon} />
            <div className={styles.statData}>
              <h4>Current Age</h4>
              <p>{childAge} yrs</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.green}`}>
            <UserCheck size={20} className={styles.statIcon} />
            <div className={styles.statData}>
              <h4>Profile</h4>
              <p>Verified</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.purple}`}>
            <SmilePlus size={20} className={styles.statIcon} />
            <div className={styles.statData}>
              <h4>Daily Mood</h4>
              <p>{mood || 'Set Mood'}</p>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Tools & Features</h3>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <Link key={tool.id} to={tool.link} className={`${styles.toolCard} ${styles[tool.color]}`}>
                <tool.icon size={24} className={styles.toolIcon} />
                <div className={styles.toolInfo}>
                  <strong>{tool.title}</strong>
                  <p>{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.dashboardRow}>
          {/* Mood Selector */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>How is {childName} feeling today?</h3>
            <div className={styles.moodRow}>
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`${styles.moodBtn} ${mood === m.label ? styles.activeMood : ''}`}
                  onClick={() => setMood(m.label)}
                >
                  <m.icon size={20} className={styles.moodIcon} />
                  <span className={styles.moodLabel}>{m.label}</span>
                </button>
              ))}
            </div>
            {mood && (
              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', color: '#831843', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Heart size={16} />
                <span>
                  <strong>Quick Suggestion: </strong>
                  {mood === 'Happy' && "Awesome! Let's celebrate with a fun indoor game or activity."}
                  {mood === 'Neutral' && "A great time for a calm reading session or quiet play together."}
                  {mood === 'Sad' && "It's okay to feel down. Try offering a warm hug and listening."}
                  {mood === 'Angry' && "Big feelings! Try guiding them through a quick 5-breath cooldown."}
                  {mood === 'Excited' && "So much energy! Channel it into a fun, creative drawing or dance."}
                </span>
              </div>
            )}
          </section>

          {/* Milestones */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Developmental Milestones</h3>
            <div className={styles.timeline}>
              {milestones.map((m, i) => (
                <div key={i} className={`${styles.timelineItem} ${
                  parseInt(childAge) >= parseInt(m.age.split('-')[0]) &&
                  parseInt(childAge) <= parseInt(m.age.split('-')[1])
                    ? styles.timelineCurrent : ''
                }`}>
                  <div className={styles.timelineMarker}></div>
                  <div className={styles.timelineInfo}>
                    <span className={styles.timelineAge}>{m.age} yrs</span>
                    <p>{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Concerns */}
        {profile?.concerns && (
          <section className={`${styles.card} ${styles.concernsCard}`}>
            <h3 className={styles.cardTitle}>Recent Concerns</h3>
            <p>{profile.concerns}</p>
            <Link to="/contact" className={styles.concernLink}>Consult a specialist →</Link>
          </section>
        )}
      </main>
    </div>
  );
}
