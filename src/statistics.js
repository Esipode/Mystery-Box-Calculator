import React from 'react';
import Stat from './stat';

export default class Statistics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	render() {
		return (
			<div className="statistics">
				<table style={{display: !this.props.boxChanged ? 'table' : 'none'}}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Total</th>
							<th>Ratio</th>
						</tr>
					</thead>
					<tbody>
						{this.props.stats.itemList.map(stat => (
							<Stat
								stat={stat}
								key={stat.name}
							/>
						))}
						<tr className="bufferSpace" />
					</tbody>
				</table>
			</div>
		);
	}
}