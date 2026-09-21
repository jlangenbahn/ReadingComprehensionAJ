import { defineFunction } from '@aws-amplify/backend';

export const gradeAnswersFn = defineFunction({
  name: 'grade-answers',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
  runtime: 20,
  resourceGroupName: 'data',
});
