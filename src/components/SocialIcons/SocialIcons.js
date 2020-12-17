import React from "react"
import { Typography } from "antd";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faWeixin, faTelegram, faMediumM, faRedditAlien, faBitcoin, faTwitter, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import ReactGA from "react-ga";
import { useSelector } from "react-redux";

const { Text } = Typography;

export const SocialIcons = ({size = "full", centered = false, gaLabel}) => { // type full or short
  const { t } = useTranslation();
  const { lang } = useSelector((state) => state.settings);

  const links = [
    {
      name: "discord",
      icon: faDiscord,
      link: "https://discord.obyte.org/"
    },
    {
      name: "telegram",
      icon: faTelegram,
      link: "https://t.me/obyteorg",
      link_ru: "https://t.me/obyte_ru"
    },
    {
      name: "weixin",
      icon: faWeixin,
      link: "https://mp.weixin.qq.com/s/JB0_MlK6w--D6pO5zPHAQQ"
    },
    {
      name: "twitter",
      icon: faTwitter,
      link: "https://twitter.com/ObyteOrg"
    },
    {
      name: "youtube",
      icon: faYoutube,
      link: "https://www.youtube.com/channel/UC59w9bmROOeUFakVvhMepPQ/"
    },
    {
      name: "medium",
      icon: faMediumM,
      link: "https://medium.com/obyte"
    },
    {
      name: "reddit",
      icon: faRedditAlien,
      link: "https://www.reddit.com/r/obyte/"
    },
    {
      name: "bitcoin",
      icon: faBitcoin,
      link: "https://bitcointalk.org/index.php?topic=1608859.0"
    },
    {
      name: "facebook",
      icon: faFacebook,
      link: "https://www.facebook.com/obyte.org"
    }
  ];

  const gaTracking = (name) => {
    ReactGA.event({
      category: "Social",
      action: "Click to " + name,
      label: gaLabel
    })
  }

  return (<div style={{ textAlign: "center", fontSize: 14 }}>
    {size === "full" && <div style={{ marginBottom: 10 }}><Text type="secondary">{t("footer.join_community", "Join the community, get help")}:</Text></div>}
    <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start", flexWrap: "wrap", alignItems: "center", fontSize: 18 }}>
      {(size === "full" ? links : links.slice(0,5)).map((social) => <a style={{ margin: "5px 10px", color: "#0037ff" }} key={"link-" + social.name} target="_blank" rel="noopener" href={(lang && social["link_" + lang]) || social.link} onClick={() => gaTracking(social.name)}><FontAwesomeIcon size="lg" icon={social.icon} /></a>)}
    </div>
  </div>)
}