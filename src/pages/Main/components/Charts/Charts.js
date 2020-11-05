import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { createChart } from 'lightweight-charts';
import { Typography } from 'antd';

import { Legends } from './components/Legends';
import config from 'config';
import { useWindowSize } from 'hooks/useWindowSize';

const { Title } = Typography;

export const Charts = ({ params }) => {
  const { symbol1, symbol2, address, reserve_asset_symbol } = useSelector((state) => state.active);
  const [width] = useWindowSize();
  const now = moment().format('YYYY-MM-DD');
  const chartRef = useRef(null);
  const reserveToken =
    params.reserve_asset === 'base'
      ? 'GBYTE'
      : params.reserve_asset in config.reserves
        ? config.reserves[params.reserve_asset].name
        : reserve_asset_symbol || params.reserve_asset;
  const inUSD = reserveToken === 'GBYTE';
  const [lineSeriesT1, setLineSeriesT1] = useState(null);
  const [lineSeriesT2, setLineSeriesT2] = useState(null);
  const [chart, setChart] = useState(null);
  const [data, setData] = useState({ T1: [], T2: [], loaded: false });
  const [legends, setLegends] = useState({ T1: true, T2: true });
  useEffect(
    () => {
      if (chartRef.current && chart === null) {
        const chartInstance = createChart(chartRef.current, {
          timeScale: {
            tickMarkFormatter: (time) => moment.unix(time).format('DD/MM HH:mm')
          },
          localization: {
            timeFormatter: (time) => moment.unix(time).format('DD-MM-YYYY HH:mm')
          },
          height: width > 640 ? 400 : 250,
          rightPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)'
          },
          leftPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)'
          }
        });
        if (chartInstance && chart === null) {
          setLineSeriesT2(
            chartInstance.addAreaSeries({
              priceScaleId: 'left',
              title: `${symbol2} price (in ${inUSD ? 'USD' : reserveToken})`
            })
          );
          setLineSeriesT1(
            chartInstance.addAreaSeries({
              priceScaleId: 'right',
              lineColor: 'rgba(0, 55, 255, 1)',
              bottomColor: 'rgba(0, 55, 255, 0.04)',
              title: `${symbol1} price (in ${reserveToken})`
            })
          );
          setChart(chartInstance);
        }
      }
    },
    [chart]
  );

  const getCandle = async ({ type, from, to }) => {
    let T1 = [], T2 = [], rateUSD = [];
    if (inUSD) {
      if (type === "daily") {
        rateUSD = await axios
          .get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=GBYTE&tsym=USD&toTs=${moment().unix()}&limit=2000`)
          .then((RateDate) => {
            const dateObject = {};
            RateDate.data.Data.Data.forEach((e) => {
              const time = moment.unix(e.time).format('DD-MM-YYYY');
              dateObject[time] = e.open;
            });
            return dateObject;
          });
      } else if (type === "hourly") {
        rateUSD = await axios
          .get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=GBYTE&tsym=USD&toTs=${moment().unix()}&limit=2000`)
          .then((RateDate) => {
            const dateObject = {};
            RateDate.data.Data.Data.forEach((e) => {
              const time = moment.unix(e.time).format('DD-MM-YYYY HH');
              dateObject[time] = e.open;
            });
            return dateObject;
          });
      }
    }

    if (symbol1) {
      let T1Data;
      try {
        T1Data = await axios.get(
          `${config.STATS_URL}/candles/${symbol1}-${reserveToken}?period=${type}&start=${from}&end=${to}`
        );
        T1 = T1Data.data.map((v) => ({
          value: v.open_price,
          time: moment.utc(v.start_timestamp).unix()
        }));
      } catch (e) {
        console.log('error: ', e);
      }
    }

    if (symbol2) {
      let T2Data;
      try {
        T2Data = await axios.get(
          `${config.STATS_URL}/candles/${symbol2}-${reserveToken}?period=${type}&start=${from}&end=${now}`
        );
        const format = type === "daily" ? 'DD-MM-YYYY' : 'DD-MM-YYYY HH';
        T2 = T2Data.data.map((v) => {
          const date = moment(v.start_timestamp).format(format);
          return {
            value: inUSD ? Number(rateUSD[date]) * Number(v.open_price) : Number(v.open_price),
            time: moment.utc(v.start_timestamp).unix()
          };
        });
      } catch (e) {
        console.log('error: ', e);
      }
    }
    return { T1, T2 }
  }

  useEffect(
    () => {
      (async () => {
        if (address && lineSeriesT1 && lineSeriesT2) {
          const candleDaily = await getCandle({ type: "daily", from: "2020-09-22", to: now });
          if (!candleDaily.T1.length || !candleDaily.T2.length) return;
          if (candleDaily.T1.length > 83 || candleDaily.T2.length > 83) {
            if (lineSeriesT1) {
              lineSeriesT1.setData(candleDaily.T1);
              lineSeriesT1.applyOptions({
                title: `${symbol1} price (in ${reserveToken})`
              });
            }
            if (lineSeriesT2) {
              lineSeriesT2.setData(candleDaily.T2);
              lineSeriesT2.applyOptions({
                title: `${symbol2} price (in ${inUSD ? 'USD' : reserveToken})`
              });
            }

            if (lineSeriesT1 && lineSeriesT2) {
              setData({ T2: candleDaily.T2, T1: candleDaily.T1, loaded: true });
            }
          } else {
            const firstTimeCandle = moment.unix(candleDaily.T1[0].time).format("YYYY-MM-DD");
            const candleHourly = await getCandle({ type: "hourly", from: firstTimeCandle, to: now });
            if (lineSeriesT1) {
              lineSeriesT1.setData(candleHourly.T1);
              lineSeriesT1.applyOptions({
                title: `${symbol1} price (in ${reserveToken})`
              });
            }
            if (lineSeriesT2) {
              lineSeriesT2.setData(candleHourly.T2);
              lineSeriesT2.applyOptions({
                title: `${symbol2} price (in ${inUSD ? 'USD' : reserveToken})`
              });
            }
            if (lineSeriesT1 && lineSeriesT2) {
              setData({ T2: candleHourly.T2, T1: candleHourly.T1, loaded: true });
            }
          }
          chart.timeScale().fitContent();
        }
      })();
    }, [address, lineSeriesT1, lineSeriesT2]
  );

  const handleHideT2 = () => {
    if (legends.T2) {
      chart.removeSeries(lineSeriesT2);
      setLegends((l) => ({ ...l, T2: false }));
    } else {
      const series = chart.addAreaSeries({
        priceScaleId: 'left',
        title: `${symbol2} price (in ${inUSD ? 'USD' : reserveToken})`
      });
      series.setData(data.T2);
      setLineSeriesT2(series);
      setLegends((l) => ({ ...l, T2: true }));
    }
  };

  const handleHideT1 = () => {
    if (legends.T1) {
      chart.removeSeries(lineSeriesT1);
      setLegends((l) => ({ ...l, T1: false }));
    } else {
      const series = chart.addAreaSeries({
        priceScaleId: 'right',
        title: `${symbol1} price (in ${reserveToken})`,
        lineColor: 'rgba(0, 55, 255,1)',
        bottomColor: 'rgba(0, 55, 255,0.04)'
      });
      setLineSeriesT1(series);
      setLegends((l) => ({ ...l, T1: true }));
      series.setData(data.T1);
    }
  };

  useEffect(() => {
    if (chart && chartRef.current) {
      chart.resize(chartRef.current.clientWidth, width > 640 ? 400 : 250);
      chart.timeScale().fitContent();
    }
  }, [width, chart]);

  return (
    <div>
      <Title level={3}>Charts</Title>
      <Legends
        inUSD={inUSD}
        legends={legends}
        reserveToken={reserveToken}
        symbol1={symbol1}
        symbol2={symbol2}
        handleHideT1={handleHideT1}
        handleHideT2={handleHideT2}
      />
      <div style={width <= 640 ? {paddingLeft: 10, paddingRight: 10, boxSizing: "border-box"} : {}}>
        <div ref={chartRef} />
      </div>
    </div>
  );
};
