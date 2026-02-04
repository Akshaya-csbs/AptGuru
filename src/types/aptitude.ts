export type LearningMode = 'solve' | 'learn' | 'quiz' | 'eli10';

export type LevelId = 'beginner' | 'intermediate' | 'pro' | 'master';

export interface LevelInfo {
  id: LevelId;
  title: string;
  minXp: number;
  maxXp: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { id: 'beginner', title: 'Beginner', minXp: 0, maxXp: 499, color: 'hsl(142, 76%, 36%)' },
  { id: 'intermediate', title: 'Intermediate', minXp: 500, maxXp: 999, color: 'hsl(217, 91%, 60%)' },
  { id: 'pro', title: 'Pro', minXp: 1000, maxXp: 1999, color: 'hsl(271, 91%, 65%)' },
  { id: 'master', title: 'Master', minXp: 2000, maxXp: Infinity, color: 'hsl(45, 93%, 47%)' },
];

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export const BADGES: Badge[] = [
  { id: 'first_steps', name: 'First Steps', description: 'Solve your first question', icon: '🎯' },
  { id: 'quick_learner', name: 'Quick Learner', description: 'Complete 10 questions', icon: '📚' },
  { id: 'streak_starter', name: 'Streak Starter', description: 'Maintain a 3-day streak', icon: '🔥' },
  { id: 'streak_master', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '⚡' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a quiz under 2 minutes', icon: '🚀' },
  { id: 'topic_expert', name: 'Topic Expert', description: 'Answer 50 questions in one topic', icon: '🏆' },
];

export interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  topics: string[];
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'quantitative',
    name: 'Quantitative Aptitude',
    icon: '🔢',
    topics: [
      'Percentages',
      'Ratio and Proportion',
      'Profit and Loss',
      'Simple Interest',
      'Compound Interest',
      'Time and Work',
      'Pipes and Cisterns',
      'Time Speed and Distance',
      'Trains',
      'Boats and Streams',
      'Averages',
      'Problems on Ages',
      'Problems on Numbers',
      'HCF and LCM',
      'Permutation and Combination',
      'Probability',
      'Mixtures and Alligations',
      'Partnership',
      'Height and Distance',
      'Area and Volume',
      'Chain Rule',
      'Races and Games',
      'Clocks',
      'Calendar',
      'Banker Discount',
      'True Discount',
      'Stocks and Shares',
      'Surds and Indices',
      'Logarithms',
      'Simplification',
      'Square Root and Cube Root',
      'Decimal Fractions',
      'Odd Man Out and Series',
    ],
  },
  {
    id: 'logical',
    name: 'Logical Reasoning',
    icon: '🧩',
    topics: [
      'Number Series',
      'Analogies',
      'Puzzles',
      'Seating Arrangements',
      'Blood Relations',
      'Coding Decoding',
      'Syllogisms',
      'Direction Sense Test',
      'Ranking and Order',
      'Data Sufficiency',
      'Statement and Argument',
      'Statement and Assumption',
      'Statement and Conclusion',
      'Cause and Effect',
      'Letter and Symbol Series',
      'Logical Problems',
      'Classification',
      'Making Judgments',
    ],
  },
  {
    id: 'verbal',
    name: 'Verbal Ability',
    icon: '📝',
    topics: [
      'Synonyms',
      'Antonyms',
      'Ordering of Words',
      'Ordering of Sentences',
      'Sentence Formation',
      'Sentence Completion',
      'Sentence Correction',
      'Sentence Improvement',
      'Spotting Errors',
      'Passage Correction',
      'Substitution',
      'Active and Passive Voice',
      'Direct and Indirect Speech',
      'Para Jumbles',
      'Fill in the Blanks',
      'Idioms and Phrases',
      'One Word Substitution',
      'Spellings',
      'Reading Comprehension',
      'Verbal Analogies',
    ],
  },
  {
    id: 'data',
    name: 'Data Interpretation',
    icon: '📊',
    topics: [
      'Bar Charts',
      'Pie Charts',
      'Line Charts',
      'Tables',
      'Caselets',
      'Mixed DI',
    ],
  },
  {
    id: 'nonverbal',
    name: 'Non Verbal Reasoning',
    icon: '🎯',
    topics: [
      'Series Completion',
      'Analogy',
      'Classification',
      'Mirror Images',
      'Water Images',
      'Embedded Figures',
      'Pattern Completion',
      'Figure Matrix',
      'Paper Folding',
      'Paper Cutting',
      'Rule Detection',
      'Grouping of Images',
      'Dot Situation',
      'Figure Formation',
      'Cubes and Dice',
    ],
  },
];

export interface AptitudeProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  questionsAnswered: number;
  earnedBadges: string[];
  topicProgress: Record<string, number>;
  dailyChallengeCompleted: string | null;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  mode: LearningMode;
  topic?: string;
  createdAt: string;
  updatedAt: string;
}

export const XP_REWARDS = {
  questionSolved: 15,
  quizCompleted: 30,
  dailyChallenge: 50,
  streakBonus: 10,
  topicMastery: 100,
} as const;
