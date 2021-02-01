import React from 'react';

export default function Stat({stat}) {

	const calcPercentage = (total) => {
		let percentage = ((total / stat.count) * 100).toFixed(0);
		return isNaN(percentage) ? 0 : percentage;
	}

	return (
		<tr className={`stat ${stat.rarity}`}>
			<td>{stat.name}</td>
			<td>{stat.count}</td>
			<td>
				<span className="wanted">
					{calcPercentage(stat.wanted)}%
				</span>
				/ 
				<span className="unwanted">
					{calcPercentage(stat.unwanted)}%
				</span>
			</td>
		</tr>
	);
}