export const MILESTONES_DB = {
  '0-1': [
    "Watches faces and follows with eyes",
    "Responds to sounds and voices",
    "Lifts head during tummy time",
    "Starts to babble (ooh, aah)",
    "Brings hands to mouth",
    "Rolls from tummy to back",
    "Sits with support",
    "Transfers objects from one hand to another"
  ],
  '1-2': [
    "Takes several steps alone",
    "Says 2-3 simple words (mama, dada)",
    "Points to things they want",
    "Follows simple one-step directions",
    "Stacks 2 blocks",
    "Drinks from a cup with help",
    "Shakes head 'no' or nods 'yes'",
    "Explores objects by shaking or throwing"
  ],
  '2-3': [
    "Uses 2-word phrases (more milk)",
    "Points to pictures in a book when named",
    "Kicks a ball",
    "Runs easily",
    "Copies a circle on paper",
    "Follows 2-part instructions",
    "Plays simple pretend games",
    "Stacks 6 blocks"
  ],
  '3-5': [
    "Speaks in sentences of 4-5 words",
    "Tells stories or recounts their day",
    "Hops and stands on one foot",
    "Draws a person with 2-4 body parts",
    "Plays cooperatively with other children",
    "Knows some colours and numbers",
    "Uses scissors to cut paper",
    "Dresses themselves with little help"
  ],
  '5-7': [
    "Reads simple words and sentences",
    "Writes their own name",
    "Shows empathy for others' feelings",
    "Follows rules in games",
    "Ties shoelaces or uses buttons/zippers",
    "Can tell the difference between real and make-believe",
    "Performs simple chores at home",
    "Coordinates movements to catch a ball"
  ]
};

export const SCREENING_QUIZ = [
  {
    id: 1,
    category: 'Social',
    question: "How does your child typically interact with other children?",
    options: ["Plays cooperatively", "Plays alongside but separate", "Watches but doesn't join", "Avoids other children"]
  },
  {
    id: 2,
    category: 'Social',
    question: "Does your child enjoy playing group games or sharing toys with others?",
    options: ["Consistently", "Most of the time", "Sometimes", "Rarely"]
  },
  {
    id: 3,
    category: 'Communication',
    question: "How often does your child use words or gestures to clearly communicate their needs?",
    options: ["Always", "Usually", "Sometimes", "Rarely"]
  },
  {
    id: 4,
    category: 'Communication',
    question: "Can your child understand and respond appropriately to simple questions?",
    options: ["Always", "Usually", "Sometimes", "Rarely"]
  },
  {
    id: 5,
    category: 'Behavioural',
    question: "How easily does your child adapt to sudden changes in their daily routine?",
    options: ["Very easily", "Somewhat easily", "With some difficulty", "Very difficult"]
  },
  {
    id: 6,
    category: 'Behavioural',
    question: "How often does your child have intense tantrums when they do not get their way?",
    options: ["Rarely", "Sometimes", "Often", "Constantly"]
  },
  {
    id: 7,
    category: 'Emotions',
    question: "How does your child usually react when they see someone else is crying or upset?",
    options: ["Shows empathy/comforts", "Watches quietly", "Ignores them", "Gets upset themselves"]
  },
  {
    id: 8,
    category: 'Emotions',
    question: "Can your child express their own basic feelings (e.g., saying 'I am happy' or 'I am sad')?",
    options: ["Consistently", "Most of the time", "Sometimes", "Rarely"]
  },
  {
    id: 9,
    category: 'Cognitive',
    question: "Can your child follow simple two-step instructions (e.g., 'Pick up the toy and put it in the box')?",
    options: ["Consistently", "Most of the time", "Sometimes", "Rarely"]
  },
  {
    id: 10,
    category: 'Cognitive',
    question: "Can your child sort objects by basic shapes or colors?",
    options: ["Consistently", "Most of the time", "Sometimes", "Rarely"]
  },
  {
    id: 11,
    category: 'Developmental',
    question: "Does your child often avoid eye contact, repeat specific movements, or become highly upset by minor routine changes? (Autism Screening)",
    options: ["Rarely or never", "Sometimes", "Often", "Almost always"]
  },
  {
    id: 12,
    category: 'Attention',
    question: "How often does your child have significant difficulty sustaining attention or seem unable to sit still? (ADHD Screening)",
    options: ["Rarely or never", "Sometimes", "Often", "Almost always"]
  },
  {
    id: 13,
    category: 'Learning',
    question: "Does your child struggle significantly with recognizing letters or reading words compared to peers? (Dyslexia Screening)",
    options: ["No difficulty", "Mild difficulty", "Moderate difficulty", "Severe difficulty"]
  },
  {
    id: 14,
    category: 'Learning',
    question: "Does your child have unusual difficulty understanding number concepts or basic math? (Dyscalculia Screening)",
    options: ["No difficulty", "Mild difficulty", "Moderate difficulty", "Severe difficulty"]
  },
  {
    id: 15,
    category: 'Learning',
    question: "How much difficulty does your child experience with handwriting, such as forming letters or holding a pencil? (Dysgraphia Screening)",
    options: ["No difficulty", "Mild difficulty", "Moderate difficulty", "Severe difficulty"]
  },
  {
    id: 16,
    category: 'Emotional',
    question: "Does your child frequently appear sad, irritable, or show a loss of interest in activities they used to enjoy? (Childhood Depression Screening)",
    options: ["Rarely or never", "Sometimes", "Often", "Almost always"]
  },
  {
    id: 17,
    category: 'Behavioural',
    question: "How often does your child lose their temper, argue with adults, or deliberately refuse to comply with rules? (Oppositional Defiant Disorder Screening)",
    options: ["Rarely or never", "Sometimes", "Often", "Almost always"]
  },
  {
    id: 18,
    category: 'Emotional',
    question: "Does your child exhibit excessive worry, fear, or physical symptoms when facing everyday situations? (Childhood Anxiety Disorders Screening)",
    options: ["Rarely or never", "Sometimes", "Often", "Almost always"]
  }
];
