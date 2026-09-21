import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { generateExerciseFn } from '../functions/generate-exercise/resource';
import { gradeAnswersFn } from '../functions/grade-answers/resource';

const schema = a.schema({
  MultipleChoiceQuestion: a.customType({
    id: a.string(),
    prompt: a.string(),
    choiceA: a.string(),
    choiceB: a.string(),
    choiceC: a.string(),
    choiceD: a.string(),
    correctChoice: a.string(),
  }),

  GeneratedExercise: a.customType({
    title: a.string(),
    passage: a.string(),
    questions: a.ref('MultipleChoiceQuestion').array(),
  }),

  GradedQuestion: a.customType({
    questionId: a.string(),
    isCorrect: a.boolean(),
    correctChoice: a.string(),
    explanation: a.string(),
    highlightQuote: a.string(),
  }),

  GradeReport: a.customType({
    summary: a.string(),
    results: a.ref('GradedQuestion').array(),
  }),

  generateReading: a
    .query()
    .arguments({
      levelKind: a.string().required(),
      levelValue: a.string().required(),
      fictionType: a.string().required(),
      genre: a.string().required(),
      textSize: a.string().required(),
      questionCount: a.string().required(),
      difficulty: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(generateExerciseFn))
    .authorization((allow) => [allow.authenticated()]),

  gradeReading: a
    .query()
    .arguments({
      levelKind: a.string().required(),
      levelValue: a.string().required(),
      passage: a.string().required(),
      questionsJson: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(gradeAnswersFn))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
