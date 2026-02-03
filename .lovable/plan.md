
# AptitudeGuru - Updated Implementation Plan

Transform the current chatbot into an intelligent aptitude tutor with your specified leveling system and resource-based learning.

---

## Your Custom Leveling System

| Level | XP Range | Title |
|-------|----------|-------|
| 1 | 0 - 499 XP | Beginner |
| 2 | 500 - 999 XP | Intermediate |
| 3 | 1000 - 1999 XP | Pro |
| 4 | 2000+ XP | Master |

**XP Rewards:**
- Question solved correctly: +15 XP
- Quiz completed: +30 XP
- Daily challenge: +50 XP
- Streak bonus: +10 XP per consecutive day
- Topic mastery: +100 XP

---

## Resource-Based Learning

The AI will be trained with knowledge from these trusted aptitude platforms:

**IndiaBix** - Comprehensive aptitude question bank
- Quantitative, Verbal, Logical sections
- Interview questions and company-specific patterns

**GeeksforGeeks** - Technical aptitude focus
- Algorithm-based questions
- Coding aptitude and puzzles
- Data structures reasoning

**CareerRide** - Placement preparation
- HR and technical interview questions
- Campus placement patterns
- Company-wise question sets

The system prompt will instruct the AI to provide solutions and explanations in the style and quality of these resources.

---

## Implementation Phases

### Phase 1: Enable Lovable Cloud + AI Backend

**Create Edge Function** (`supabase/functions/chat/index.ts`)

The AI will receive a detailed system prompt that:
- References question patterns from IndiaBix, GeeksforGeeks, CareerRide
- Explains step-by-step like these platforms do
- Provides shortcuts and tricks commonly found on these sites
- Explains why wrong options fail (key IndiaBix feature)

**System Prompt Highlights:**
```
You are AptitudeGuru, an expert aptitude tutor trained on resources 
from IndiaBix, GeeksforGeeks, and CareerRide.

SOLVING APPROACH (IndiaBix style):
- Clear step-by-step breakdown
- Formula used with explanation
- Shortcut method when available
- Why each wrong option fails

TEACHING STYLE (GeeksforGeeks approach):
- Concept → Example → Practice
- Algorithm-based thinking for logical puzzles
- Time complexity awareness for speed

PRACTICE QUESTIONS (CareerRide patterns):
- Company-specific question styles
- Interview-ready explanations
- Common placement patterns
```

---

### Phase 2: Update UI Components

**ChatHeader Updates:**
- Rename to "AptitudeGuru"
- Add mode selector: Solve | Learn | Quiz | ELI10
- Show level badge with XP progress
- Display streak counter (flame icon)
- Topic dropdown selector

**ChatInput Updates:**
- Image upload button for question photos
- "Get Hint" button (available in quiz mode)
- Paste image support

**ChatMessage Updates:**
- Markdown rendering for formatted solutions
- Collapsible "Shortcut Method" sections
- Image display in bubbles

---

### Phase 3: Gamification System

**Progress Hook** (`src/hooks/useProgress.ts`):
```typescript
interface AptitudeProgress {
  xp: number;
  level: 'beginner' | 'intermediate' | 'pro' | 'master';
  streak: number;
  lastActiveDate: string;
  questionsAnswered: number;
  badges: string[];
  topicProgress: {
    quantitative: number;
    logical: number;
    verbal: number;
    dataInterpretation: number;
  };
}
```

**Level Calculation:**
```typescript
function getLevel(xp: number) {
  if (xp >= 2000) return { level: 'master', title: 'Master', color: 'gold' };
  if (xp >= 1000) return { level: 'pro', title: 'Pro', color: 'purple' };
  if (xp >= 500) return { level: 'intermediate', title: 'Intermediate', color: 'blue' };
  return { level: 'beginner', title: 'Beginner', color: 'green' };
}
```

**Badges:**
- First Steps - Solve 1 question
- Quick Learner - Complete 10 questions
- Streak Starter - 3-day streak
- Streak Master - 7-day streak
- Speed Demon - Quiz under 2 minutes
- Topic Expert - 50 questions in one topic

---

### Phase 4: Quick Actions & Topics

**Topic Categories:**

| Category | Topics |
|----------|--------|
| Quantitative | Percentages, Ratio, Profit/Loss, Time & Work, Speed & Distance, Probability, Averages |
| Logical | Puzzles, Seating, Blood Relations, Coding-Decoding, Syllogisms |
| Verbal | Synonyms, Antonyms, Reading Comprehension, Sentence Correction |
| Data Interpretation | Bar Graphs, Pie Charts, Tables, Caselets |

**Quick Action Buttons:**
- Daily Challenge
- Random Question
- Topic-wise practice buttons
- "Explain Like I'm 10" mode toggle

---

### Phase 5: Quiz Mode

**QuizMode Component:**
- Timed questions (configurable: 1-5 min)
- Multiple choice display
- Hint system (reduces XP reward by 50%)
- Immediate feedback with explanation
- Score tracking per session

**Daily Challenge:**
- One curated question per day
- 50 XP reward (2x normal)
- Separate completion tracking
- Special badge for 7-day completion streak

---

## Files Overview

### New Files to Create
| File | Purpose |
|------|---------|
| `supabase/functions/chat/index.ts` | AI backend with aptitude system prompt |
| `src/hooks/useProgress.ts` | XP, levels, streaks, badges |
| `src/hooks/useAptitudeChat.ts` | Streaming chat with modes |
| `src/components/QuickActions.tsx` | Topic buttons, daily challenge |
| `src/components/ProgressBadge.tsx` | Level display with progress bar |
| `src/components/ModeSelector.tsx` | Solve/Learn/Quiz/ELI10 tabs |
| `src/components/TopicSelector.tsx` | Dropdown for topics |
| `src/components/ImageUpload.tsx` | Question image upload |
| `src/components/QuizTimer.tsx` | Countdown for quiz mode |
| `src/lib/aptitude-topics.ts` | Topic definitions |
| `src/types/aptitude.ts` | TypeScript interfaces |

### Files to Modify
| File | Changes |
|------|---------|
| `src/components/Chatbot.tsx` | Add modes, streaming, gamification |
| `src/components/ChatHeader.tsx` | Mode selector, progress, streak |
| `src/components/ChatInput.tsx` | Image upload, hint button |
| `src/components/ChatMessage.tsx` | Markdown, collapsibles |
| `src/index.css` | New animations, level colors |
| `tailwind.config.ts` | Level color tokens |

---

## Technical Notes

**Streaming:** Real-time token display using fetch + ReadableStream

**Image Upload:** FileReader to base64, sent to Gemini (supports vision)

**Storage:** localStorage for progress (no database needed)

**Dependency to Add:** `react-markdown` for rendering AI responses

---

## Implementation Order

1. Enable Lovable Cloud
2. Create chat edge function with detailed aptitude system prompt
3. Update Chatbot.tsx with streaming responses
4. Add useProgress hook with your leveling system
5. Update ChatHeader with level badge and streak
6. Add markdown rendering to ChatMessage
7. Create ModeSelector and TopicSelector
8. Add image upload to ChatInput
9. Create QuickActions component
10. Implement QuizTimer and quiz mode
11. Add badges and achievements system
