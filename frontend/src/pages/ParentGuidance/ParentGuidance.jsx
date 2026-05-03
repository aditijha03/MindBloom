import { useState, useEffect } from 'react';
import { 
  Bell, 
  Lightbulb, 
  MessageSquare, 
  BookOpen, 
  Plus, 
  Trash2, 
  Send,
  VolumeX,
  Ear,
  Sprout,
  Clock
} from 'lucide-react';
import styles from './ParentGuidance.module.css';

export default function ParentGuidance() {
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Morning stretch and breathing', time: '08:30' },
    { id: 2, text: 'Reading time before bed', time: '20:00' }
  ]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  const [posts, setPosts] = useState([
    { id: 1, author: 'Sarah M.', date: '2h ago', text: 'Has anyone tried the sensory bin activity for a 3-year-old? My son loved the textures!' },
    { id: 2, author: 'David L.', date: '5h ago', text: 'Looking for advice on transitioning to a big kid bed. Any tips would be great.' }
  ]);
  const [newPost, setNewPost] = useState('');

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders([...reminders, { id: Date.now(), text: newReminder, time: reminderTime }]);
    setNewReminder('');
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const addPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now(), author: 'You', date: 'Just now', text: newPost },
      ...posts
    ]);
    setNewPost('');
  };

  const tips = [
    { icon: VolumeX, title: 'Reduce Distractions', text: 'Turn off the TV and put away phones during focused play time.' },
    { icon: Ear, title: 'Active Listening', text: 'Get down to your child\'s eye level when they are talking to you.' },
    { icon: Sprout, title: 'Praise Effort', text: 'Focus on "I like how hard you worked on that" rather than "Good job".' },
    { icon: Clock, title: 'Wait Time', text: 'Give your child 5-10 seconds to respond before repeating a question.' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Parent Guidance & Support</h1>
        <p>A safe space for tools, community, and expert developmental advice.</p>
      </header>

      <div className={styles.grid}>
        {/* Left Column: Reminders & Tips */}
        <div className={styles.leftCol}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Bell size={20} color="#8c2a30" />
              <h3 className={styles.cardTitle}>Daily Reminders</h3>
            </div>
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
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Lightbulb size={20} color="#8c2a30" />
              <h3 className={styles.cardTitle}>Quick Tips</h3>
            </div>
            <div className={styles.tipsGrid}>
              {tips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className={styles.tipItem}>
                    <div className={styles.tipIconBox}>
                      <Icon size={20} color="#8c2a30" />
                    </div>
                    <div>
                      <strong>{tip.title}</strong>
                      <p>{tip.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Community Forum */}
        <div className={styles.rightCol}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <MessageSquare size={20} color="#8c2a30" />
              <h3 className={styles.cardTitle}>Community Forum</h3>
            </div>
            <div className={styles.forumList}>
              {posts.map(p => (
                <div key={p.id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <span className={styles.author}>{p.author}</span>
                    <span className={styles.date}>{p.date}</span>
                  </div>
                  <p className={styles.postText}>{p.text}</p>
                </div>
              ))}
            </div>
            <form className={styles.postForm} onSubmit={addPost}>
              <textarea 
                placeholder="Share a win, ask a question, or offer support..." 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className={styles.textarea}
              />
              <button type="submit" className={styles.postBtn}>
                <Send size={16} />
                <span>Post to Community</span>
              </button>
            </form>
          </section>

          <section className={`${styles.card} ${styles.guideCard}`}>
            <div className={styles.cardHeader}>
              <BookOpen size={20} color="#8c2a30" />
              <h3 className={styles.cardTitle}>Recommended Articles</h3>
            </div>
            <div className={styles.articleLink}>
              <h4>Understanding "The Terrible Twos"</h4>
              <p>How to navigate independence while maintaining boundaries.</p>
            </div>
            <div className={styles.articleLink}>
              <h4>Screen-Free Play for Busy Parents</h4>
              <p>5-minute activities that make a huge difference.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
