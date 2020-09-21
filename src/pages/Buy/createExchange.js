import { store } from "index";
import axios from "axios";
import config from "config";

import { addExchange } from "store/actions/settings/addExchange";
import { addExchangePending } from "store/actions/settings/addExchangePending";

export const createExchange = async ({
  address,
  asset,
  symbol,
  amount_currency,
  amount_token,
  after,
  currency_from,
  recipient,
  curve_address,
}) => {
  const { data } = await axios.get(
    `https://${config.TESTNET ? "testnet." : ""}${
      config.BUFFER_URL
    }/create_buffer?address=${recipient.value}&curve_aa=${curve_address}`
  );
  const { buffer_address } = data.data;
  const create = await axios.post(
    `https://api.simpleswap.io/v1/create_exchange?api_key=${config.SIMPLESWAP_API_KEY}`,
    {
      currency_to: "gbyte",
      currency_from,
      amount: amount_currency,
      address_to: buffer_address,
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  if (create && create.data) {
    const isError = await axios
      .post(
        `https://${config.TESTNET ? "testnet." : ""}${
          config.BUFFER_URL
        }/create_order`,
        {
          provider: "simpleswap",
          provider_id: create.data.id,
          buffer_address,
          currency_in: create.data.currency_from,
          expected_amount_out: create.data.amount_to,
          amount_in: Number(create.data.amount_from),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => false)
      .catch(() => {
        return true;
      });
    if (!isError) {
      store.dispatch(
        addExchange({
          buffer_address,
          id: create.data.id,
          currency_from,
          address,
          address_from: create.data.address_from,
          asset,
          symbol,
          amount_currency,
          amount_token,
        })
      );
      store.dispatch(addExchangePending(create.data.id));
    }

    after && after({ isError });
  } else {
    after && after({ isError: true });
  }
};
