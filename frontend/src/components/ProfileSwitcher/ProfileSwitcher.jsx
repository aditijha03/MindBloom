import React, { useState } from 'react';
import { User, ChevronDown, PlusCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProfileStore from '../../store/profileStore';
import styles from './ProfileSwitcher.module.css';

export default function ProfileSwitcher() {
  const { profiles, activeProfileId, setActiveProfile, getActiveProfile } = useProfileStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const activeProfile = getActiveProfile();

  if (profiles.length === 0) return null;

  return (
    <div className={styles.switcherContainer}>
      <button 
        className={styles.activeProfileBtn} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.avatar}>
          {activeProfile?.avatar ? (
            <img src={activeProfile.avatar} alt={activeProfile.name} />
          ) : (
            <User size={16} />
          )}
        </div>
        <span className={styles.name}>{activeProfile?.name || 'Select Child'}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.profilesList}>
            {profiles.map((profile) => (
              <button
                key={profile.id || profile.name}
                className={`${styles.profileItem} ${(profile.id || profile.name) === activeProfileId ? styles.activeItem : ''}`}
                onClick={() => {
                  setActiveProfile(profile.id || profile.name);
                  setIsOpen(false);
                }}
              >
                <div className={styles.itemAvatar}>
                  {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <User size={14} />}
                </div>
                <span>{profile.name}</span>
                {(profile.id || profile.name) === activeProfileId && <Check size={14} className={styles.check} />}
              </button>
            ))}
          </div>
          <button 
            className={styles.addBtn}
            onClick={() => {
              navigate('/profile/edit', { state: { isAdding: true } });
              setIsOpen(false);
            }}
          >
            <PlusCircle size={14} />
            <span>Add Child</span>
          </button>
        </div>
      )}
    </div>
  );
}
