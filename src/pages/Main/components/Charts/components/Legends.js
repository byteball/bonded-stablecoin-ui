import React from 'react';
import styles from './Legends.module.css';

export const Legends = ({ inUSD, symbol1, symbol2, legends, reserveToken, handleHideT1, handleHideT2 }) => {
	return (
		<div className={styles.wrap}>
			<div className={styles.legend} style={{ color: !legends.T1 && '#cccccc' }} onClick={handleHideT1}>
				<span
					className={styles.rectangle}
					style={{ background: legends.T1 ? 'rgba(0, 55, 255,1)' : '#cccccc' }}
				/>
				<span style={{ paddingLeft: 5 }}>{symbol1} price (in {reserveToken})</span>
			</div>
			<div
				className={styles.legend}
				style={{ color: !legends.T2 && '#cccccc' }}
				onClick={handleHideT2}
			>
				<span className={styles.rectangle} style={{ background: legends.T2 ? '#32D778' : '#cccccc' }} />
				<span className={styles.label}>
					{' '}
					{symbol2} price (in {inUSD ? 'USD' : reserveToken})
				</span>
			</div>
		</div>
	);
};
