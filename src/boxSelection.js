import React from 'react';
import { images as box } from './data.json';
import { mtxData as data } from './data.json';
import Box from './box';

export default class BoxSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boxList: box,
			activeBox: ''
		};
	}
	onChangeActiveBox = (newBox) => {
		this.setState({
			activeBox: newBox
		});
		let fullMTXList = data.filter((item) => item.box === newBox);
		this.props.changeMTXBox(newBox, fullMTXList);
	};
	render() {
		return (
			<div className="boxSelection">
				{this.state.boxList.map((image, index) => (
					<Box
						name={this.state.boxList[index].name}
						image={this.state.boxList[index].image}
						key={this.state.boxList[index].name}
						changeBox={this.onChangeActiveBox}
						activeBox={this.state.activeBox}
					/>
				))}
			</div>
		);
	}
}
