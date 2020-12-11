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
import { langs } from "components/SelectLanguage/SelectLanguage";

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

  const langNames = langs.map((lang) => lang.name)
  const basename = `/:lang(${langNames.join("|")})?`;

  return (
    <Router history={historyInstance}>
      <MainLayout walletModalVisible={walletModalVisible} setWalletModalVisibility={setWalletModalVisibility} >
        <HashHandler>
          <Route path={`${basename}/trade/:address?/:tab?`} render={() => <MainPage setWalletModalVisibility={setWalletModalVisibility} />} />
        </HashHandler>
        <Route path={`${basename}/create`} component={CreatePage} />
        <Route path={`${basename}/how-it-works`} component={HowItWorksPage} />
        <Route path={`${basename}/faq`} component={FaqPage} />
        <Route path={`${basename}/referral`} render={() => <RefPage setWalletModalVisibility={setWalletModalVisibility} />} />
        <Route path={`${basename}/referrals`} render={() => <RefPage setWalletModalVisibility={setWalletModalVisibility} />} />
        <Route
          path={`${basename}/buy/:address?`}
          render={() => {
            return <BuyPage />;
          }}
        />

        <Route path={basename} component={HomePage} exact />
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
