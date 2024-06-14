import React, { useEffect, useState } from "react";
import { Router, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import historyInstance from "./historyInstance";
import {
  MainPage,
  CreatePage,
  HomePage,
  HowItWorksPage,
  FaqPage,
  BuyPage,
  RefPage,
  StablePlusPage
} from "./pages";
import { Spinner } from "./components/Spinner/Spinner";
import { HashHandler } from "./components/HashHandler/HashHandler";
import { MainLayout } from "./components/MainLayout/MainLayout";
import i18 from './locale/index';
import { langs } from "components/SelectLanguage/SelectLanguage";
import { botCheck } from "utils/botCheck";
import { changeLanguage } from "store/actions/settings/changeLanguage";
import { updateData } from "store/actions/data/updateData";
import { getData } from "store/actions/data/getData";
import config from "config";
import { getDataError } from "store/actions/data/getDataError";
import { updateProvider } from "services/updateProvider/updateProvider";
import { getListForBot } from "store/actions/list/getListForBot";
import { changeCarburetor } from "store/actions/carburetor/changeCarburetor";

const AppRouter = () => {
  const [walletModalVisible, setWalletModalVisibility] = useState(false);
  const connected = useSelector((state) => state.connected);
  const { loaded } = useSelector((state) => state.list);
  const { loaded: loadedData } = useSelector((state) => state.data);
  const { lang, activeWallet } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    const pathname = window.location.pathname;
    const langList = langs.map((lang) => lang.name);
    const languageInUrl = langList.includes(pathname.split("/")[1]) ? pathname.split("/")[1] : null;
    let cleanedUrl = pathname;

    if (languageInUrl) {
      cleanedUrl = pathname.replace('/' + languageInUrl, "");
    }

    if (!lang) {
      const languageFromBrowserSettings = navigator.language.split("-")[0];
      const language = botCheck() ? languageInUrl : (languageInUrl || languageFromBrowserSettings);

      if (language && langList.find((lang) => lang === language)) { // if language is in the list
        dispatch(changeLanguage(language));

        if (language !== languageInUrl) {
          historyInstance.replace(`${language !== "en" ? '/' + language : ""}${cleanedUrl === "/" && language !== "en" ? "" : cleanedUrl}`);
        }
      } else {
        dispatch(changeLanguage("en"));
        historyInstance.replace(cleanedUrl);
      }
    } else {
      i18.changeLanguage(lang);

      if (lang !== languageInUrl) {
        historyInstance.replace(`${lang !== "en" ? '/' + lang : ""}${cleanedUrl === "/" ? "" : cleanedUrl}`);
      } else if (lang === "en" && languageInUrl === "en") {
        historyInstance.replace(cleanedUrl);
      }
    }
  }, [lang]);

  useEffect(() => {
    if (botCheck()) {
      dispatch(getListForBot());
    } else {
      const update = (states, balances) => {
        dispatch(updateData(states, balances));
      }

      const handleSnapshot = (states, balances) => {
        dispatch(getData(states, balances));
      }

      const onError = () => {
        dispatch(getDataError());
      }

      updateProvider({ address: config.UPCOMING_STATE_WS_URL, update, handleSnapshot, onError });
    }
  }, []);

  useEffect(() => {
    if (activeWallet && loadedData) {
      dispatch(changeCarburetor(activeWallet));
    }
  }, [dispatch, activeWallet, loadedData]);

  if ((!connected || !loaded) && !botCheck()) return <Spinner />;

  const langNames = langs.map((lang) => lang.name);
  const basename = `/:lang(${langNames.join("|")})?`;

  return (
    <Router history={historyInstance}>
      <MainLayout walletModalVisible={walletModalVisible} setWalletModalVisibility={setWalletModalVisibility} >
        <Route path={`${basename}/trade/:address?/:tab?`} render={() => <HashHandler><MainPage setWalletModalVisibility={setWalletModalVisibility} /></HashHandler>} />
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
        <Route path={basename + "/stableplus"} component={StablePlusPage} exact />
        <Route path={basename} component={HomePage} exact />
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
