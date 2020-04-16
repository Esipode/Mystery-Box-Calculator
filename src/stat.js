import React from 'react';

export default class Stat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	render() {
		return (
			<tr className={`stat ${this.props.stat.rarity}`}>
				<td>{this.props.stat.name}</td>
				<td>{this.props.stat.count}</td>
				<td>{this.props.stat.wanted} / {this.props.stat.unwanted}</td>
			</tr>
		);
	}
}
