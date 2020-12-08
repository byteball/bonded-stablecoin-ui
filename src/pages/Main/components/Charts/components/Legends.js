import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Legends.module.css';

export const Legends = ({ inUSD, symbol1, symbol2, legends, reserveToken, handleHideT1, handleHideT2 }) => {
  const { t } = useTranslation();
  return (
		<div className={styles.wrap}>
			<div className={styles.legend} style={{ color: !legends.T1 && '#cccccc' }} onClick={handleHideT1}>
				<span
					className={styles.rectangle}
					style={{ background: legends.T1 ? 'rgba(0, 55, 255,1)' : '#cccccc' }}
				/>
				<span style={{ paddingLeft: 5 }}>{t("trade.tabs.charts.legend", "{{symbol}} price (in {{currency}})", {symbol: symbol1 || "T1", currency: reserveToken})}</span>
			</div>
			<div
				className={styles.legend}
				style={{ color: !legends.T2 && '#cccccc' }}
				onClick={handleHideT2}
			>
				<span className={styles.rectangle} style={{ background: legends.T2 ? '#32D778' : '#cccccc' }} />
				<span className={styles.label}>
					{' '}
          		{t("trade.tabs.charts.legend", "{{symbol}} price (in {{currency}})", {symbol: symbol2 || "T2", currency: inUSD ? 'USD' : reserveToken})}
				</span>
			</div>
		</div>
	);
};
