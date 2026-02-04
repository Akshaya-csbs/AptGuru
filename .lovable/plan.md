
# Chat History & Response Formatting Improvements

This plan adds persistent chat history organized by date, and improves AI response formatting by avoiding special symbols and enhancing readability.

---

## Feature 1: Chat History System

### What You'll Get
- A sidebar showing all your past conversations
- Conversations grouped by date (Today, Yesterday, Last 7 Days, Older)
- Most recent chats appear first
- Click any chat to continue where you left off
- Start new conversations while keeping old ones saved

### How It Works

**Database Storage**
A new table will store your chat sessions:

| Field | Purpose |
|-------|---------|
| Session ID | Unique identifier for each chat |
| Title | Auto-generated from first question |
| Messages | Full conversation stored as JSON |
| Topic | What topic was selected |
| Mode | Solve/Learn/Quiz/ELI10 |
| Created/Updated | For date grouping |

**UI Changes**
- New sidebar component on the left side
- Toggle button in header to show/hide history
- Date headers: "Today", "Yesterday", "This Week", "Older"
- "New Chat" button to start fresh
- Delete option for old chats

---

## Feature 2: Better Response Formatting

### What Changes
The AI will now:
- Avoid dollar signs, special math symbols, and LaTeX
- Use clear text alternatives (e.g., "Rs. 500" instead of "$500")
- Format numbers with words (e.g., "50 percent" or "50%")
- Use bullet points consistently for steps
- Highlight important terms in bold
- Show formulas in plain text code blocks

### Examples

**Before:**
```
If principal = $1000, rate = 5%...
Using SI = P × R × T / 100
```

**After:**
```
If principal = Rs. 1000 (or 1000 units), rate = 5 percent...

Formula: Simple Interest = (Principal x Rate x Time) / 100
```

---

## Technical Implementation

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/ChatHistory.tsx` | Sidebar with conversation list |
| `src/components/ChatHistoryItem.tsx` | Individual chat card |
| `src/hooks/useChatHistory.ts` | Hook to manage history in localStorage |

### Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/chat/index.ts` | Update system prompt for better formatting |
| `src/components/Chatbot.tsx` | Add history sidebar, save/load chats |
| `src/components/ChatHeader.tsx` | Add history toggle button |
| `src/types/aptitude.ts` | Add ChatSession type |
| `src/hooks/useAptitudeChat.ts` | Add session management |

---

## Data Structure

**Chat Session (stored in localStorage)**
```text
ChatSession:
  - id: unique string
  - title: first question preview (truncated)
  - messages: array of conversation messages
  - mode: solve/learn/quiz/eli10
  - topic: selected topic (optional)
  - createdAt: ISO date string
  - updatedAt: ISO date string
```

**localStorage Key**: `aptitude_guru_chat_history`

---

## Updated AI Formatting Rules

The system prompt will include these new guidelines:

**Avoid These Symbols:**
- Dollar sign for currency (use "Rs." or "rupees" or "units")
- LaTeX notation (use plain text)
- Complex mathematical symbols

**Use These Instead:**
- Clean bullet points with dashes or numbers
- Bold for key terms and final answers
- Code blocks for formulas (plain text, no special symbols)
- Clear section headers
- Short, scannable paragraphs

**Structure for Solutions:**
1. **Problem**: Brief restatement
2. **Given**: Listed as bullet points
3. **Formula**: In plain text code block
4. **Solution**: Numbered steps with calculations
5. **Shortcut**: Highlighted tip box
6. **Answer**: Bold and highlighted

---

## User Interface Design

**Chat History Sidebar (Left Side)**
```text
+---------------------------+
|  [X] Chat History         |
+---------------------------+
| [+ New Chat]              |
+---------------------------+
| TODAY                     |
| - Percentage problem...   |
| - Time and work quest...  |
+---------------------------+
| YESTERDAY                 |
| - Ratio proportion...     |
+---------------------------+
| THIS WEEK                 |
| - Blood relations puz...  |
+---------------------------+
```

**Header Changes**
- New "History" button (clock icon) next to progress badge
- Shows/hides the sidebar panel

---

## Implementation Order

1. Update AI system prompt with formatting rules
2. Create ChatSession type in aptitude.ts
3. Build useChatHistory hook for localStorage management
4. Create ChatHistory sidebar component
5. Create ChatHistoryItem component
6. Update Chatbot to integrate history
7. Add history toggle to ChatHeader
8. Update useAptitudeChat for session save/load

---

## Storage Notes

- All chat history stored in browser localStorage
- No login required (device-specific history)
- Maximum 50 conversations stored (auto-delete oldest)
- Each conversation limited to last 50 messages
