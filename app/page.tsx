"use client";
import styles from "./page.module.css";
import { SampleQuery } from "@/components/sampleQuery/sampleQuery";
import { useState } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import ChatHistory from "@/components/chatHistory/chatHistory";

export default function Home() {
  const [query, setQuery] = useState("");
  const { history, addUserMessage, isHistoryEmpty } = useChatbot();

  function handleQuerySubmit() {
    addUserMessage(query);
    setQuery("");
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.logo}></span>
        <h6>PantryPal</h6>
      </nav>
      <main className={styles.main}>
        <div className={styles.chatbotInfoWrapper}>
          {isHistoryEmpty ? (
            <>
              <div className={styles.chatbotInfoHeader}>
                <span className={styles.chatbotLogo}></span>
                <h1>Hello, Stanley</h1>
                <h3>What we are cooking today?</h3>
                <p>
                  Ready to assist you with anything u need. From cooking eggs to
                  making a Soufflé. Let's cook!
                </p>
              </div>
            </>
          ) : null}
          <div
            className={styles.chatWrapper}
            style={isHistoryEmpty ? {} : { flex: 1 }}
          >
            <ChatHistory history={history} />
          </div>
          <div>
            {isHistoryEmpty ? (
              <div className={styles.queryWrapper}>
                <SampleQuery
                  title="Easy recipes with chicken"
                  subtitle="Browser recipes"
                  onClick={() =>
                    addUserMessage("Can u give me easy meal idea with chicken")
                  }
                />
                <SampleQuery
                  title="Daily protein intake for men"
                  subtitle="Nutrition advice"
                  onClick={() =>
                    addUserMessage("What is the daily protein intake for men?")
                  }
                />
                <SampleQuery
                  title="How to cook a potato stew"
                  subtitle="Cooking assistance"
                  onClick={() =>
                    addUserMessage("Can u give me recipe for potato stew?")
                  }
                />
              </div>
            ) : null}
            <div className={styles.inputWrapper}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  e.key === "Enter" ? handleQuerySubmit() : null;
                }}
                type="text"
                placeholder="Send message to PantryPal"
              />
              <button onClick={handleQuerySubmit}>send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
