import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveMTX, setStepThree } from '../actions';

export default function MTX({ item }) {
	const dispatch = useDispatch();
	const activeMTX = useSelector((state) => state.activeMTX);

	const [ active, setActive ] = useState(false);

	const onAddRemoveMTX = () => {
		setActive(!active);
		onModifyMTXItem(item, !active);
	};

	const onModifyMTXItem = (mtx, add) => {
		let arr = activeMTX;
		if (add) {
			mtx.selected = true;
			arr = activeMTX.concat(mtx);
		} else {
			arr = arr.filter((item) => item !== mtx);
			mtx.selected = false;
		}
		dispatch(setStepThree(true));
		dispatch(setActiveMTX(arr));
	};

	return (
		<tr className={`mtx ${active ? 'active' : 'inactive'}`} onClick={() => onAddRemoveMTX()}>
			<td>{item.name}</td>
			<td>{item.value}</td>
			<td className={item.rarity}>{item.rarity}</td>
			<td>
				<img src={item.image} alt={item.name} />
			</td>
		</tr>
	);
}
