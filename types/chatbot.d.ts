export type ChatbotMessage = {
  role: "user" | "model";
  message: string;
};


export type ServerChatbotHistoryMessage = {
    role: "user" | "model";
    parts: { text: string }[];
}