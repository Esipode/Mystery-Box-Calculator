import React from 'react';
import { mtxData as data } from '../data.json';
import MTX from './mtx';
import { useSelector } from 'react-redux';

export default function MTXSelection() {
	const currBox = useSelector((state) => state.currBox);

	const getMTXList = () => {
		return data.filter((item) => item.box === currBox);
	};

	return (
		<div className="mtxSelection">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Value</th>
						<th>Rarity</th>
						<th>Image</th>
					</tr>
				</thead>
				<tbody>{getMTXList().map((mtxItem, index) => <MTX item={mtxItem} key={mtxItem.name} />)}</tbody>
			</table>
		</div>
	);
}
