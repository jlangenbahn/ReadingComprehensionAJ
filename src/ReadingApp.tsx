import { useState } from "react";
import type { AuthUser } from "aws-amplify/auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { client } from "./client";
import {
  normalizeExercise,
  normalizeGradeReport,
  type Exercise,
  type GradeReport,
} from "./exercise";
import { defaultSetup, levelLabel, type ChoiceKey, type SetupValues } from "./options";
import SetupForm from "./SetupForm.tsx";
import Workspace from "./Workspace.tsx";

function formatErrors(errors: { message?: string }[] | undefined) {
  if (!errors?.length) return "Something went wrong. Please try again.";
  return errors.map((error) => error.message).filter(Boolean).join(" ");
}

export default function ReadingApp({
  user,
  signOut,
}: {
  user?: AuthUser;
  signOut?: () => void;
}) {
  const [setup, setSetup] = useState<SetupValues>(defaultSetup);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answers, setAnswers] = useState<Record<string, ChoiceKey>>({});
  const [gradeReport, setGradeReport] = useState<GradeReport | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState("");

  const loginId = user?.signInDetails?.loginId ?? "";

  async function generateStory() {
    setError("");
    setIsGenerating(true);
    try {
      const { data, errors } = await client.queries.generateReading({
        levelKind: setup.levelKind,
        levelValue: levelLabel(setup),
        fictionType: setup.fictionType,
        genre: setup.genre,
        textSize: setup.textSize,
        questionCount: String(setup.questionCount),
        difficulty: setup.difficulty,
      });
      const payload = typeof data === "string" ? JSON.parse(data) : data;
      const next = normalizeExercise(payload);
      if (errors?.length || !next) {
        setError(formatErrors(errors) || "The passage could not be created. Try again.");
        return;
      }
      setExercise(next);
      setAnswers({});
      setGradeReport(undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The passage could not be created.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function gradeAnswers() {
    if (!exercise) return;
    setError("");
    setIsGrading(true);
    try {
      const questionsJson = JSON.stringify(
        exercise.questions.map((question) => ({
          questionId: question.id,
          prompt: question.prompt,
          choiceA: question.choices.A,
          choiceB: question.choices.B,
          choiceC: question.choices.C,
          choiceD: question.choices.D,
          correctChoice: question.correctChoice,
          studentChoice: answers[question.id],
        })),
      );
      const { data, errors } = await client.queries.gradeReading({
        levelKind: setup.levelKind,
        levelValue: levelLabel(setup),
        passage: exercise.passage,
        questionsJson,
      });
      const payload = typeof data === "string" ? JSON.parse(data) : data;
      setGradeReport(normalizeGradeReport(payload, exercise, answers));
      if (errors?.length) {
        setError(formatErrors(errors));
      }
    } catch (cause) {
      setGradeReport(normalizeGradeReport(null, exercise, answers));
      setError(cause instanceof Error ? cause.message : "Grading failed. Showing local results.");
    } finally {
      setIsGrading(false);
    }
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Box
            component="img"
            src="/reading-comprehension-aj.svg"
            alt=""
            sx={{ width: 36, height: 36, bgcolor: "#fff", borderRadius: 1 }}
          />
          <Typography variant="h6" sx={{ flex: 1 }}>
            ReadingComprehensionAJ
          </Typography>
          {exercise ? (
            <Button color="inherit" variant="outlined" onClick={() => {
              setExercise(null);
              setAnswers({});
              setGradeReport(undefined);
              setError("");
            }}>
              New passage
            </Button>
          ) : null}
          <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, opacity: 0.8 }}>
            {loginId}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={signOut}>
            Sign out
          </Button>
        </Toolbar>
        {isGenerating || isGrading ? <LinearProgress /> : null}
      </AppBar>

      {exercise ? (
        <Workspace
          setup={setup}
          exercise={exercise}
          answers={answers}
          onAnswer={(questionId, choice) =>
            setAnswers((current) => ({ ...current, [questionId]: choice }))
          }
          onGrade={gradeAnswers}
          isGrading={isGrading}
          gradeReport={gradeReport}
          error={error}
        />
      ) : (
        <SetupForm
          value={setup}
          onChange={setSetup}
          onGenerate={generateStory}
          isGenerating={isGenerating}
          error={error}
        />
      )}
    </Box>
  );
}
