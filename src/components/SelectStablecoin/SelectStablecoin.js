import React from "react";
import { Select, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeActive } from "store/actions/active/changeActive";
import { Decimal } from "decimal.js";
import config from "config";

const { OptGroup } = Select;

export const SelectStablecoin = () => {
  const { data, loading } = useSelector((state) => state.list);
  const activeAddress = useSelector((state) => state.active.address);
  const { recentList } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const getLastFeedName = (params, stable_state) => {
    if (stable_state && ("oracles" in stable_state))
      return stable_state.oracles.length ? stable_state.oracles[stable_state.oracles.length - 1].feed_name : null;
    else
      return params.feed_name3 || params.feed_name2 || params.feed_name1;
  };

  // heuristics to determine the target currency/asset/index. It might fail.
  const getTargetCurrency = (params, stable_state) => {
    let feed_name = getLastFeedName(params, stable_state);
    if (!feed_name)
      return 'GBYTE';
    if (params.leverage) {
      if (feed_name.includes('GBYTE') || feed_name.includes('USD'))
        feed_name = feed_name.replace('_', '/');
      return `${feed_name} ${params.leverage}x leverage`;
    }
    if (feed_name.startsWith('GBYTE_'))
      return feed_name.replace('GBYTE_', '');
    if (feed_name.endsWith('_USD'))
      return feed_name.replace('_USD', '');
    return feed_name;
  }

  const optionList = [];

  for (const aa in data) {
    const { asset_2, symbol, params, stable_state } = data[aa];
    const targetCurrency = getTargetCurrency(params, stable_state);
    const interest_rate_percent = stable_state ? Decimal.mul(stable_state.interest_rate, 100).toNumber() : null;
    if (!recentList.includes(aa)) {
      optionList.push(
        <Select.Option value={aa} key={aa}>
          {targetCurrency}{interest_rate_percent ? ` ${interest_rate_percent}% interest` : ''} : {symbol || asset_2} (
          {aa})
        </Select.Option>
      );
    }
  }

  const optionListRecent = recentList.filter(aa => data[aa]).map((aa) => {
    const { asset_2, symbol, params, stable_state } = data[aa];
    const targetCurrency = getTargetCurrency(params, stable_state);
    const interest_rate_percent = stable_state ? Decimal.mul(stable_state.interest_rate, 100).toNumber() : null;
    return (
      <Select.Option value={aa} key={aa}>
        {targetCurrency}{interest_rate_percent ? ` ${interest_rate_percent}% interest` : ''} : {symbol || asset_2} (
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
          placeholder="Please select a stablecoin"
          style={{ width: "100%" }}
          showSearch={true}
          value={activeAddress || undefined}
          loading={loading}
          onChange={(address) => {
            dispatch(changeActive(address));
          }}
        >
          {optionListRecent.length > 0 && (
            <OptGroup label="Recent">{optionListRecent}</OptGroup>
          )}
          {optionList.length > 0 && (
            <OptGroup label={optionListRecent.length > 0 ? "Other" : "All"}>
              {optionList}
            </OptGroup>
          )}
        </Select>
      </Row>
    </div>
  );
};
