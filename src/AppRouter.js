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
  RefPage
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

const AppRouter = () => {
  const [walletModalVisible, setWalletModalVisibility] = useState(false);
  const connected = useSelector((state) => state.connected);
  const { loaded } = useSelector((state) => state.list);
  const { lang } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(!lang){
      const language = navigator.language.split("-")[0];
      if(language && langs.find((lang) => lang.name === language)){
        dispatch(changeLanguage(language));
      } else {
        dispatch(changeLanguage("en"));
      }
    } else {
      i18.changeLanguage(lang);
    }
  }, [lang]);

  useEffect(()=>{
    const update = (data) => {
      dispatch(updateData(data));
    }
    
    const getSnapshot = (data) => {
      dispatch(getData(data));
    }
    
    const onError = () => {
      dispatch(getDataError());
    }
    
    updateProvider({ address: config.UPCOMING_STATE_WS_URL, update, getSnapshot, onError });
  }, []);

  if ((!connected || !loaded) && !botCheck(navigator.userAgent)) return <Spinner />;

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

        <Route path={basename} component={HomePage} exact />
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
