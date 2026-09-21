import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import type { Exercise, GradeReport } from "./exercise";
import { highlightPassage } from "./highlight";
import { choiceKeys, isYoungReader, type ChoiceKey, type SetupValues } from "./options";

type WorkspaceProps = {
  setup: SetupValues;
  exercise: Exercise;
  answers: Record<string, ChoiceKey>;
  onAnswer: (questionId: string, choice: ChoiceKey) => void;
  onGrade: () => void;
  isGrading: boolean;
  gradeReport?: GradeReport;
  error?: string;
};

export default function Workspace({
  setup,
  exercise,
  answers,
  onAnswer,
  onGrade,
  isGrading,
  gradeReport,
  error,
}: WorkspaceProps) {
  const graded = Boolean(gradeReport);
  const unanswered = exercise.questions.some((question) => !answers[question.id]);
  const quotes =
    gradeReport?.results
      .filter((result) => !result.isCorrect && result.highlightQuote)
      .map((result) => result.highlightQuote) ?? [];
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        <Paper
          sx={{
            maxWidth: 860,
            mx: "auto",
            p: { xs: 2.5, md: 4.5 },
            minHeight: "100%",
          }}
        >
          <Typography variant="overline" color="primary">
            {setup.fictionType} · {setup.genre} · {setup.levelKind === "grade" ? setup.grade : setup.age}
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            {exercise.title}
          </Typography>
          <Typography
            component="div"
            sx={{
              fontSize: isYoungReader(setup) ? "1.35rem" : "1.2rem",
              lineHeight: 1.75,
              color: "#000",
              whiteSpace: "pre-wrap",
              "& .passage-mark": {
                backgroundColor: "#bbdefb",
                color: "#000",
                padding: "0.05em 0.15em",
                borderRadius: "4px",
              },
            }}
          >
            {highlightPassage(exercise.passage, quotes)}
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: 420 },
          flexShrink: 0,
          borderLeft: { md: "1px solid #cfd8dc" },
          borderTop: { xs: "1px solid #cfd8dc", md: "none" },
          bgcolor: "#fff",
          overflow: "auto",
          p: 2.5,
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Questions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Read the passage, then choose an answer for each question.
        </Typography>

        {gradeReport ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {gradeReport.summary}
          </Alert>
        ) : null}

        <Stack spacing={2.5} divider={<Divider />}>
          {exercise.questions.map((question, index) => {
            const result = gradeReport?.results.find(
              (item) => item.questionId === question.id,
            );
            return (
              <FormControl key={question.id} fullWidth>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {index + 1}. {question.prompt}
                </Typography>
                <RadioGroup
                  value={answers[question.id] ?? ""}
                  onChange={(event) =>
                    onAnswer(question.id, event.target.value as ChoiceKey)
                  }
                >
                  {choiceKeys.map((key) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      disabled={graded}
                      control={<Radio />}
                      label={`${key}. ${question.choices[key]}`}
                      sx={{
                        alignItems: "flex-start",
                        ml: 0,
                        ".MuiFormControlLabel-label": { mt: 1 },
                        bgcolor:
                          result && result.correctChoice === key
                            ? "#e3f2fd"
                            : result &&
                                answers[question.id] === key &&
                                !result.isCorrect
                              ? "#eceff1"
                              : "transparent",
                        borderRadius: 1,
                        px: 1,
                      }}
                    />
                  ))}
                </RadioGroup>
                {result ? (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      bgcolor: result.isCorrect ? "#e3f2fd" : "#000",
                      color: result.isCorrect ? "#000" : "#fff",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {result.isCorrect ? "Correct" : "Not the best answer"}
                    </Typography>
                    <Typography variant="body2">
                      {result.explanation ||
                        (result.isCorrect
                          ? `Yes. ${result.correctChoice} is the best answer.`
                          : `The best answer is ${result.correctChoice}. Look at the highlighted part of the passage and try again next time.`)}
                    </Typography>
                  </Box>
                ) : null}
              </FormControl>
            );
          })}
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Button
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          onClick={onGrade}
          disabled={graded || unanswered || isGrading}
        >
          {isGrading
            ? "Grading..."
            : unanswered
              ? "Answer every question"
              : "Grade answers"}
        </Button>
      </Box>
    </Box>
  );
}
