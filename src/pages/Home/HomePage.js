import React, { useState, useEffect } from "react";

import { Header } from "./components/Header/Header";
import { Tokens } from "./components/Tokens/Tokens";
import { Reasons } from "./components/Reasons/Reasons";
import { Footer } from "./components/Footer/Footer";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const [type, setType] = useState("USD");
  useEffect(() => {
    document.title = "Bonded stablecoins";
  }, []);

  return (
    <div className={styles.container}>
      <Header setType={setType} type={type} />
      <Tokens />
      <Reasons />
      <Footer />
    </div>
  );
};
