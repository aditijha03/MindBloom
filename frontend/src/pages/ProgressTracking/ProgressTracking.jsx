import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Heart,
  Brain,
  FileText,
  X,
  Printer,
  Calendar,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAssessments } from '../../hooks/useAssessments';
import { SCREENING_QUIZ } from '../../data/screening';
import styles from './ProgressTracking.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper: convert a text answer to a % score based on its position in options
// Index 0 = 100%, index (last) = 0%
const calcDomainScore = (responses, domainName) => {
  const domainQuestions = SCREENING_QUIZ.filter(q => q.category.toLowerCase() === domainName.toLowerCase());
  if (domainQuestions.length === 0) return 0;
  let total = 0;
  domainQuestions.forEach(q => {
    const answer = responses[q.id] || responses[String(q.id)];
    if (answer) {
      const idx = q.options.indexOf(answer);
      if (idx !== -1) {
        total += (1 - idx / (q.options.length - 1)) * 100;
      }
    }
  });
  return Math.round(total / domainQuestions.length);
};

export default function ProgressTracking() {
  const { data: assessments, isLoading } = useAssessments();
  const [showReport, setShowReport] = useState(false);

  // Separate quiz assessments from activity log entries using the isActivity flag
  const quizAssessments = useMemo(() =>
    (assessments || []).filter(a => !(a.responses && a.responses.isActivity)),
    [assessments]
  );

  const activityLogs = useMemo(() =>
    (assessments || [])
      .filter(a => a.responses && a.responses.isActivity)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5), // show last 5
    [assessments]
  );

  const parsedData = useMemo(() => {
    if (!quizAssessments || quizAssessments.length === 0) return null;

    const sorted = [...quizAssessments].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const labels = [];
    const domainData = {
      social: [],
      communication: [],
      behavioural: [],
      emotional: [],
      cognitive: []
    };

    sorted.forEach((assessment) => {
      const date = new Date(assessment.created_at);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      const r = assessment.responses || {};
      domainData.social.push(calcDomainScore(r, 'Social'));
      domainData.communication.push(calcDomainScore(r, 'Communication'));
      domainData.behavioural.push(calcDomainScore(r, 'Behavioural'));
      domainData.emotional.push(calcDomainScore(r, 'Emotions'));
      domainData.cognitive.push(calcDomainScore(r, 'Cognitive'));
    });

    return { labels, domainData, raw: sorted };
  }, [quizAssessments]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading your child's progress...</div>;
  }

  // EMPTY STATE: If the user has never taken a quiz
  if (!parsedData) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h1>Progress Tracking</h1>
            <p>Monitor your child's developmental journey through visual data and trends.</p>
          </div>
        </header>
        
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1', marginTop: '24px' }}>
          <Activity size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#334155', marginBottom: '8px' }}>No Data Available Yet</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Take your first developmental quiz to begin tracking your child's progress over time!</p>
          <Link to="/screening?tab=quiz" className={styles.startBtn}>
            Take First Quiz
          </Link>
        </div>
      </div>
    );
  }

  const { labels, domainData, raw } = parsedData;

  const getChartData = (label, dataPoints, color) => {
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataPoints,
          borderColor: color,
          backgroundColor: `${color}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#f3f4f6' },
        ticks: { stepSize: 20 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const domains = [
    { key: 'social', label: 'Social', color: '#5492e3', icon: Users },
    { key: 'communication', label: 'Communication', color: '#f59e0b', icon: MessageSquare },
    { key: 'behavioural', label: 'Behavioural', color: '#8b5cf6', icon: Settings },
    { key: 'emotional', label: 'Emotional', color: '#ec4899', icon: Heart },
    { key: 'cognitive', label: 'Cognitive', color: '#22c55e', icon: Brain }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Progress Tracking</h1>
          <p>Tracking your child's development based on actual screening assessments.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.reportBtn} onClick={() => setShowReport(true)}>
            <FileText size={18} />
            <span>Generate AI Report</span>
          </button>
        </div>
      </header>

      <div className={styles.chartsGrid}>
        {domains.map(domain => {
          const Icon = domain.icon;
          return (
            <div key={domain.key} className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.iconBox} style={{ backgroundColor: `${domain.color}15`, color: domain.color }}>
                  <Icon size={20} />
                </div>
                <h3>{domain.label}</h3>
              </div>
              <div className={styles.chartWrapper}>
                <Line 
                  data={getChartData(domain.label, domainData[domain.key], domain.color)} 
                  options={chartOptions} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Log Panel */}
      {activityLogs.length > 0 && (
        <div className={styles.activityLogPanel}>
          <h3 className={styles.activityLogTitle}>
            <CheckCircle2 size={18} color="#22c55e" />
            Recent Activities Completed
          </h3>
          <div className={styles.activityLogList}>
            {activityLogs.map((log, i) => {
              const r = log.responses || {};
              const date = new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={i} className={styles.activityLogItem}>
                  <div className={styles.activityLogDot} />
                  <div className={styles.activityLogInfo}>
                    <span className={styles.activityLogName}>{r.activityName || log.summary}</span>
                    <span className={styles.activityLogMeta}>{r.skill} · {date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showReport && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <FileText size={24} color="#F64A8A" />
                <h2>Developmental Progress Report</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowReport(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.reportContent}>
              <div className={styles.reportMeta}>
                <div>
                  <strong>First Assessment:</strong> <span>{labels[0]}</span>
                </div>
                <div>
                  <strong>Most Recent:</strong> <span>{labels[labels.length - 1]}</span>
                </div>
                <div>
                  <strong>Total Assessments:</strong> <span>{raw.length}</span>
                </div>
              </div>

              <div className={styles.reportSection}>
                <h3>Summary of Observations</h3>
                <p>This report compares your child's first assessment to their most recent one. Growth is calculated based on the precise categories tested in your MindBloom screening quizzes.</p>
              </div>

              <div className={styles.reportTable}>
                <div className={styles.tableHeader}>
                  <span>Domain</span>
                  <span>Initial</span>
                  <span>Current</span>
                  <span>Growth</span>
                </div>
                {domains.map(d => {
                  const dataPoints = domainData[d.key] || [];
                  const initial = dataPoints[0] || 0;
                  const current = dataPoints[dataPoints.length - 1] || 0;
                  const growth = current - initial;
                  return (
                    <div key={d.key} className={styles.tableRow}>
                      <span>{d.label}</span>
                      <span>{initial}%</span>
                      <span>{current}%</span>
                      <span className={growth >= 0 ? styles.positive : styles.negative}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.reportSection}>
                <h3>Recommendations</h3>
                <ul>
                  <li>Review the areas where growth may be stagnant or negative and try focusing on those specific 'Activity Library' exercises.</li>
                  <li>Ensure you retake the developmental screening quiz every month for accurate trend tracking.</li>
                </ul>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.printBtn} onClick={handlePrint}>
                <Printer size={18} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
