// ChatHistory.js
"use client";
import ChatMessage from "@/components/chatMessage/chatMessage";
import { ChatbotMessage } from "@/types/chatbot";
import styles from "./chatHistory.module.css";

interface ChatHistoryProps {
  history: ChatbotMessage[];
}

export default function ChatHistory({ history }: ChatHistoryProps) {
  return (
    <div className={styles.chatHistory}>
      {history.map((message, index) => (
        <div
          key={index}
          className={
            message.role === "user" ? styles.userMessage : styles.modelMessage
          }
        >
          <span>{message.role === "user" ? "user" : "PantryPal"}</span>
          <ChatMessage source={message.message} />
        </div>
      ))}
    </div>
  );
}
