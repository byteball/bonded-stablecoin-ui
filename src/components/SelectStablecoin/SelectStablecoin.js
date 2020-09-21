import React from "react";
import { Select, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeActive } from "store/actions/active/changeActive";
import { Decimal } from "decimal.js";

const { OptGroup } = Select;

export const SelectStablecoin = () => {
  const { data, loading } = useSelector((state) => state.list);
  const activeAddress = useSelector((state) => state.active.address);
  const { recentList } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const optionList = [];

  for (const stable in data) {
    const { feed_name, interest_rate } = data[stable].params;
    const { asset_2, symbol } = data[stable];
    const interest_rate_percent = Decimal.mul(interest_rate, 100).toNumber();
    if (!recentList.includes(stable)) {
      optionList.push(
        <Select.Option value={stable} key={stable}>
          {feed_name} {String(interest_rate_percent)}% : {symbol || asset_2} (
          {stable})
        </Select.Option>
      );
    }
  }

  const optionListRecent = recentList.map((adr) => {
    const { feed_name, interest_rate } = data[adr].params;
    const { asset_2, symbol } = data[adr];
    const interest_rate_percent = Decimal.mul(interest_rate, 100).toNumber();
    return (
      <Select.Option value={adr} key={adr}>
        {feed_name} {String(interest_rate_percent)}% : {symbol || asset_2} (
        {adr})
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
          placeholder="Please, select stablecoin"
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
