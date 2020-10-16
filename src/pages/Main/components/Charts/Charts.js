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
  const { symbol1, symbol2, address } = useSelector((state) => state.active);
  const [width] = useWindowSize();
	const now = moment().format('YYYY-MM-DD');
  const chartRef = useRef(null);
	const reserveToken =
		params.reserve_asset === 'base'
			? 'GBYTE'
			: params.reserve_asset in config.reserves
				? config.reserves[params.reserve_asset].name
				: params.reserve_asset;
	const inUSD = reserveToken === 'GBYTE';
	const [lineSeriesGrowth, setLineSeriesGrowth] = useState(null);
	const [lineSeriesInterest, setLineSeriesInterest] = useState(null);
	const [chart, setChart] = useState(null);
	const [data, setData] = useState({ growth: [], interest: [], loaded: false });
	const [legends, setLegends] = useState({ growth: true, interest: true });
	useEffect(
		() => {
			if (chartRef.current && chart === null) {
				const chartInstance = createChart(chartRef.current, {
					timeScale: {
						tickMarkFormatter: (time) => moment.unix(time).format('DD/MM hh:mm')
					},
					localization: {
						timeFormatter: (time) => moment.unix(time).format('DD-MM-YYYY hh:mm')
					},
          height: 400,
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
					setLineSeriesInterest(
						chartInstance.addAreaSeries({
							priceScaleId: 'left',
							title: `${symbol2} price (in ${inUSD ? 'USD' : 'GBYTE'})`
						})
					);
					setLineSeriesGrowth(
						chartInstance.addAreaSeries({
              priceScaleId: 'right',
							lineColor: 'rgba(0, 55, 255,1)',
							bottomColor: 'rgba(0, 55, 255,0.04)',
							title: `${symbol1} price (in GBYTE)`
						})
					);
					setChart(chartInstance);
				}
			}
		},
		[chart]
	);
  
	useEffect(
		() => {
			let growth = [];
			let interest = [];
			(async () => {
				const dates = await axios
					.get('https://min-api.cryptocompare.com/data/v2/histoday?fsym=GBYTE&tsym=USD')
					.then((RateDate) => {
						const dateObject = {};
						RateDate.data.Data.Data.forEach((e) => {
							const time = moment.unix(e.time).format('DD-MM-YYYY');
							dateObject[time] = e.close;
						});
						return dateObject;
					});

				if (symbol1 && lineSeriesGrowth) {
					let growthData;
					try {
						growthData = await axios.get(
							`https://${config.STATS_URL}/candles/${symbol1}-${reserveToken}?period=hourly&start=2020-09-22&end=${now}`
						);
						growth = growthData.data.map((v) => ({
							value: v.close_price,
							time: moment.utc(v.start_timestamp).unix()
						}));
					} catch (e) {
						console.log('error: ', e);
					}
				}

				if (symbol2 && lineSeriesInterest) {
					let interestData;
					try {
						interestData = await axios.get(
							`https://${config.STATS_URL}/candles/${symbol2}-${reserveToken}?period=hourly&start=2020-09-22&end=${now}`
						);

						interest = interestData.data.map((v) => {
							const date = moment(v.start_timestamp).format('DD-MM-YYYY');
							return {
								value: inUSD ? Number(dates[date]) * Number(v.close_price) : Number(v.close_price),
								time: moment.utc(v.start_timestamp).unix()
							};
						});
					} catch (e) {
						console.log('error: ', e);
					}
				}
				if (lineSeriesGrowth) {
					lineSeriesGrowth.setData(growth);
					lineSeriesGrowth.applyOptions({
						title: `${symbol1} price (in GBYTE)`
					});
					chart.timeScale().fitContent();
				}
				if (lineSeriesInterest) {
					lineSeriesInterest.setData(interest);
					lineSeriesInterest.applyOptions({
						title: `${symbol2} price (in ${inUSD ? 'USD' : 'GBYTE'})`
					});
					chart.timeScale().fitContent();
				}

				if (lineSeriesGrowth && lineSeriesInterest) {
					setData({ interest, growth, loaded: true });
				}
			})();
		}, [address, lineSeriesGrowth]
	);

	const handleHideInterest = () => {
		if (legends.interest) {
			chart.removeSeries(lineSeriesInterest);
			setLegends((l) => ({ ...l, interest: false }));
		} else {
			const series = chart.addAreaSeries({
				priceScaleId: 'left',
				title: `${symbol2} price (in ${inUSD ? 'USD' : 'GBYTE'})`
			});
			series.setData(data.interest);
			setLineSeriesInterest(series);
			setLegends((l) => ({ ...l, interest: true }));
		}
	};

	const handleHideGrowth = () => {
		if (legends.growth) {
			chart.removeSeries(lineSeriesGrowth);
			setLegends((l) => ({ ...l, growth: false }));
		} else {
			const series = chart.addAreaSeries({
				priceScaleId: 'right',
				title: `${symbol1} price (in GBYTE)`,
				lineColor: 'rgba(0, 55, 255,1)',
				bottomColor: 'rgba(0, 55, 255,0.04)'
			});
			setLineSeriesGrowth(series);
			setLegends((l) => ({ ...l, growth: true }));
			series.setData(data.growth);
		}
  };

  useEffect(()=>{
    if(chart && chartRef.current){
      chart.resize(chartRef.current.clientWidth, 400);
      chart.timeScale().fitContent();
    }
  }, [width, chart])

	return (
		<div>
			<Title level={3}>Charts</Title>
			<Legends
				inUSD={inUSD}
				legends={legends}
				symbol1={symbol1}
				symbol2={symbol2}
				handleHideGrowth={handleHideGrowth}
				handleHideInterest={handleHideInterest}
			/>
			<div ref={chartRef} />
		</div>
	);
};
