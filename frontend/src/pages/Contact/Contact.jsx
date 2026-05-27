import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone, 
  Clock, 
  Globe, 
  Heart,
  ShieldCheck,
  Users
} from 'lucide-react';
import styles from './Contact.module.css';
import { usePosts, useCreatePost } from '../../hooks/usePosts';
import useAuthStore from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';


export default function Contact() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    childAge: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const { data, isLoading, isError } = usePosts({ limit: 10, status: 'published' });
  const createPostMutation = useCreatePost();
  const [newPost, setNewPost] = useState('');

  // Extract posts from paginated data
  const forumPosts = data?.pages?.[0]?.posts || [];

  const addPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !isAuthenticated) return;
    
    try {
      await createPostMutation.mutateAsync({
        title: newPost.slice(0, 50) + (newPost.length > 50 ? '...' : ''), // Backend requires a title
        body: newPost,
        status: 'published'
      });
      setNewPost('');
    } catch (err) {
      console.error('Failed to post:', err);
    }
  };

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
      setTimeout(() => setSubmitted(false), 5000); // Reset after 5s for demo
    }
  };

  return (
    <div className={styles.contactContainer}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Help & Support</span>
          <h1>We're here for your <span className={styles.highlight}>Parenting Journey</span></h1>
          <p>Get expert advice, technical support, or connect with our community of mindful parents.</p>
        </div>
      </header>

      <div className={styles.contactWrapper}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Mail size={24} className={styles.sectionIcon} />
            <h2>Send a Message</h2>
          </div>
          
          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={formData.parentName}
                    onChange={e => setFormData({...formData, parentName: e.target.value})}
                    className={errors.parentName ? styles.errorInput : ''}
                  />
                  {errors.parentName && <span className={styles.errorText}>{errors.parentName}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label>Child's Age (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 4"
                    value={formData.childAge}
                    onChange={e => setFormData({...formData, childAge: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? styles.errorInput : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>How can we help?</label>
                <textarea 
                  rows="4" 
                  placeholder="Tell us about your concern or query..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className={styles.formFooter}>
                <div className={styles.securityNote}>
                  <ShieldCheck size={14} />
                  <span>Secure & Private Communication</span>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={`${styles.infoIconBox} ${styles.blue}`}>
                <Mail size={20} />
              </div>
              <div className={styles.infoContent}>
                <h4>Email Us</h4>
                <p>support@mindbloom.com</p>
                <span>Typical response: 2h</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIconBox} ${styles.pink}`}>
                <Phone size={20} />
              </div>
              <div className={styles.infoContent}>
                <h4>Call Support</h4>
                <p>+91 90000 00000</p>
                <span>Mon-Fri, 9am-6pm</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIconBox} ${styles.purple}`}>
                <Globe size={20} />
              </div>
              <div className={styles.infoContent}>
                <h4>Resources</h4>
                <p>Knowledge Base</p>
                <span>FAQs & Tutorials</span>
              </div>
            </div>
          </div>

          <div className={styles.trustBanner}>
            <Heart size={20} color="#ec4899" />
            <p>Your child's well-being is our top priority. We're here to help you bloom together.</p>
          </div>
        </div>
      </div>

      <div className={styles.forumSection}>
        <div className={styles.forumHeaderArea}>
          <div className={styles.forumTitle}>
            <Users size={28} className={styles.forumIcon} />
            <div>
              <h2>Community Forum</h2>
              <p>Connect with {forumPosts.length > 0 ? 'our growing' : 'the'} community of parents sharing similar journeys.</p>
            </div>
          </div>
          <div className={styles.forumStats}>
            <span className={styles.statPill}>
              {isLoading ? 'Connecting...' : isError ? 'Offline' : '● Live Community'}
            </span>
          </div>
        </div>
        
        <div className={styles.forumContainer}>
          <div className={styles.forumSidebar}>
            <div className={styles.forumInstructions}>
              <h4>Community Guidelines</h4>
              <ul>
                <li>Be kind and supportive</li>
                <li>Respect privacy</li>
                <li>Share evidence-based tips</li>
              </ul>
            </div>
          </div>

          <div className={styles.forumMain}>
            <div className={styles.forumList}>
              {isLoading && <div className={styles.loadingState}>Loading community posts...</div>}
              {isError && <div className={styles.errorState}>Unable to load forum. Please try again later.</div>}
              
              {!isLoading && !isError && forumPosts.length === 0 && (
                <div className={styles.emptyState}>No posts yet. Be the first to share!</div>
              )}

              {forumPosts.map(p => (
                <div key={p.id} className={styles.postCard}>
                  <div className={styles.postCardHeader}>
                    <div className={styles.userAvatar}>
                      {p.profiles?.display_name?.[0] || 'U'}
                    </div>
                    <div className={styles.postMeta}>
                      <span className={styles.author}>{p.profiles?.display_name || 'Anonymous Parent'}</span>
                      <span className={styles.date}>
                        {p.published_at ? formatDistanceToNow(new Date(p.published_at), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    <span className={styles.postType}>Community</span>
                  </div>
                  <p className={styles.postText}>{p.body}</p>
                  <div className={styles.postActions}>
                    <button className={styles.actionBtn}>Reply</button>
                    <button className={styles.actionBtn}>Helpful</button>
                  </div>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <form className={styles.postForm} onSubmit={addPost}>
                <div className={styles.postInputWrapper}>
                  <textarea 
                    placeholder="Share a win, ask a question, or offer support..." 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className={styles.forumTextarea}
                    disabled={createPostMutation.isPending}
                  />
                  <button type="submit" className={styles.postBtn} disabled={createPostMutation.isPending}>
                    {createPostMutation.isPending ? '...' : <Send size={18} />}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.loginPrompt}>
                <p>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link> to join the discussion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
