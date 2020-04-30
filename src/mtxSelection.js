import React from 'react';
import { mtxData as data } from './data.json';
import MTX from './mtx';

export default class MTXSelection extends React.Component {
	getMTXList = () => {
		return data.filter((item) => item.box === this.props.curMTX);
	}
	render() {
		let mtxList = this.getMTXList();
		return (
			<div className={`mtxSelection${this.props.safariCheck() ? ' safari' : ''}`}>
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
						{mtxList.map((mtxItem, index) => (
							<MTX
								item={mtxItem}
								key={mtxItem.name}
								modifyMTXItem={this.props.modifyMTXItem}
							/>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
