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
				<td><span className="wanted">{((this.props.stat.wanted ? this.props.stat.wanted : 0 / this.props.stat.count ? this.props.stat.count : 0) * 100).toFixed(0)}%</span> / <span className="unwanted">{((this.props.stat.unwanted ? this.props.stat.unwanted : 0 / this.props.stat.count ? this.props.stat.count : 0) * 100).toFixed(0)}%</span></td>
			</tr>
		);
	}
}
