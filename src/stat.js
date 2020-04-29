import React from 'react';

export default class Stat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	calcPercentage = (total) => {
		let percentage = ((total / this.props.stat.count) * 100).toFixed(0);
		return isNaN(percentage) ? 0 : percentage;
	}
	render() {
		return (
			<tr className={`stat ${this.props.stat.rarity}`}>
				<td>{this.props.stat.name}</td>
				<td>{this.props.stat.count}</td>
				<td>
					<span className="wanted">
						{this.calcPercentage(this.props.stat.wanted)}%
					</span>
					/ 
					<span className="unwanted">
						{this.calcPercentage(this.props.stat.unwanted)}%
					</span>
				</td>
			</tr>
		);
	}
}
