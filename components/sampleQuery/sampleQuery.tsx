import React from "react";
import styles from "./sampleQuery.module.css";

interface SampleQueryProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
}
export function SampleQuery({ title, subtitle, onClick }: SampleQueryProps) {
  return (
    <button className={styles.wrapper} onClick={onClick}>
      <div className={styles.logo}></div>
      <h5>{title}</h5>
      <p>{subtitle}</p>
    </button>
  );
}
