import React from 'react';
import Stat from './stat';
import { useSelector, useDispatch } from 'react-redux';

export default function Statistics() {
	const statList = useSelector((state) => state.statList);
	const boxChanged = useSelector((state) => state.boxChanged);

	return (
		<div className="statistics">
			<table style={{ display: !boxChanged ? 'table' : 'none' }}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Total</th>
						<th>Ratio</th>
					</tr>
				</thead>
				<tbody>{statList.itemList.map((stat) => <Stat stat={stat} key={stat.name} />)}</tbody>
			</table>
		</div>
	);
}
