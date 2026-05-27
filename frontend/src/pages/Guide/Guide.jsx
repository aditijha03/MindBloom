import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import styles from './Guide.module.css';

const milestonesData = [
  { age: "0–3 mo", title: "Newborn Wonders", desc: "Tracks moving objects with eyes, responds to sounds, social smile, briefly lifts head during tummy time." },
  { age: "4–6 mo", title: "Curious Explorer", desc: "Rolls front-to-back, reaches and grasps toys, babbles and laughs, begins recognising familiar faces." },
  { age: "7–9 mo", title: "On The Move", desc: "Sits without support, starts crawling, responds to own name, shows stranger anxiety, imitates sounds." },
  { age: "10–12 mo", title: "First Steps Ahead", desc: "Pulls to stand, may walk with support, says first words ('mama','dada'), points to objects of interest." },
  { age: "1–2 yrs", title: "Little Talker", desc: "Walks independently, vocabulary grows to 50+ words, feeds self with spoon, enjoys parallel play." },
  { age: "2–3 yrs", title: "Imaginative Play", desc: "Runs and climbs, uses 2–4 word phrases, follows 2-step instructions, engages in pretend play." },
  { age: "3–5 yrs", title: "Social Butterfly", desc: "Rides tricycle, forms 5–6 word sentences, asks 'why', plays cooperatively, dresses independently." },
  { age: "6–8 yrs", title: "School Ready", desc: "Reads simple text, logical thinking emerges, deep friendships form, fine motor skills strengthen." },
  { age: "9–12 yrs", title: "Growing Independent", desc: "Abstract thinking develops, complex problem-solving, peer relationships become central, puberty begins." },
];

const domainsData = [
  { alt: false, title: "Physical / Motor", desc: "Gross motor (walking, running, jumping) and fine motor (holding pencil, buttoning) skills. Depends on nutrition, activity and environment." },
  { alt: true, title: "Cognitive", desc: "Thinking, problem-solving, memory and attention. Children learn through play, exploration, imitation and formal education." },
  { alt: false, title: "Language & Communication", desc: "Listening, understanding, speaking, reading and writing. Develops through interaction, reading aloud and rich vocabulary exposure." },
  { alt: true, title: "Social & Emotional", desc: "Forming attachments, empathy, self-regulation and peer relationships. Key foundation for mental health and wellbeing throughout life." },
  { alt: false, title: "Adaptive / Self-care", desc: "Daily living skills: dressing, toileting, eating independently. Supports autonomy and confidence in school and social settings." },
  { alt: true, title: "Sensory Processing", desc: "How the brain interprets touch, sound, sight, taste, smell and movement. Affects attention, behaviour and learning when dysregulated." },
];

