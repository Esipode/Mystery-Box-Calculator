import React from 'react';

export default class SimResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	render() {
		return (
			<tr className={`simResults ${this.props.item.selected && this.props.item.count > 0 ? 'wanted' : ''} ${this.props.item.count !== 0 && !this.props.item.selected ? 'unwanted' : ''}`}>
				<td>{this.props.item.name}</td>
				<td>{this.props.item.value}</td>
				<td className={this.props.item.rarity}>{this.props.item.rarity}</td>
				<td><img src={this.props.item.image} alt={this.props.item.name} /></td>
				<td>{this.props.item.count}</td>
			</tr>
		);
	}
}
