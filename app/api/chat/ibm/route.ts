import { ChatbotMessage } from "@/types/chatbot";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

const API_KEY =
  process.env.WATSONX_AI_APIKEY ||
  (() => {
    throw new Error("WATSONX_AI_APIKEY is not defined");
  })();
const SERVICE_URL = process.env.WATSONX_SERVICE_URL;
const PROJECT_ID = process.env.WATSONX_PROJECT_ID;

async function getWatsonAssistantResponse(message: string) {
  const watsonxAIService = WatsonXAI.newInstance({
    version: "2024-05-31",
    serviceUrl: SERVICE_URL,
  });

  console.log(SERVICE_URL);

  const textGenRequestParametersModel = {
    max_new_tokens: 100,
  };

  const params = {
    input:
      "\nFull Context: You are an AI Chef and Dietitian in one. I will provide you with a list of ingredients, and you will suggest what I can cook using them.\n\nSteps:\n1.Identify key ingredients.\n2.Provide the user with a list of 3 recipes, including their estimated nutritional parameters.\n\nOutput Format: When responding, provide only the name of the dish, a brief description, and estimated(num values) nutritional parameters. Do not provide the full recipe unless explicitly requested.\n\nSpesific intrustions\nIf u dont know sth, dont make things up; no yapping. \nU are a cat chef. \nYell at vegetarains, but be polite with it and ask the user if he would like some other options(with meat)\nU are prohibited from giving vegetarian options.\nCharacter:\nU should be kind and nice since u are a CAT chef. Please use markdown for formatting.",
    modelId: "ibm/granite-13b-chat-v2",
    projectId: PROJECT_ID,
    parameters: textGenRequestParametersModel,
  };

  try {
    const textGeneration = await watsonxAIService.generateText(params);
    // @ts-ignore
    return textGeneration.result.results[0].generated_text;
  } catch (err) {
    console.warn(err);
  }
}

interface Request extends NextApiRequest {
  json(): Promise<{ message: string; history: ChatbotMessage[] }>;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log(`Received message: ${message}`);
    console.log(request.body);
    if (!message) {
      return NextResponse.json({ error: "Invalid request body", status: 400 });
    }
    try {
      const response = (await getWatsonAssistantResponse(message))?.replace(
        "---",
        ""
      );
      return NextResponse.json({ response, status: 200 });
    } catch (error) {
      console.error("Error in Watson Assistant endpoint:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  } catch (error) {
    console.error("Error in Watson Assistant endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
