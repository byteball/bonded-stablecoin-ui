import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";

import { Header } from "./components/Header/Header";
import { Tokens } from "./components/Tokens/Tokens";
import { Reasons } from "./components/Reasons/Reasons";
import { Footer } from "./components/Footer/Footer";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const [type, setType] = useState("USD");
  const [shownReasons, setShownReasons] = useState(false);
  
  useEffect(() => {
    document.title = "Bonded stablecoins";
  }, []);

  return (
    <div className={styles.container}>
      <Header setType={setType} type={type} />
      <Tokens />
      <Reasons onEnterViewport={() => {
        if(!shownReasons){
          setShownReasons(true);
          ReactGA.event({
            category: "Stablecoin",
            action: "Show reasons"
          })
        }
      }} />
      <Footer />
    </div>
  );
};