const disordersData = [
  {
    name: "Autism Spectrum Disorder (ASD)", cat: "Neurodevelopmental",
    desc: "A spectrum condition affecting social communication, behaviour and sensory processing. Presents very differently across individuals.",
    signs: ["Delayed speech or unusual language", "Difficulty with eye contact", "Repetitive behaviours or routines", "Intense focus on specific interests", "Sensory sensitivities (sound, texture, light)"],
    support: ["Early behavioural therapy (ABA)", "Speech & language therapy", "Structured routines & visual schedules", "Occupational therapy", "Inclusive education support"]
  },
  {
    name: "ADHD", cat: "Attention",
    desc: "Attention-Deficit/Hyperactivity Disorder affects focus, impulse control and activity level. Three subtypes: inattentive, hyperactive-impulsive, and combined.",
    signs: ["Difficulty sustaining attention on tasks", "Impulsivity and frequent interrupting", "Hyperactivity or constant movement", "Forgetfulness and losing items", "Poor time management"],
    support: ["Behavioural therapy", "Medication where clinically appropriate", "Structured, predictable environment", "Frequent breaks and movement", "Positive reinforcement strategies"]
  },
  {
    name: "Dyslexia", cat: "Learning",
    desc: "A language-based learning difficulty primarily affecting reading, spelling and phonological processing. Not related to intelligence.",
    signs: ["Reading below expected grade level", "Difficulty sounding out words", "Confusing similar letters (b/d, p/q)", "Slow and laboured reading", "Trouble with rhyming or word patterns"],
    support: ["Orton-Gillingham based instruction", "Multisensory reading programmes", "Extra time on assessments", "Audiobooks and text-to-speech", "Assistive technology tools"]
  },
  {
    name: "Dyspraxia / DCD", cat: "Motor",
    desc: "Developmental Coordination Disorder affects motor planning and coordination, impacting many daily tasks including writing and self-care.",
    signs: ["Clumsy or uncoordinated movements", "Significant difficulty with handwriting", "Trouble with buttons, laces, zippers", "Poor balance and spatial awareness", "Avoidance of physical activities"],
    support: ["Occupational therapy (OT)", "Physiotherapy for gross motor skills", "Adapted PE and sports programmes", "Handwriting intervention programmes", "Breaking tasks into small steps"]
  },
  {
    name: "Anxiety Disorders", cat: "Emotional",
    desc: "Includes separation anxiety, generalised anxiety and specific phobias — among the most common childhood mental health concerns. Often underdiagnosed.",
    signs: ["Excessive worry about everyday events", "School refusal or avoidance", "Physical complaints (headaches, stomach aches)", "Sleep difficulties or nightmares", "Excessive clinging to caregivers"],
    support: ["Cognitive Behavioural Therapy (CBT)", "Gradual exposure therapy", "Relaxation and mindfulness techniques", "Consistent and predictable routines", "Family-based therapy approaches"]
  },
  {
    name: "Childhood Depression", cat: "Emotional",
    desc: "More than sadness — persistent low mood, loss of interest and functional impairment lasting 2+ weeks. Often presents as irritability in children.",
    signs: ["Persistent sadness or irritability", "Withdrawal from friends and activities", "Loss of interest in previously enjoyed things", "Changes in sleep or appetite", "Low energy and poor self-worth"],
    support: ["CBT or play therapy", "Consistent family and school support", "School counsellor involvement", "Medication in severe adolescent cases", "Regular physical activity"]
  },
  {
    name: "Speech & Language Delays", cat: "Communication",
    desc: "Delayed or disordered development of expressive and/or receptive language beyond expected milestones. Early intervention yields best outcomes.",
    signs: ["Fewer words than same-age peers", "Difficulty constructing sentences", "Hard to understand speech sounds", "Trouble following verbal instructions", "Limited gesturing or pointing"],
    support: ["Speech-language pathology sessions", "Parent-led language stimulation strategies", "Augmentative and alternative communication", "Early intervention programmes", "Rich, responsive language environments"]
  },
  {
    name: "Intellectual Disability", cat: "Cognitive",
    desc: "Significantly below-average intellectual functioning with limitations in adaptive behaviour, present before age 18. Ranges from mild to profound.",
    signs: ["Delayed developmental milestones", "Difficulty with reasoning and problem-solving", "Limited self-care and adaptive skills", "Slower learning pace across domains", "Challenges with communication"],
    support: ["Individualised Education Plans (IEP)", "Life skills and vocational training", "Community inclusion programmes", "Supportive and enriched family environment", "Specialised speech, OT and PT therapies"]
  },
  {
    name: "Sensory Processing Disorder", cat: "Sensory",
    desc: "Difficulty regulating responses to sensory input — children may be over-sensitive (hypersensitive) or under-sensitive (hyposensitive) to stimuli.",
    signs: ["Extreme distress with textures, sounds or lights", "Seeking intense sensory experiences", "Avoiding crowds or noisy environments", "Meltdowns in busy settings", "Unusual tolerance to pain or temperature"],
    support: ["Sensory integration therapy (OT)", "Personalised sensory diets and tools", "Calm-down corners in school and home", "Environmental modifications", "Educator and caregiver awareness training"]
  },
  {
    name: "Selective Mutism", cat: "Anxiety / Communication",
    desc: "Consistent failure to speak in specific social situations despite speaking confidently in others. Causes significant impairment in school and social life.",
    signs: ["Speaks freely at home but not at school", "Freezing or blank expression in social settings", "Communicates through gestures or writing instead", "May appear extremely shy or withdrawn", "Physical tension in speaking situations"],
    support: ["Gradual exposure combined with CBT", "Low-pressure communication opportunities", "Strong school-home collaboration", "Play-based and child-led therapy", "Anxiety management and social skills work"]
  },
];

