import React, { useState } from "react";
import { Router, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import historyInstance from "./historyInstance";
import {
  MainPage,
  CreatePage,
  HomePage,
  HowItWorksPage,
  FaqPage,
  BuyPage,
  RefPage,
} from "./pages";
import { Spinner } from "./components/Spinner/Spinner";
import { HashHandler } from "./components/HashHandler/HashHandler";
import { MainLayout } from "./components/MainLayout/MainLayout";

const AppRouter = () => {
  const connected = useSelector((state) => state.connected);
  const { loaded } = useSelector((state) => state.list);
  const [vWalletModal, setVWalletModal] = useState(false);
  
  if (!connected || !loaded) return <Spinner />;

  return (
    <Router history={historyInstance}>
      <MainLayout vWalletModal={vWalletModal} setVWalletModal={setVWalletModal} >
        <HashHandler>
          <Route path="/trade:address?" render={() => <MainPage setVWalletModal={setVWalletModal} />} />
        </HashHandler>
        <Route path="/create" component={CreatePage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/referral" render={() => <RefPage setVWalletModal={setVWalletModal} />}/>
        <Route
          path="/buy/:address?"
          render={() => {
            return <BuyPage />;
          }}
        />
        <Route path="/" component={HomePage} exact />
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
