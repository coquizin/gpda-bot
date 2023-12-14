import { config } from "@/config/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: config.GPT_KEY,
});

export async function askGPT(prompt: string) {
  const response = await openai.completions.create({
    model: "text-davinci-002",
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const answer = response.choices[0].text;

  console.log(answer);
  return answer;
}
