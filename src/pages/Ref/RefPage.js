import React, { useEffect, useState } from "react";
import { Col, Row, Typography, message, Table, Space } from "antd";
import { useSelector } from "react-redux"
import { FacebookShareButton, FacebookIcon, VKShareButton, VKIcon, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon } from "react-share";
import RefImage from "./img/ref.svg";
import config from "config";
import axios from "axios";
import styles from "./RefPage.module.css";

const { Title, Paragraph, Text } = Typography;

const columns = [
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    ellipsis: {
      showTitle: true,
    },
  },
  {
    title: "USD balance",
    dataIndex: "usd_balance",
    key: "usd_balance",
    render: (value) => {
      return Number(value).toFixed(2) || <span>&mdash;</span>
    }
  }
];

export const RefPage = ({ setWalletModalVisibility }) => {
  const { activeWallet } = useSelector(state => state.settings);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const refUrl = `https://${config.TESTNET ? "testnet." : ""}ostable.org?r=${activeWallet}`;
  const appInfo = {
    url: refUrl,
    title: "Obyte bonded stablecoins",
    hashtag: "#obyte"
  }
  useEffect(() => {
    (async () => {
      const infoData = await axios.get(`${config.REFERRAL_URL}/referrals/${activeWallet}`).catch((e) => {
        console.log("e", e)
      });

      if ("error" in infoData) return setLoading(false);

      if (infoData) {
        const info = { ...infoData.data.data };
        const total = info && info.referrals && info.referrals.reduce((acc, value) => acc + value.usd_balance, 0);
        info.total = Number(total).toFixed(2);
        setLoading(false);
        setInfo(info);
      }

    })();
  }, [activeWallet]);

  return <>
    <Title level={1} style={{ marginBottom: 30 }}>Referral program</Title>
    <Row style={{ fontSize: 18 }}>
      <Col xl={{ offset: 1, span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
        <img className={styles.image} src={RefImage} alt="Referral program" />
        {activeWallet && info && !loading && <Paragraph className={styles.myInfo}>
          The next payment is on {info.distribution_date}.
          {"my_info" in info && <div>Your expected reward is {Number(info.my_info.usd_reward).toFixed(2)} IUSD.
          {info.referrer_address && `You were referred by ${info.my_info.referrer_address} and this includes a reward for your own balance ${info.my_info.usd_balance}.`}</div>}
        </Paragraph>}
      </Col>
      <Col xl={{ offset: 1, span: 14 }} sm={{ span: 24 }} xs={{ span: 24 }}>
        {activeWallet ? <div>
          This is your referral link:
          <div>
            <div className={styles.urlWrap}>
              <Text copyable={{ onCopy: () => message.success('Your link was copied to the clipboard') }}>{refUrl}</Text>
            </div>
          </div>
        </div> : <div className={styles.urlWrap_empty}>To get a referral link, <span onClick={setWalletModalVisibility} className={styles.addWallet}>add your wallet address</span></div>}
        <div className={styles.info}>
          <Paragraph>
            Use it in your blogs, tweets, posts, newsletters, public profiles, videos, etc and earn referral rewards for bringing new holders into Bonded Stablecoins.
          </Paragraph>
          {activeWallet && <Paragraph>
            <Space style={{ justifyContent: "center", width: "100%" }}>
              <FacebookShareButton {...appInfo}>
                <FacebookIcon size={36} />
              </FacebookShareButton>
              <VKShareButton {...appInfo}>
                <VKIcon size={36} />
              </VKShareButton>
              <TwitterShareButton {...appInfo}>
                <TwitterIcon size={36} />
              </TwitterShareButton>
              <TelegramShareButton {...appInfo}>
                <TelegramIcon size={36} />
              </TelegramShareButton>
            </Space>
          </Paragraph>}
          <Paragraph>
            The referral rewards are paid in IUSD every Sunday and are proportional to dollar balances of the referred
            users in all tokens (stablecoins, interest tokens, growth tokens) issued on this website, as well as other
            tokens based on them: shares in <a target="_blank" rel="noopener" href="https://oswap.io/">oswap</a> liquidity pools and shares in arbitrage bots.
            The larger the total balances at the end of the weekly period, the larger the reward. Your weekly reward increases if the referred users accumulate more, decreases if they redeem or sell their tokens.
          </Paragraph>
          <Paragraph>
            The initial weekly reward is 10% of the balances of all referred users at the end of the period.
          </Paragraph>
          <Paragraph>
            Your referrals also get rewarded for buying tokens through your link &mdash; they get 5% of their balances every week.
          </Paragraph>
          <Paragraph>
            The total amount paid to all referrers and referred users is capped by $3,000 weekly. If the cap gets exceeded,
            all 10%/5% rewards are scaled down proportionally so that the total is $3,000.
          </Paragraph>
          {activeWallet && <Paragraph>
            Here is the list of your referrals and their current balances:
          </Paragraph>}
        </div>
      </Col>
    </Row>

    {activeWallet && <Table
      loading={loading}
      columns={columns}
      footer={() => info && info.total && <div style={{ display: "flex", justifyContent: "flex-end" }} ><b>Total: {info.total} IUSD</b></div>}
      dataSource={((info && info.referrals) || []).map((r) => ({ ...r, key: r.address }))}
      locale={{
        emptyText: "no referrals yet",
      }}
      pagination={{ pageSize: 20, hideOnSinglePage: true }}
    />}

  </>
}