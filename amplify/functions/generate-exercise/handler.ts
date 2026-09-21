import { converseJson } from "../_shared/bedrock";

type Event = {
  arguments: {
    levelKind: string;
    levelValue: string;
    fictionType: string;
    genre: string;
    textSize: string;
    questionCount: string;
    difficulty: string;
  };
};

const SYSTEM_PROMPT = `You create original reading-comprehension passages and multiple-choice questions for students.
Return ONLY valid JSON with this shape:
{
  "title": "string",
  "passage": "string",
  "questions": [
    {
      "id": "q1",
      "prompt": "string",
      "choiceA": "string",
      "choiceB": "string",
      "choiceC": "string",
      "choiceD": "string",
      "correctChoice": "A"
    }
  ]
}

Rules:
- Write original content only. Never copy copyrighted books, articles, or poems.
- Match vocabulary, sentence length, and ideas to the given grade or age.
- If fictionType is fiction, write a complete original story. If nonfiction, write an original informative passage.
- Stay on the given genre.
- Passage length by textSize:
  - small: 120 to 180 words
  - medium: 220 to 320 words
  - large: 400 to 520 words
  - extra_large: 650 to 800 words
- Create exactly questionCount questions. Each has four plausible choices and exactly one best answer.
- correctChoice must be A, B, C, or D.
- Question difficulty:
  - easy: directly stated facts
  - medium: simple inference
  - hard: inference plus vocabulary in context
  - extra_hard: close distractors and multi-sentence evidence
  - godlike: subtle tone, author's purpose, or combining details from different parts of the passage
- Do not announce the answers in the passage.
- Separate passage paragraphs with blank lines.`;

export const handler = async (event: Event) => {
  const args = event.arguments;
  const data = await converseJson({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Create the exercise with these settings:
levelKind: ${args.levelKind}
levelValue: ${args.levelValue}
fictionType: ${args.fictionType}
genre: ${args.genre}
textSize: ${args.textSize}
questionCount: ${args.questionCount}
difficulty: ${args.difficulty}`,
    maxTokens: 4000,
    temperature: 0.7,
  });

  return JSON.stringify({
    title: String(data.title ?? "Reading passage"),
    passage: String(data.passage ?? ""),
    questions: Array.isArray(data.questions) ? data.questions : [],
  });
};
