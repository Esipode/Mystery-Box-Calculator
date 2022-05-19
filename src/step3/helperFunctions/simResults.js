import React from 'react';

export default function SimResults({ item }) {
	return (
		<tr
			className={`simResults ${item.selected && item.count > 0 ? 'wanted' : ''}${item.count !== 0 &&
			!item.selected
				? 'unwanted'
				: ''}`}
		>
			<td>{item.name}</td>
			<td>{item.value}</td>
			<td className={item.rarity}>{item.chance ? item.chance + ' %' : item.rarity}</td>
			<td>
				<img src={item.image} alt={item.name} />
			</td>
			{!item.chance && <td>{item.count}</td>}
		</tr>
	);
}
