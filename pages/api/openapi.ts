import { NextApiResponse, NextApiRequest } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export default async function handler(req: any, res: any) {
  console.log("Inside!");
  const openai = new OpenAIApi(configuration);
  const { message } = req.body;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    // instruction: prompt,
    max_tokens: 1000,
  });
  const data = response.data.choices[0].text;
  console.log(response);
  res.send(data);
}
