import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveMTX, setOwnedList, setStepThree } from '../actions';

export default function MTX({ item }) {
	const dispatch = useDispatch();
	const activeMTX = useSelector((state) => state.activeMTX);
	const mode = useSelector((state) => state.currMode);
	const ownedList = useSelector((state) => state.ownedList);

	const [ active, setActive ] = useState(false);
	const [ owned, setOwned ] = useState(false);

	const onToggleMTX = () => {
		if (mode !== 'new') {
			setActive(!active);
			onModifyMTXItem(item, !active);
		}
		else {
			if (!active && !owned) {
				setActive(true);
				onModifyMTXItem(item, true, false);
			}
			else if (active && !owned) {
				setActive(false);
				setOwned(true);
				onModifyMTXItem(item, false, true);
			}
			else if (owned && !active) {
				setOwned(false);
				onModifyMTXItem(item, false, false);
			}
		}
	};

	const onModifyMTXItem = (mtx, selected, owned) => {
		let arr = [...activeMTX];
		mtx.selected = selected;
		if (mode === 'new') {
			mtx.owned = owned;
		}
		if (selected) {
			arr = activeMTX.concat(mtx);
		} else {
			arr = arr.filter((item) => item !== mtx);
		}
		dispatch(setStepThree(true));
		dispatch(setActiveMTX(arr));
		if (mode === 'new') {
			let list = [...ownedList];
			if (owned) {
				list = list.concat(mtx);
			} else {
				list = list.filter((item) => item !== mtx);
			}
			dispatch(setOwnedList(list));
		}
	};

	return (
		<tr className={`mtx ${active ? 'active' : 'inactive'}  ${owned ? 'owned' : ''}`} onClick={onToggleMTX}>
			<td>
				{item.name}
				{active ? <p className='selected'>Selected</p> : owned ? <p className='owned'>Owned</p> : ''}
			</td>
			<td>{item.value}</td>
			<td className={item.rarity}>{mode === 'new' ? item.chance + ' %' : item.rarity}</td>
			<td>
				<img src={item.image} alt={item.name} onError={(e) => e.target.src = "/images/img_missing.svg"} />
			</td>
		</tr>
	);
}
