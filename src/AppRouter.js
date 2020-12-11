import React, { useEffect, useState } from "react";
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
  RefPage
} from "./pages";
import { Spinner } from "./components/Spinner/Spinner";
import { HashHandler } from "./components/HashHandler/HashHandler";
import { MainLayout } from "./components/MainLayout/MainLayout";
import i18 from './locale/index';

const AppRouter = () => {
  const [walletModalVisible, setWalletModalVisibility] = useState(false);
  const connected = useSelector((state) => state.connected);
  const { loaded } = useSelector((state) => state.list);
  const { lang } = useSelector((state) => state.settings);

  useEffect(() => {
    if (lang && loaded && connected) {
      i18.changeLanguage(lang);
    }
  }, [lang, loaded, connected]);

  if (!connected || !loaded) return <Spinner />;

  return (
    <Router history={historyInstance}>
      <MainLayout walletModalVisible={walletModalVisible} setWalletModalVisibility={setWalletModalVisibility} >
        <HashHandler>
          <Route path="/:lang(en|ru)?/trade/:address?/:tab?" render={() => <MainPage setWalletModalVisibility={setWalletModalVisibility} />} />
        </HashHandler>
        <Route path="/:lang(en|ru)?/create" component={CreatePage} />
        <Route path="/:lang(en|ru)?/how-it-works" component={HowItWorksPage} />
        <Route path="/:lang(en|ru)?/faq" component={FaqPage} />
        <Route path="/:lang(en|ru)?/referral" render={() => <RefPage setWalletModalVisibility={setWalletModalVisibility} />} />
        <Route path="/:lang(en|ru)?/referrals" render={() => <RefPage setWalletModalVisibility={setWalletModalVisibility} />} />
        <Route
          path="/:lang(en|ru)?/buy/:address?"
          render={() => {
            return <BuyPage />;
          }}
        />

        <Route path="/:lang(en|ru)?" component={HomePage} exact />
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
