import React from 'react';
import styles from './Legends.module.css';

export const Legends = ({ inUSD, symbol1, symbol2, legends, handleHideGrowth, handleHideInterest }) => {
	return (
		<div className={styles.wrap}>
			<div className={styles.legend} style={{ color: !legends.growth && '#cccccc' }} onClick={handleHideGrowth}>
				<span
					className={styles.rectangle}
					style={{ background: legends.growth ? 'rgba(0, 55, 255,1)' : '#cccccc' }}
				/>
				<span style={{ paddingLeft: 5 }}>{symbol1} price (in GBYTE)</span>
			</div>
			<div
				className={styles.legend}
				style={{ color: !legends.interest && '#cccccc' }}
				onClick={handleHideInterest}
			>
				<span className={styles.rectangle} style={{ background: legends.interest ? '#32D778' : '#cccccc' }} />
				<span className={styles.label}>
					{' '}
					{symbol2} price (in {inUSD ? 'USD' : 'GBYTE'})
				</span>
			</div>
		</div>
	);
};
