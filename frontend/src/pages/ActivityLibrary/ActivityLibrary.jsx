import { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileQuestion,
  Check
} from 'lucide-react';
import { ACTIVITIES_DB } from '../../data/activities';
import { useSaveAssessment } from '../../hooks/useAssessments';
import styles from './ActivityLibrary.module.css';

const skills = ['All', 'Speech & Language', 'Gross & Fine Motor', 'Social & Emotional', 'Cognitive / Thinking', 'Sensory'];
const ages = ['All', '0-2', '3-5', '6-8'];

export default function ActivityLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [doneIds, setDoneIds] = useState(new Set());
  const { mutate: saveAssessment } = useSaveAssessment();

  const skillMap = {
    'Speech & Language': 'speech',
    'Social & Emotional': 'social',
    'Gross & Fine Motor': 'motor',
    'Sensory': 'sensory',
    'Cognitive / Thinking': 'cognitive'
  };

  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DB.filter(act => {
      const matchSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.skill.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSkill = selectedSkill === 'All' || act.skill === selectedSkill;
      const matchAge = selectedAge === 'All' || act.age === selectedAge;
      return matchSearch && matchSkill && matchAge;
    });
  }, [searchTerm, selectedSkill, selectedAge]);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleCompleteActivity = (e, act) => {
    e.stopPropagation();
    if (doneIds.has(act.id)) return; // already marked

    // Visual toggle
    setDoneIds(prev => new Set([...prev, act.id]));

    // Save to database as an activity log entry
    saveAssessment({
      score: 100,
      resultType: 'fine',
      summary: act.name,
      responses: {
        isActivity: true,
        activityName: act.name,
        skill: act.skill,
        domain: skillMap[act.skill] || 'general',
        ageGroup: act.age,
      }
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Activity Library</h1>
        <p>Explore screen-free, evidence-based activities to support your child's growth at home.</p>
      </header>

      <section className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search activities or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Search size={20} className={styles.searchIcon} />
        </div>

        {/* ... (filters) */}
      </section>

      {/* ... (resultsBar) */}

      <div className={styles.activitiesGrid}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(act => (
            <div 
              key={act.id} 
              className={`${styles.activityCard} ${expandedId === act.id ? styles.expanded : ''}`}
              onClick={() => toggleExpand(act.id)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardMeta}>
                    <span className={styles.ageBadge}>{act.age} yrs</span>
                    <span className={styles.skillLabel}>{act.skill}</span>
                  </div>
                  <h3 className={styles.actName}>{act.name}</h3>
                </div>
                <span className={styles.expandIcon}>
                  {expandedId === act.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </div>
              
              {expandedId === act.id && (
                <div className={styles.cardBody} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.section}>
                    <h4>Steps</h4>
                    <p>{act.steps}</p>
                  </div>
                  <div className={styles.section}>
                    <h4>Parent Tips</h4>
                    <p>{act.tips}</p>
                  </div>
                  <div className={styles.outcomeBox}>
                    <p><strong>Outcome:</strong> {act.outcome}</p>
                    <button 
                      className={`${styles.doneBtn} ${doneIds.has(act.id) ? styles.doneBtnCompleted : ''}`}
                      onClick={(e) => handleCompleteActivity(e, act)}
                      disabled={doneIds.has(act.id)}
                    >
                      <Check size={18} />
                      <span>{doneIds.has(act.id) ? 'Completed ✓' : 'Mark as Done'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <FileQuestion size={48} color="#8c2a30" />
            </div>
            <h3>No activities found</h3>
            <p>Try broadening your search or filters to find more activities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
