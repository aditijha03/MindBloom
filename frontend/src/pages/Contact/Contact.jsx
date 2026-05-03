import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    childAge: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      // Phase 2: POST to /api/contact
      console.log('Form data:', formData);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactWrapper}>
        <div className={styles.formSection}>
          <h2>Get in Touch</h2>
          {submitted ? (
            <div className={styles.successMessage}>
              Thank you! We will be in touch within 1–2 business days.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.inputGroup}>
                <input 
                  type="text" 
                  placeholder="Parent/Guardian Name *"
                  value={formData.parentName}
                  onChange={e => setFormData({...formData, parentName: e.target.value})}
                  className={errors.parentName ? styles.errorInput : ''}
                />
                {errors.parentName && <span className={styles.errorText}>{errors.parentName}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? styles.errorInput : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="number" 
                  placeholder="Child's Age (Optional)"
                  value={formData.childAge}
                  onChange={e => setFormData({...formData, childAge: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <textarea 
                  rows="4" 
                  placeholder="How can we support you?"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <p className={styles.safetyNote}>Please do not share sensitive medical information via this form.</p>
              <button type="submit" className={styles.submitBtn}>Send Message</button>
            </form>
          )}
        </div>
        
        <div className={styles.infoSection}>
          <h2>Contact Info</h2>
          <div className={styles.infoBlock}>
            <h4>Email</h4>
            <p>support@mindbloom.com</p>
          </div>
          <div className={styles.infoBlock}>
            <h4>Phone</h4>
            <p>+91 90000 00000</p>
          </div>
          <div className={styles.infoBlock}>
            <h4>Hours</h4>
            <p>Mon - Fri: 9am - 6pm</p>
          </div>
          <div className={styles.infoBlock}>
            <h4>Location</h4>
            <p>Available Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
