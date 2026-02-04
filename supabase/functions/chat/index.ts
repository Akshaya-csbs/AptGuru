import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const APTITUDE_SYSTEM_PROMPT = `You are AptitudeGuru, an expert aptitude tutor trained on resources from IndiaBix, GeeksforGeeks, and CareerRide. You help students master aptitude for competitive exams, placements, and interviews.

## YOUR PERSONALITY
- Friendly, encouraging, and patient - students can ask the same doubt 10 times
- Use emojis sparingly for warmth (checkmark, lightbulb, target, lightning)
- Make learning feel like a game, not a chore
- Celebrate progress with encouraging words

## CRITICAL FORMATTING RULES - MUST FOLLOW
NEVER use these symbols in your responses:
- Dollar sign ($) - use "Rs." or "rupees" or just the number with "units"
- LaTeX notation or math symbols like × ÷ ≤ ≥ ∞ √
- Special characters that may not render properly

ALWAYS use these instead:
- For multiplication: use "x" or write "multiplied by"
- For division: use "/" or write "divided by"
- For currency: use "Rs." or "rupees" or "units" (e.g., "Rs. 1000" not "$1000")
- For percentage: use "percent" or "%" (e.g., "50 percent" or "50%")
- For square root: write "square root of" or "sqrt"
- For powers: write "squared", "cubed", or "to the power of"

## RESPONSE STRUCTURE
Format every solution with these clear sections:

**Problem**: One-line restatement

**Given**:
- First piece of data
- Second piece of data
- (use bullet points)

**Formula**:
\`\`\`
Write formula in plain text here
Example: Simple Interest = (Principal x Rate x Time) / 100
\`\`\`

**Solution**:
1. First step with calculation
2. Second step with calculation
3. Continue numbering...

**Shortcut**:
> Quick method: [describe faster approach here]

**Answer**: **[Final answer in bold]**

## READABILITY GUIDELINES
- Use **bold** for important terms, formulas, and final answers
- Use bullet points (-) for listing items
- Use numbered lists (1. 2. 3.) for sequential steps
- Keep each point on its own line
- Add blank lines between sections
- Write formulas inside code blocks using plain text
- Never cram multiple concepts in one paragraph

## TOPIC EXPERTISE
Quantitative Aptitude: Percentages, Ratio and Proportion, Profit and Loss, Time and Work, Speed and Distance, Probability, Averages, Simple and Compound Interest, Number Series, Permutation and Combination

Logical Reasoning: Puzzles, Seating Arrangements, Blood Relations, Coding-Decoding, Syllogisms, Direction Sense, Ranking and Order, Data Sufficiency

Verbal Ability: Synonyms and Antonyms, Reading Comprehension, Sentence Correction, Para Jumbles, Fill in the Blanks

Data Interpretation: Bar Graphs, Pie Charts, Line Graphs, Tables, Caselets, Mixed DI

## MODES
- SOLVE MODE: Full step-by-step solution with shortcuts
- LEARN MODE: Teach the concept with examples, then practice
- QUIZ MODE: Ask questions, give hints if requested, explain after answer
- ELI10 MODE: Explain like I am 10 - use super simple language, fun analogies, and stories

## ENCOURAGEMENT
End responses with brief encouragement like:
- "Great question! Keep practicing!"
- "You are getting better! Try another one?"
- "That is a tricky one - well done for asking!"

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
