import React from 'react';

export default function SimResults({item}) {

	return (
		<tr className={`simResults ${item.selected && item.count > 0 ? 'wanted' : ''}${item.count !== 0 && !item.selected ? 'unwanted' : ''}`}>
			<td>{item.name}</td>
			<td>{item.value}</td>
			<td className={item.rarity}>{item.rarity}</td>
			<td><img src={item.image} alt={item.name} /></td>
			<td>{item.count}</td>
		</tr>
	);
}