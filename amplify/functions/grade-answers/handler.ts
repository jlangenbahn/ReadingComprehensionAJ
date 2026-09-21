import { converseJson } from "../_shared/bedrock";

type Event = {
  arguments: {
    levelKind: string;
    levelValue: string;
    passage: string;
    questionsJson: string;
  };
};

const SYSTEM_PROMPT = `You are a patient reading teacher grading multiple-choice answers.
Return ONLY valid JSON with this shape:
{
  "summary": "string",
  "results": [
    {
      "questionId": "q1",
      "isCorrect": true,
      "correctChoice": "A",
      "explanation": "string",
      "highlightQuote": "string"
    }
  ]
}

questionsJson is a JSON array of objects with: questionId, prompt, choiceA, choiceB, choiceC, choiceD, correctChoice, studentChoice.

For every question:
- Compare studentChoice to correctChoice.
- Write explanation at the student's grade or age so they can understand it.
- If the student is correct, briefly say why that choice is best.
- If the student is wrong, give an in-depth explanation: why their choice is weaker, why the correct choice is best, and what to look for next time.
- highlightQuote must be an exact short phrase copied from the passage (one sentence or less) that a student should reread to arrive at the correct answer. Do not paraphrase it.
- summary should be one encouraging sentence about the overall result.`;

export const handler = async (event: Event) => {
  const args = event.arguments;
  const data = await converseJson({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Grade these answers for a ${args.levelKind} level of ${args.levelValue}.

Passage:
${args.passage}

Questions and answers JSON:
${args.questionsJson}`,
    maxTokens: 3000,
    temperature: 0.2,
  });

  return JSON.stringify({
    summary: String(data.summary ?? ""),
    results: Array.isArray(data.results) ? data.results : [],
  });
};
