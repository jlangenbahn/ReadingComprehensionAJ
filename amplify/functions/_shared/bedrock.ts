import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";

const client = new BedrockRuntimeClient({
  maxAttempts: 5,
  retryMode: "adaptive",
});

export function converseText(response: {
  output?: { message?: { content?: Array<{ text?: string }> } };
}) {
  return (response.output?.message?.content ?? [])
    .map((block) => (typeof block.text === "string" ? block.text : ""))
    .join("")
    .trim();
}

export function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/\{[\s\S]*\}/);
  const payload = fenced?.[0] ?? trimmed;
  return JSON.parse(payload) as Record<string, unknown>;
}

export async function converseJson(input: {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  temperature: number;
}) {
  const response = await client.send(
    new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: input.systemPrompt }],
      messages: [
        {
          role: "user",
          content: [{ text: input.userPrompt }],
        },
      ],
      inferenceConfig: {
        maxTokens: input.maxTokens,
        temperature: input.temperature,
      },
    }),
  );

  const text = converseText(response);
  if (!text) {
    throw new Error("The model returned an empty response.");
  }
  return parseJsonObject(text);
}
