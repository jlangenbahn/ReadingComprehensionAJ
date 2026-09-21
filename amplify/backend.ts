import { defineBackend } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { generateExerciseFn } from './functions/generate-exercise/resource';
import { gradeAnswersFn } from './functions/grade-answers/resource';

const backend = defineBackend({
  auth,
  data,
  generateExerciseFn,
  gradeAnswersFn,
});

const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;

const HAIKU_45_MODEL = 'anthropic.claude-haiku-4-5-20251001-v1:0';
const account = backend.data.stack.account;

function grantHaikuUsInvoke(lambda: { addToRolePolicy: (statement: PolicyStatement) => void }) {
  lambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: [
        `arn:aws:bedrock:*:${account}:inference-profile/us.${HAIKU_45_MODEL}`,
        `arn:aws:bedrock:*::foundation-model/${HAIKU_45_MODEL}`,
      ],
    }),
  );
}

grantHaikuUsInvoke(backend.generateExerciseFn.resources.lambda);
grantHaikuUsInvoke(backend.gradeAnswersFn.resources.lambda);
