import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  ageOptions,
  difficultyOptions,
  genreOptions,
  gradeOptions,
  questionCountOptions,
  textSizeOptions,
  type FictionType,
  type LevelKind,
  type SetupValues,
} from "./options";

type SetupFormProps = {
  value: SetupValues;
  onChange: (next: SetupValues) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error?: string;
};

export default function SetupForm({
  value,
  onChange,
  onGenerate,
  isGenerating,
  error,
}: SetupFormProps) {
  const patch = (partial: Partial<SetupValues>) => onChange({ ...value, ...partial });

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper sx={{ width: "min(720px, 100%)", p: { xs: 2.5, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Make a reading
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose the level, topic, length, and questions. Then generate a passage.
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Reading level
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={value.levelKind}
              onChange={(_event, next: LevelKind | null) => {
                void _event;
                if (next) patch({ levelKind: next });
              }}
            >
              <ToggleButton value="grade">Grade</ToggleButton>
              <ToggleButton value="age">Age</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {value.levelKind === "grade" ? (
            <FormControl fullWidth>
              <InputLabel id="grade-label">Grade</InputLabel>
              <Select
                labelId="grade-label"
                label="Grade"
                value={value.grade}
                onChange={(event) => patch({ grade: event.target.value })}
              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="age-label">Age</InputLabel>
              <Select
                labelId="age-label"
                label="Age"
                value={value.age}
                onChange={(event) => patch({ age: event.target.value })}
              >
                {ageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Kind of text
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={value.fictionType}
              onChange={(_event, next: FictionType | null) => {
                void _event;
                if (next) patch({ fictionType: next });
              }}
            >
              <ToggleButton value="fiction">Fiction</ToggleButton>
              <ToggleButton value="nonfiction">Nonfiction</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              label="Genre"
              value={value.genre}
              onChange={(event) =>
                patch({ genre: event.target.value as SetupValues["genre"] })
              }
            >
              {genreOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="size-label">Passage length</InputLabel>
            <Select
              labelId="size-label"
              label="Passage length"
              value={value.textSize}
              onChange={(event) =>
                patch({ textSize: event.target.value as SetupValues["textSize"] })
              }
            >
              {textSizeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="count-label">Number of questions</InputLabel>
            <Select
              labelId="count-label"
              label="Number of questions"
              value={value.questionCount}
              onChange={(event) =>
                patch({ questionCount: Number(event.target.value) })
              }
            >
              {questionCountOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="difficulty-label">Question difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              label="Question difficulty"
              value={value.difficulty}
              onChange={(event) =>
                patch({
                  difficulty: event.target.value as SetupValues["difficulty"],
                })
              }
            >
              {difficultyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            size="large"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Writing your passage..." : "Generate story"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
