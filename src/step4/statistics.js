import React from 'react';
import Stat from './stat';

export default function Statistics({boxChanged, stats, safariCheck}) {

	return (
		<div className={`statistics${safariCheck() ? ' safari' : ''}`}>
			<table style={{display: !boxChanged ? 'table' : 'none'}}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Total</th>
						<th>Ratio</th>
					</tr>
				</thead>
				<tbody>
					{stats.itemList.map(stat => (
						<Stat
							stat={stat}
							key={stat.name}
						/>
					))}
				</tbody>
			</table>
		</div>
	);

}