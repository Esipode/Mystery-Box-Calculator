import React from 'react';

export default class MTX extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="mtx">
				<h3>{this.props.name}</h3>
				<h3>{this.props.value}</h3>
				<h3>{this.props.rarity}</h3>
				<img src={this.props.image} alt={this.props.name} />
			</div>
		);
	}
}
