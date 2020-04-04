import React from 'react';

export default class SimResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	render() {
		return (
			<tr className="simResults">
				<td>{this.props.name}</td>
				<td>{this.props.value}</td>
				<td className={this.props.rarity}>{this.props.rarity}</td>
				<td><img src={this.props.image} alt={this.props.name} /></td>
				<td>{this.props.count}</td>
			</tr>
		);
	}
}