const tipsData = [
  { alt: false, title: "Read Every Day", txt: "Even 10 minutes of reading aloud daily builds vocabulary, imagination and essential early literacy skills." },
  { alt: true, title: "Follow The Child's Lead", txt: "Let children direct play sometimes — it builds autonomy, creativity and genuine confidence." },
  { alt: false, title: "Consistent Routines", txt: "Predictable daily routines reduce anxiety and help young children develop healthy self-regulation." },
  { alt: true, title: "Praise Effort, Not Talent", txt: "'You worked so hard!' builds a growth mindset more powerfully than 'You're so smart!'" },
  { alt: false, title: "Limit Screen Time", txt: "Under 2: avoid screens. Ages 2–5: max 1 hour/day of quality content, ideally with a caregiver." },
  { alt: true, title: "Outdoor Play Matters", txt: "Nature play supports physical health, attention span, stress regulation and creative thinking." },
  { alt: false, title: "Name Emotions", txt: "Help children label feelings ('I can see you're frustrated') to build emotional intelligence and vocabulary." },
  { alt: true, title: "Nutrition Is Development", txt: "Omega-3s, iron and zinc support brain development. Minimise excess sugar during formative years." },
  { alt: false, title: "Trust Your Instincts", txt: "If something seems 'off' with your child's development, talk to your paediatrician early. Early support changes outcomes." },
  { alt: true, title: "Connection Before Correction", txt: "Children behave better when they feel understood. Lead with empathy, then set the boundary." },
];

const questionsData = [
  {
    fact: "Most children say their first meaningful words between 10–14 months of age.",
    q: "At what age do most children say their first words?",
    opts: ["3–4 months", "6–8 months", "10–14 months", "18–24 months"], ans: 2,
    exp: "Most children say their first words around 10–14 months because this is when the neurological pathways for speech production (Broca's area) typically mature. It also coincides with the motor control needed to coordinate the tongue, lips, and breath for specific consonant-vowel combinations."
  },
  {
    fact: "Dressing and self-feeding are key skills within the Adaptive / Self-care developmental domain.",
    q: "Which developmental domain involves skills like dressing and self-feeding?",
    opts: ["Cognitive", "Adaptive / Self-care", "Sensory", "Language"], ans: 1,
    exp: "Adaptive skills represent a child's ability to adjust to their environment and handle daily tasks independently. These are crucial for building self-esteem and independence as the child moves from total caregiver reliance to self-sufficiency in school and social settings."
  },
  {
    fact: "The recommended daily screen time for a 3-year-old is a maximum of 1 hour.",
    q: "What is the recommended daily screen time for a 3-year-old?",
    opts: ["No limit", "30 minutes", "1 hour", "3 hours"], ans: 2,
    exp: "The 1-hour limit exists because excessive screen time in early childhood is linked to delays in language development and social skills. Rapidly changing digital images can overstimulate a developing brain, potentially impacting attention spans and reducing time spent in vital face-to-face social interactions."
  },
  {
    fact: "Applied Behaviour Analysis (ABA) is the most extensively researched therapy for Autism Spectrum Disorder.",
    q: "Which therapy is most evidence-based for Autism Spectrum Disorder?",
    opts: ["Play therapy only", "Applied Behaviour Analysis (ABA)", "Hypnotherapy", "Vision therapy"], ans: 1,
    exp: "ABA is the gold standard because it uses scientific principles of learning to reinforce positive behaviours and break down complex skills into manageable steps. Dozens of peer-reviewed studies show it significantly improves communication, social skills, and academic performance in neurodivergent children."
  },
  {
    fact: "Confusing visually similar letters like 'b' and 'd' is a characteristic sign of Dyslexia.",
    q: "A child who struggles to read and confuses 'b' and 'd' may be showing signs of:",
    opts: ["ADHD", "Dyspraxia", "Dyslexia", "Selective Mutism"], ans: 2,
    exp: "Dyslexia is a neurobiological condition that affects the way the brain processes written language. The confusion of letters like 'b' and 'd' occurs because the brain struggles with phonological awareness—the ability to link visual symbols (letters) to their distinct sounds (phonemes)."
  },
  {
    fact: "Parallel play involves children playing independently but alongside their peers.",
    q: "What is 'parallel play'?",
    opts: ["Playing with adults only", "Playing alone beside other children without direct interaction", "Sharing toys cooperatively", "Playing competitive team games"], ans: 1,
    exp: "Parallel play is a critical social bridge where children learn to be comfortable in the presence of peers. It allows them to observe others' play styles and social cues without the pressure of direct negotiation or sharing, which their executive functions aren't fully ready for yet."
  },
  {
    fact: "Sensory Processing Disorder is most often identified by extreme sensitivity to textures or sounds.",
    q: "Which sign is most associated with Sensory Processing Disorder?",
    opts: ["Frequent nosebleeds", "Extreme distress with certain textures or sounds", "Poor reading ability", "Hyperactivity only"], ans: 1,
    exp: "In SPD, the brain has trouble receiving and responding to information that comes through the senses. Distress from textures or sounds happens because the nervous system is 'mired' in a state of high alert, interpreting benign stimuli (like a clothing tag) as a physical threat or intense pain."
  },
  {
    fact: "In special education, IEP stands for Individual Education Plan.",
    q: "What does 'IEP' stand for in special education?",
    opts: ["Individual Education Plan", "Integrated Early Programme", "Intensive Educational Protocol", "Initial Evaluation Procedure"], ans: 0,
    exp: "An IEP is a legally binding document that ensures a child's unique learning needs are met. It exists because standardised curriculums often fail to account for neurodiversity; the plan provides specific accommodations, modifications, and goals tailored to the child's specific strengths and challenges."
  },
  {
    fact: "By age 3, most children have acquired a vocabulary of 200–300 words.",
    q: "By age 3, most children should have a vocabulary of approximately:",
    opts: ["10 words", "50 words", "200–300 words", "1,000+ words"], ans: 2,
    exp: "The jump to 200–300 words is known as the 'language explosion.' At this age, the brain's neuroplasticity is at its peak for language acquisition, allowing children to move from simple naming to expressing complex thoughts, needs, and early forms of storytelling."
  },
  {
    fact: "Labelling and validating feelings is the most effective way to support a child's emotional development.",
    q: "Which approach best supports emotional development in young children?",
    opts: ["Ignoring minor tantrums only", "Labelling and validating feelings", "Discouraging all emotional expression", "Rewarding only positive emotions"], ans: 1,
    exp: "Validating feelings is essential because it helps children develop 'emotional literacy.' When a parent names a feeling (e.g., 'I see you are frustrated'), it activates the prefrontal cortex, helping the child move from a raw emotional state to a more regulated, logical state over time."
  }
];

