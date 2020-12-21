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
    `${config.BUFFER_URL}/create_buffer?address=${recipient.value}&curve_aa=${curve_address}`
  );
  const { buffer_address } = data.data;
  const provider = config.oswapccCurrencies.includes(currency_from.toUpperCase()) ? "oswapcc" : "simpleswap";
  let create;
  if (provider === "simpleswap") {
    create = await axios.post(
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
  }
  else if (provider === "oswapcc") {
    create = await axios.post(
      `${config.oswapccRoot}/create_swap`,
      {
        out_coin: "GBYTE",
        in_coin: currency_from.toUpperCase(),
        in_amount: parseFloat(amount_currency),
        out_address: buffer_address,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
    if (create && create.data && create.data.data) {
      create.data.id = create.data.data.swap_id;
      create.data.address_from = create.data.data.in_address;
      create.data.amount_to = create.data.data.expected_out_amount;
    }
  }

  if (create && create.data) {
    const isError = await axios
      .post(
        `${config.BUFFER_URL}/create_order`,
        {
          provider,
          provider_id: create.data.id,
          buffer_address,
          currency_in: currency_from,
          expected_amount_out: create.data.amount_to,
          amount_in: Number(amount_currency),
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
          provider,
        })
      );
      store.dispatch(addExchangePending(create.data.id));
    }

    after && after({ isError });
  } else {
    after && after({ isError: true });
  }
};
