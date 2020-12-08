import React from "react";
import { Select } from "antd";
import Flag from 'react-world-flags';
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "store/actions/settings/changeLanguage";

export const SelectLanguage = () => {
  const { lang } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  
  return (
    <Select size="large" style={{ width: "100%"}} dropdownStyle={{ margin: 20 }} bordered={false} value={lang || "usa"} size="large" onChange={(value) => { dispatch(changeLanguage(value)) }}>
      <Select.Option style={{ paddingLeft: 20, paddingRight: 20 }} value="ru"><div><Flag code="ru" style={{ border: "1px solid #ddd" }} width="30" /></div></Select.Option>
      <Select.Option style={{ paddingLeft: 20, paddingRight: 20 }} value="usa"><div><Flag code="usa" style={{ border: "1px solid #ddd" }} width="30" /></div></Select.Option>
    </Select>
  )
    
  
}