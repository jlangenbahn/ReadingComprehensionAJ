export const choiceKeys = ["A", "B", "C", "D"] as const;
export type ChoiceKey = (typeof choiceKeys)[number];

export type LevelKind = "grade" | "age";
export type FictionType = "fiction" | "nonfiction";
export type Genre =
  | "Science"
  | "History"
  | "Mathematics"
  | "Classical Literature"
  | "Economics"
  | "Art";
export type TextSize = "small" | "medium" | "large" | "extra_large";
export type Difficulty = "easy" | "medium" | "hard" | "extra_hard" | "godlike";

export type SetupValues = {
  levelKind: LevelKind;
  grade: string;
  age: string;
  fictionType: FictionType;
  genre: Genre;
  textSize: TextSize;
  questionCount: number;
  difficulty: Difficulty;
};

export const gradeOptions = [
  "Kindergarten",
  "1st grade",
  "2nd grade",
  "3rd grade",
  "4th grade",
  "5th grade",
  "6th grade",
  "7th grade",
  "8th grade",
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade",
  "College",
];

export const ageOptions = [
  "5 years old",
  "6 years old",
  "7 years old",
  "8 years old",
  "9 years old",
  "10 years old",
  "11 years old",
  "12 years old",
  "13 years old",
  "14 years old",
  "15 years old",
  "16 years old",
  "17 years old",
  "18 years old",
  "Adult",
];

export const genreOptions: Genre[] = [
  "Science",
  "History",
  "Mathematics",
  "Classical Literature",
  "Economics",
  "Art",
];

export const textSizeOptions: { value: TextSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra large" },
];

export const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "extra_hard", label: "Extra hard" },
  { value: "godlike", label: "Godlike" },
];

export const questionCountOptions = [3, 4, 5, 6, 7, 8, 9, 10];

export const defaultSetup: SetupValues = {
  levelKind: "grade",
  grade: "5th grade",
  age: "10 years old",
  fictionType: "nonfiction",
  genre: "Science",
  textSize: "medium",
  questionCount: 5,
  difficulty: "medium",
};

export function levelLabel(setup: SetupValues) {
  return setup.levelKind === "grade" ? setup.grade : setup.age;
}

export function isYoungReader(setup: SetupValues) {
  if (setup.levelKind === "age") {
    const years = Number.parseInt(setup.age, 10);
    return Number.isFinite(years) && years <= 8;
  }
  return (
    setup.grade === "Kindergarten" ||
    setup.grade === "1st grade" ||
    setup.grade === "2nd grade"
  );
}
