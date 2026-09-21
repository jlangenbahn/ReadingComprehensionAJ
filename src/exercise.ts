import { choiceKeys, type ChoiceKey } from "./options";

export type ExerciseQuestion = {
  id: string;
  prompt: string;
  choices: Record<ChoiceKey, string>;
  correctChoice: ChoiceKey;
};

export type Exercise = {
  title: string;
  passage: string;
  questions: ExerciseQuestion[];
};

export type GradeResult = {
  questionId: string;
  isCorrect: boolean;
  correctChoice: ChoiceKey;
  explanation: string;
  highlightQuote: string;
};

export type GradeReport = {
  summary: string;
  results: GradeResult[];
};

function asChoice(value: unknown, fallback: ChoiceKey = "A"): ChoiceKey {
  const letter = String(value ?? "")
    .trim()
    .toUpperCase()
    .slice(0, 1);
  return choiceKeys.includes(letter as ChoiceKey)
    ? (letter as ChoiceKey)
    : fallback;
}

export function normalizeExercise(input: unknown): Exercise | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const title = String(raw.title ?? "Reading passage").trim() || "Reading passage";
  const passage = String(raw.passage ?? "").trim();
  const questionsIn = Array.isArray(raw.questions) ? raw.questions : [];
  const questions: ExerciseQuestion[] = questionsIn.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const q = item as Record<string, unknown>;
    const prompt = String(q.prompt ?? "").trim();
    const choices: Record<ChoiceKey, string> = {
      A: String(q.choiceA ?? "").trim(),
      B: String(q.choiceB ?? "").trim(),
      C: String(q.choiceC ?? "").trim(),
      D: String(q.choiceD ?? "").trim(),
    };
    if (!prompt || !choices.A || !choices.B || !choices.C || !choices.D) {
      return [];
    }
    return [
      {
        id: String(q.id ?? `q${index + 1}`),
        prompt,
        choices,
        correctChoice: asChoice(q.correctChoice),
      },
    ];
  });

  if (!passage || questions.length === 0) return null;
  return { title, passage, questions };
}

export function normalizeGradeReport(
  input: unknown,
  exercise: Exercise,
  answers: Record<string, ChoiceKey>,
): GradeReport {
  const raw =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const incoming = Array.isArray(raw.results) ? raw.results : [];
  const byId = new Map<string, Record<string, unknown>>();
  for (const item of incoming) {
    if (item && typeof item === "object") {
      const row = item as Record<string, unknown>;
      byId.set(String(row.questionId ?? ""), row);
    }
  }

  const results: GradeResult[] = exercise.questions.map((question) => {
    const row = byId.get(question.id);
    const studentChoice = answers[question.id];
    const isCorrect = studentChoice === question.correctChoice;
    return {
      questionId: question.id,
      isCorrect,
      correctChoice: question.correctChoice,
      explanation: String(row?.explanation ?? "").trim(),
      highlightQuote: String(row?.highlightQuote ?? "").trim(),
    };
  });

  const correctCount = results.filter((result) => result.isCorrect).length;
  const summary =
    String(raw.summary ?? "").trim() ||
    `You got ${correctCount} of ${results.length} correct.`;

  return { summary, results };
}
