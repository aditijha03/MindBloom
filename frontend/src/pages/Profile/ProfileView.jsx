import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, PlusCircle, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useProfileStore from '../../store/profileStore';
import { useMe } from '../../hooks/useProfile';
import { useQuiz } from '../../context/QuizContext';
import styles from './Profile.module.css';

export default function ProfileView() {
  const user = useAuthStore(state => state.user);
  const { data: apiProfile, isLoading } = useMe();
  const { profiles, getActiveProfile, setActiveProfile } = useProfileStore();
  const { result } = useQuiz();
  const navigate = useNavigate();
  const profile = getActiveProfile();

  useEffect(() => {
    if (profiles.length === 0) {
      navigate('/profile/edit', { state: { isAdding: true } });
    }
  }, [profiles, navigate]);

  if (!profile && profiles.length > 0) return <div>Loading active profile...</div>;
  if (profiles.length === 0) return null;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileLayout}>
        {/* Sidebar for Child Selection */}
        <aside className={styles.profileSidebar}>
          <h3>Your Children</h3>
          <div className={styles.profileList}>
            {profiles.map((p) => (
              <button 
                key={p.id || p.name} 
                className={`${styles.profileTab} ${(p.id === profile.id || p.name === profile.name) ? styles.activeTab : ''}`}
                onClick={() => setActiveProfile(p.id || p.name)}
              >
                <div className={styles.tabAvatar}>
                  {p.avatar ? <img src={p.avatar} alt={p.name} /> : <User size={14} />}
                </div>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
          <button 
            className={styles.addChildBtn}
            onClick={() => navigate('/profile/edit', { state: { isAdding: true } })}
          >
            <PlusCircle size={16} />
            <span>Add Another Child</span>
          </button>
        </aside>

        {/* Main Profile View */}
        <div className={styles.profileCard}>
          <div className={styles.viewHeader}>
            <div className={styles.avatarWrapper}>
              {(profile.avatar || apiProfile?.avatar_url) ? (
                <img src={profile.avatar || apiProfile?.avatar_url} alt={profile.name} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarInitial}>{profile.name[0].toUpperCase()}</div>
              )}
            </div>
            <div className={styles.headerInfo}>
              <h1>{profile.name}</h1>
              <p>Age {profile.age} • {profile.gender}</p>
              <Link to="/profile/edit" className={styles.editLinkBtn}>
                <Pencil size={14} />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailSection}>
              <h3>Guardian Information</h3>
              <div className={styles.detailItem}>
                <label>Parent Name</label>
                <p>{apiProfile?.display_name || user?.displayName || profile.parent}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Contact</label>
                <p>{profile.phone || 'Not provided'}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Email</label>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Child Details</h3>
              <div className={styles.detailItem}>
                <label>Concerns</label>
                <p>{profile.concerns || 'No concerns noted'}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Medical History</label>
                <p>{profile.medical || 'None'}</p>
              </div>
            </div>
          </div>

          {result && (
            <div className={styles.assessmentSection}>
              <h3>Latest Assessment</h3>
              <div className={`${styles.alertBox} ${result.type === 'alert' ? styles.resultAlert : styles.resultFine}`}>
                <strong>Score: {result.score}%</strong>
                <p>{result.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
