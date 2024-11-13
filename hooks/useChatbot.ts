import { ChatbotMessage } from "@/types/chatbot";
import { useEffect, useMemo, useState } from "react";

export function useChatbot() {
  const [history, setHistory] = useState<ChatbotMessage[]>([]);
  const addUserMessage = (message: string) => {
    console.log(`User: ${message}`);
    setHistory((prev) => [...prev, { role: "user", message }]);
  };

  const isHistoryEmpty = useMemo(() => history.length === 0, [history]);
  useEffect(() => {
    if (history.length === 0) {
      return;
    }
    const userMessage = history[history.length - 1];
    const historyWithoutLastMessage = history.slice(0, history.length - 1);
    console.log(userMessage.message);
    if (userMessage.role === "user") {
      fetch("/api/chat/ibm", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage.message,
          history: historyWithoutLastMessage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setHistory((prev) => [
            ...prev,
            { role: "model", message: data.response },
          ]);
        });
    }
  }, [history]);

  return { history, addUserMessage, isHistoryEmpty };
}
