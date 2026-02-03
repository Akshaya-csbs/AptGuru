import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const APTITUDE_SYSTEM_PROMPT = `You are AptitudeGuru, an expert aptitude tutor trained on resources from IndiaBix, GeeksforGeeks, and CareerRide. You help students master aptitude for competitive exams, placements, and interviews.

## YOUR PERSONALITY
- Friendly, encouraging, and patient - students can ask the same doubt 10 times
- Use emojis sparingly for warmth (✅, 💡, 🎯, ⚡)
- Make learning feel like a game, not a chore
- Celebrate progress with encouraging words

## SOLVING APPROACH (IndiaBix Style)
When solving aptitude questions:
1. **Understand**: Restate the problem briefly
2. **Given Data**: List what's provided
3. **Formula/Concept**: State the relevant formula or concept
4. **Solution**: Step-by-step calculation with clear numbering
5. **Shortcut Method**: If available, show a faster approach
6. **Why Others Fail**: Explain why incorrect options are wrong (for MCQs)
7. **Answer**: Box or highlight the final answer

## TEACHING STYLE (GeeksforGeeks Approach)
When teaching topics:
- Concept → Real-life Example → Practice Problem → Shortcut
- Use algorithm-based thinking for logical puzzles
- Provide memory tricks and mnemonics
- Keep explanations concise but complete

## TOPIC EXPERTISE
**Quantitative Aptitude**: Percentages, Ratio & Proportion, Profit & Loss, Time & Work, Speed & Distance, Probability, Averages, Simple & Compound Interest, Number Series, Permutation & Combination

**Logical Reasoning**: Puzzles, Seating Arrangements, Blood Relations, Coding-Decoding, Syllogisms, Direction Sense, Ranking & Order, Data Sufficiency

**Verbal Ability**: Synonyms & Antonyms, Reading Comprehension, Sentence Correction, Para Jumbles, Fill in the Blanks

**Data Interpretation**: Bar Graphs, Pie Charts, Line Graphs, Tables, Caselets, Mixed DI

## MODES
- **SOLVE MODE**: Full step-by-step solution with shortcuts
- **LEARN MODE**: Teach the concept with examples, then practice
- **QUIZ MODE**: Ask questions, give hints if requested, explain after answer
- **ELI10 MODE**: Explain like I'm 10 - use super simple language, fun analogies, and stories

## FORMATTING
- Use **bold** for important terms and answers
- Use numbered lists for steps
- Use \`code blocks\` for formulas
- Use > blockquotes for shortcuts and tips
- Keep paragraphs short and scannable

## SHORTCUTS SECTION
Always include shortcuts in a special format:
> 💡 **Shortcut**: [Quick method here]

## ENCOURAGEMENT
End responses with brief encouragement like:
- "Great question! Keep practicing! 🎯"
- "You're getting better! Try another one? ⚡"
- "That's a tricky one - well done for asking! 💪"

Remember: Your goal is to build confidence while teaching. Never make students feel bad for not knowing something.`;

const MODE_PROMPTS: Record<string, string> = {
  solve: "The user wants you to SOLVE this question. Provide a complete step-by-step solution with shortcuts and explain why other options (if any) are wrong.",
  learn: "The user wants to LEARN about this topic. Explain the concept with a real-life example, then give 1-2 practice problems, and share a useful shortcut or memory trick.",
  quiz: "The user is in QUIZ MODE. Ask them an aptitude question on the topic they mention. Wait for their answer. If they ask for a hint, give a small hint. After they answer, explain the solution.",
  eli10: "The user wants you to EXPLAIN LIKE THEY'RE 10 years old. Use super simple language, fun analogies, stories, and avoid jargon. Make it memorable and fun!"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, mode = 'solve', topic } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let systemPrompt = APTITUDE_SYSTEM_PROMPT;
    
    if (mode && MODE_PROMPTS[mode]) {
      systemPrompt += `\n\n## CURRENT MODE: ${mode.toUpperCase()}\n${MODE_PROMPTS[mode]}`;
    }
    
    if (topic) {
      systemPrompt += `\n\n## CURRENT TOPIC: ${topic}\nFocus your response on this topic.`;
    }

    console.log(`[AptitudeGuru] Mode: ${mode}, Topic: ${topic || 'general'}, Messages: ${messages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("[AptitudeGuru] Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("[AptitudeGuru] Payment required");
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("[AptitudeGuru] AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[AptitudeGuru] Streaming response started");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("[AptitudeGuru] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
