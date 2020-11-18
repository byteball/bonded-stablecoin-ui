import React from "react"
import { Button } from "antd";

import historyInstance from "historyInstance";

export const ButtonEditParams = ({ param, address }) => (
  <Button type="link" style={{ padding: 0, margin: 0, height: "auto" }} onClick={()=>{
    if(param){
      historyInstance.push(`/trade/${address}/governance#${param}`);
    }
  }}>(edit)</Button>
);