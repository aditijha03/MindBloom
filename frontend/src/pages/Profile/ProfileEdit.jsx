import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useUpdateProfile, useUploadAvatar, useMe } from '../../hooks/useProfile';
import useAuthStore from '../../store/authStore';
import { useQuiz } from '../../context/QuizContext';
import styles from './Profile.module.css';

export default function ProfileEdit() {
  const user = useAuthStore(state => state.user);
  const { data: apiProfile } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { result } = useQuiz();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Prefer not to say',
    parent: apiProfile?.display_name || user?.displayName || '',
    phone: '',
    email: user?.email || '',
    concerns: apiProfile?.bio || '',
    medical: '',
    avatar: apiProfile?.avatar_url || null
  });

  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mbChildProfile')) || {};
    setFormData(prev => ({ ...prev, ...saved }));
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);
    
    uploadAvatar(formDataObj, {
      onSuccess: (url) => {
        setFormData(prev => ({ ...prev, avatar: url }));
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Child Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.parent.trim()) newErrors.parent = 'Parent Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // Sync parent info to backend
      updateProfile({
        displayName: formData.parent,
        bio: formData.concerns
      });

      // Child-specific data remains in local storage for now
      localStorage.setItem('mbChildProfile', JSON.stringify(formData));
      
      setToast(
        <div className={styles.toastContent}>
          <CheckCircle2 size={16} />
          <span>Profile Saved</span>
        </div>
      );
      setTimeout(() => navigate('/profile'), 1000);
    }
  };

  const avatarDisplay = formData.avatar 
    ? <img src={formData.avatar} alt="Child Avatar" className={styles.avatarImg} />
    : <div className={styles.avatarInitial}>{formData.name ? formData.name[0].toUpperCase() : '?'}</div>;

  return (
    <div className={styles.profileContainer}>
      <Link to="/profile" className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </Link>
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          {avatarDisplay}
          <label htmlFor="avatar-upload" className={styles.uploadBtn} aria-label="Upload photo">
            <Camera size={20} />
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            className={styles.hiddenInput}
          />
        </div>

        <h2 className={styles.sectionTitle}>Child Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="childName">Child Name *</label>
            <input 
              id="childName"
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="childAge">Age *</label>
            <input 
              id="childAge"
              type="number" 
              min="0" max="18"
              value={formData.age} 
              onChange={e => setFormData({...formData, age: e.target.value})}
              className={errors.age ? styles.errorInput : ''}
            />
            {errors.age && <span className={styles.errorText}>{errors.age}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="childGender">Gender</label>
            <select 
              id="childGender"
              value={formData.gender} 
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Parent / Guardian Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="parentName">Parent Name *</label>
            <input 
              id="parentName"
              type="text" 
              value={formData.parent} 
              onChange={e => setFormData({...formData, parent: e.target.value})}
              className={errors.parent ? styles.errorInput : ''}
            />
            {errors.parent && <span className={styles.errorText}>{errors.parent}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="parentPhone">Contact Number</label>
            <input 
              id="parentPhone"
              type="tel" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="parentEmail">Email Address</label>
            <input 
              id="parentEmail"
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Additional Details</h2>
        <div className={styles.inputGroupFull}>
          <label htmlFor="concerns">Behavioral Concerns (Optional)</label>
          <textarea 
            id="concerns"
            rows="3" 
            placeholder="e.g. Difficulty focusing, trouble making friends..."
            value={formData.concerns}
            onChange={e => setFormData({...formData, concerns: e.target.value})}
          ></textarea>
        </div>

        <div className={styles.inputGroupFull}>
          <label htmlFor="medical">Medical History (Optional)</label>
          <textarea 
            id="medical"
            rows="3" 
            value={formData.medical}
            onChange={e => setFormData({...formData, medical: e.target.value})}
          ></textarea>
        </div>

        {result && (
          <div className={styles.resultCard}>
            <h2 className={styles.sectionTitle}>Latest Assessment</h2>
            <div className={`${styles.alertBox} ${result.type === 'alert' ? styles.resultAlert : styles.resultFine}`}>
              {result.text}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={handleSave} className={styles.saveBtn}>Save Profile</button>
          {toast && <div className={styles.toast}>{toast}</div>}
        </div>
      </div>
    </div>
  );
}
