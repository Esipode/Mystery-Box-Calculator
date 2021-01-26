import React from 'react';
import { mtxData as data } from './data.json';
import MTX from './mtx';

export default function MTXSelection({curMTX, modifyMTXItem, safariCheck}) {

	const getMTXList = () => {
		return data.filter((item) => item.box === curMTX);
	}

	return (
		<div className={`mtxSelection${safariCheck() ? ' safari' : ''}`}>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Value</th>
						<th>Rarity</th>
						<th>Image</th>
					</tr>
				</thead>
				<tbody>
					{getMTXList().map((mtxItem, index) => (
						<MTX
							item={mtxItem}
							key={mtxItem.name}
							modifyMTXItem={modifyMTXItem}
						/>
					))}
				</tbody>
			</table>
		</div>
	);

}