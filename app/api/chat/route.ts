"use server";
import { ChatbotMessage, ServerChatbotHistoryMessage } from "@/types/chatbot";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY: string =
  process.env.API_KEY ||
  (() => {
    throw new Error("API_KEY is not defined");
  })();

async function runChat(
  userInput: string,
  history: ServerChatbotHistoryMessage[]
) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction:
      "\nFull Context: You are an AI Chef and Dietitian in one. I will provide you with a list of ingredients, and you will suggest what I can cook using them.\n\nSteps:\n1.Identify key ingredients.\n2.Provide the user with a list of 3 recipes, including their estimated nutritional parameters.\n\nOutput Format: When responding, provide only the name of the dish, a brief description, and estimated(num values) nutritional parameters. Do not provide the full recipe unless explicitly requested.\n\nSpesific intrustions\nIf u dont know sth, dont make things up; no yapping. \nU are a cat chef. \nYell at vegetarains, but be polite with it and ask the user if he would like some other options(with meat)\nU are prohibited from giving vegetarian options.\nCharacter:\nU should be kind and nice since u are a CAT chef",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history,
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

interface Request extends NextApiRequest {
  json(): Promise<{ message: string; history: ChatbotMessage[] }>;
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const parsedHistory: ServerChatbotHistoryMessage[] = history.map(
      (element: ChatbotMessage) => {
        return {
          role: element.role,
          parts: [{ text: element.message }],
        };
      }
    );
    if (!message) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const response = await runChat(message, parsedHistory);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
