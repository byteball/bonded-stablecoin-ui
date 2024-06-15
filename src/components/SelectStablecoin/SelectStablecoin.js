import React from "react";
import { Select, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { changeActive } from "store/actions/active/changeActive";
import { Decimal } from "decimal.js";
import CoinIcon from "stablecoin-icons";
import config from "config";
import { toPairs } from "lodash";
import { botCheck } from "utils/botCheck";
import { changeActiveForBot } from "store/actions/active/changeActiveForBot";

const { OptGroup } = Select;

export const SelectStablecoin = () => {
  const { data, loading, loaded } = useSelector((state) => state.list);
  const activeAddress = useSelector((state) => state.active.address);
  const { recentList } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const optionList = [];

  const dataList = toPairs(data).sort(([_, a_info], [__, b_info]) => (b_info.bonded_state?.reserve || 0) - (a_info.bonded_state?.reserve || 0)).sort(([_, a_info], [__, b_info]) => {
    if ((a_info.fund && b_info.fund) || (!a_info.fund && !b_info.fund)) {
      return 0
    } else if (a_info.fund && (!b_info.fund)) {
      return -1
    } else if (!(a_info.fund) && b_info.fund) {
      return 1
    }
    return 0
  })

  dataList.forEach(([aa, info]) => {
    if (aa === 'PU5YFREC4OBEYADLOHMBEEA4CI2Z5AKA') // broken AA
      return;
    const { asset_2, symbol, params, bonded_state, fund } = info;
    const targetCurrency = getTargetCurrency(params, bonded_state);
    const interest_rate_percent = bonded_state ? Decimal.mul(bonded_state.interest_rate, 100).toNumber() : null;
    if (!recentList.includes(aa)) {
      optionList.push(
        <Select.Option value={aa} key={aa}>
          <CoinIcon width="1em" style={{ marginRight: 10 }} height="1em" type={2} pegged={targetCurrency} />
          {fund ? "v2" : "v1"} - {targetCurrency}{interest_rate_percent ? ` ${interest_rate_percent}% interest` : ''} : {symbol || asset_2} (
          {aa})
        </Select.Option>
      );
    }
  })

  const optionListRecent = loaded && recentList.filter(aa => data[aa]).map((aa) => {
    const { asset_2, symbol, params, bonded_state, fund } = data[aa];
    const targetCurrency = getTargetCurrency(params, bonded_state);
    const interest_rate_percent = bonded_state ? Decimal.mul(bonded_state.interest_rate, 100).toNumber() : null;
    return (
      <Select.Option value={aa} key={aa}>
        <CoinIcon width="1em" height="1em" style={{ marginRight: 10 }} type={2} pegged={targetCurrency} />
        {fund ? "v2" : "v1"} - {targetCurrency}{interest_rate_percent ? ` ${interest_rate_percent}% interest` : ''} : {symbol || asset_2} (
        {aa})
      </Select.Option>
    );
  });

  return (
    <div
      style={{
        background: "#fff",
        padding: 10,
        marginBottom: 20,
      }}
    >
      <Row>
        <Select
          size="large"
          optionFilterProp="children"
          placeholder={t("select_stablecoin.placeholder", "Please select a stablecoin")}
          style={{ width: "100%" }}
          showSearch={true}
          value={activeAddress || undefined}
          loading={loading}
          onChange={(address) => {
            if (botCheck()) {
              dispatch(changeActiveForBot(address));
            } else {
              dispatch(changeActive(address));
            }
          }}
        >
          {optionListRecent.length > 0 && (
            <OptGroup label={t("select_stablecoin.recent", "Recent")}>{optionListRecent}</OptGroup>
          )}
          {optionList.length > 0 && (
            <OptGroup label={optionListRecent.length > 0 ? t("select_stablecoin.other", "Other") : t("select_stablecoin.all", "All")}>
              {optionList}
            </OptGroup>
          )}
        </Select>
      </Row>
    </div>
  );
};

export const getLastFeedName = (params, bonded_state) => {
  if (bonded_state && ("oracles" in bonded_state))
    return bonded_state.oracles.length ? bonded_state.oracles[bonded_state.oracles.length - 1].feed_name : null;
  else
    return params.feed_name3 || params.feed_name2 || params.feed_name1;
};

// heuristics to determine the target currency/asset/index. It might fail.
export const getTargetCurrency = (params, bonded_state) => {
  let feed_name = getLastFeedName(params, bonded_state);
  if (!feed_name)
    return config.reserves[params.reserve_asset]
      ? config.reserves[params.reserve_asset].name
      : 'GBYTE';
  if (params.leverage) {
    if (feed_name.includes('GBYTE') || feed_name.includes('USD'))
      feed_name = feed_name.replace('_', '/');
    return `${feed_name} ${params.leverage}x leverage`;
  }
  if (feed_name.startsWith('GBYTE_'))
    return feed_name.replace('GBYTE_', '');
  if (feed_name.endsWith('_USD'))
    return feed_name.replace('_USD', '');
  if (feed_name.endsWith('_BTC'))
    return feed_name.replace('_BTC', '');
  return feed_name;
}