export default function Guide() {
  const [activeSection, setActiveSection] = useState('milestones');
  const [expandedDisorders, setExpandedDisorders] = useState([]);
  
  // Facts State
  const [factsState, setFactsState] = useState({
    cur: 0,
    flipped: false
  });

  const toggleDisorder = (index) => {
    setExpandedDisorders(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const nextFact = () => {
    if (factsState.cur < questionsData.length - 1) {
      setFactsState(prev => ({ ...prev, cur: prev.cur + 1, flipped: false }));
    }
  };

  const prevFact = () => {
    if (factsState.cur > 0) {
      setFactsState(prev => ({ ...prev, cur: prev.cur - 1, flipped: false }));
    }
  };

  const toggleFlip = () => {
    setFactsState(prev => ({ ...prev, flipped: !prev.flipped }));
  };

  const resetFacts = () => {
    setFactsState({
      cur: 0,
      flipped: false
    });
  };

  const sections = [
    { key: 'milestones', label: 'Milestones' },
    { key: 'domains', label: 'Domains' },
    { key: 'disorders', label: 'Disorders' },
    { key: 'tips', label: 'Tips for Parents' },
    { key: 'facts', label: 'Facts' },
  ];

  const renderMilestones = () => (
    <div className={styles.section}>
      <p className={styles.secTitle}>Developmental Milestones</p>
      {milestonesData.map((m, i) => (
        <div key={i} className={styles.milestoneRow}>
          <div className={styles.mAge}>{m.age}</div>
          <div className={styles.mBody}>
            <h4>{m.title}</h4>
            <p>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDomains = () => (
    <div className={styles.section}>
      <p className={styles.secTitle}>Developmental Domains</p>
      <div className={styles.cardGrid}>
        {domainsData.map((d, i) => (
          <div key={i} className={`${styles.card} ${d.alt ? styles.cardAlt : ''}`}>
            <h3>{d.title}</h3>
            <p>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDisorders = () => (
    <div className={styles.section}>
      <p className={styles.secTitle}>Childhood Disorders</p>
      <p className={styles.secSubtitle}>
        Click any card to expand details, signs &amp; support strategies
      </p>
      {disordersData.map((d, i) => (
        <div key={i} className={styles.disorderCard} onClick={() => toggleDisorder(i)}>
          <h3>{d.name} <span className={styles.catBadge}>{d.cat}</span></h3>
          {expandedDisorders.includes(i) && (
            <div className={styles.disorderBody}>
              <p>{d.desc}</p>
              <div className={styles.disCols}>
                <div>
                  <p className={`${styles.disColTitle} ${styles.disColTitleSigns}`}>Common Signs</p>
                  {d.signs.map((s, idx) => <span key={idx} className={`${styles.disTag} ${styles.disTagSign}`}>{s}</span>)}
                </div>
                <div>
                  <p className={`${styles.disColTitle} ${styles.disColTitleSupport}`}>Support Strategies</p>
                  {d.support.map((s, idx) => <span key={idx} className={`${styles.disTag} ${styles.disTagSupport}`}>{s}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTips = () => (
    <div className={styles.section}>
      <p className={styles.secTitle}>Tips for Parents &amp; Caregivers</p>
      <div className={styles.tipsGrid}>
        {tipsData.map((t, i) => (
          <div key={i} className={`${styles.tipCard} ${t.alt ? styles.tipCardAlt : ''}`}>
            <h4>{t.title}</h4>
            <p>{t.txt}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFacts = () => {
    const q = questionsData[factsState.cur];
    const answer = q.opts[q.ans];

    return (
      <div className={styles.section}>
        <p className={styles.secTitle}>Development Facts</p>
        <p className={styles.secSubtitle}>Tap the card to reveal the detailed explanation</p>
        
        <div className={styles.factsWrap}>
          <div 
            className={`${styles.flashcard} ${factsState.flipped ? styles.flipped : ''}`}
            onClick={toggleFlip}
          >
            {/* FRONT */}
            <div className={styles.cardFace}>
              <div className={styles.cardFact}>
                <span>Fact #{factsState.cur + 1}</span>
                {q.fact}
              </div>
              <div className={styles.flipHint}>Click to reveal details</div>
            </div>

            {/* BACK */}
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <div className={styles.cardDetail}>
                <span>The Explanation</span>
                {q.exp}
              </div>
              <div className={styles.flipHint}>Click to flip back</div>
            </div>
          </div>

          <div className={styles.cardControls}>
            <button 
              className={styles.navBtn} 
              onClick={prevFact}
              disabled={factsState.cur === 0}
              title="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className={styles.cardCounter}>
              {factsState.cur + 1} / {questionsData.length}
            </div>

            <button 
              className={styles.navBtn} 
              onClick={nextFact}
              disabled={factsState.cur === questionsData.length - 1}
              title="Next"
            >
              <ChevronRight size={24} />
            </button>
            
            {factsState.cur === questionsData.length - 1 && (
              <button 
                className={styles.navBtn} 
                onClick={resetFacts}
                title="Restart"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.guideContainer}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1>Child Development Guide</h1>
        <p>Your caring guide to child development — milestones, disorders, tips &amp; interactive learning</p>
        <div className={styles.bubbles}>
          <span className={styles.bubble}>0–12 months</span>
          <span className={`${styles.bubble} ${styles.bubbleAlt}`}>1–3 years</span>
          <span className={styles.bubble}>3–6 years</span>
          <span className={`${styles.bubble} ${styles.bubbleAlt}`}>6–12 years</span>
        </div>
      </header>

      {/* NAV */}
      <nav className={styles.nav}>
        {sections.map(s => (
          <button
            key={s.key}
            className={`${styles.navButton} ${activeSection === s.key ? styles.navButtonActive : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      {activeSection === 'milestones' && renderMilestones()}
      {activeSection === 'domains' && renderDomains()}
      {activeSection === 'disorders' && renderDisorders()}
      {activeSection === 'tips' && renderTips()}
      {activeSection === 'facts' && renderFacts()}
    </div>
  );
}
