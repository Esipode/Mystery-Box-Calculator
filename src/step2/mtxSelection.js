import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import data from '../data.json';
import MTX from './mtx';

const { boxes } = data;

export default function MTXSelection() {
	const currBox = useSelector((state) => state.currBox);
	const mode = useSelector((state) => state.currMode);
	

	const currMTXList = useMemo(() => {
		return boxes.filter((box) => box.name === currBox)[0]?.mtx;
	}, [currBox]);

	return (
		<div className="mtxSelection">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Value</th>
						<th>{mode === 'new' ? 'Chance' : 'Rarity'}</th>
						<th>Image</th>
					</tr>
				</thead>
				<tbody>{currMTXList?.map((item) => <MTX item={item} key={item.name} />)}</tbody>
			</table>
		</div>
	);
}
