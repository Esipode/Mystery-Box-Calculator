import React, {useState} from 'react';

export default function MTX({modifyMTXItem, item}) {

	const [active, setActive] = useState(false);

	const onAddRemoveMTX = () => {
		let toggleActive  = !active;
		setActive(toggleActive);
		modifyMTXItem(item, toggleActive);
	};

	return (
		<tr className={`mtx ${active ? 'active' : 'inactive'}`} onClick={() => onAddRemoveMTX()}>
				<td>{item.name}</td>
				<td>{item.value}</td>
				<td className={item.rarity}>{item.rarity}</td>
				<td><img src={item.image} alt={item.name} /></td>
		</tr>
	);

}