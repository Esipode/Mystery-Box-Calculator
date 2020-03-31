import React from 'react';
import { mtxData as data } from './data.json';
import MTX from './mtx';

export default class MTXSelection extends React.Component {
	render() {
		let mtxList = data.filter((item) => item.box === this.props.curMTX);
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
					<tbody>
						{mtxList.map((mtxData, index) => (
								<MTX
									item={mtxList[index]}
									name={mtxList[index].name}
									image={mtxList[index].image}
									value={mtxList[index].value}
									rarity={mtxList[index].rarity}
									key={mtxList[index].name}
									modifyMTX={this.props.modifyMTX}
								/>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
