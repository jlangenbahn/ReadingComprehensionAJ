import { defineFunction } from '@aws-amplify/backend';

export const generateExerciseFn = defineFunction({
  name: 'generate-exercise',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
  runtime: 20,
  resourceGroupName: 'data',
});
