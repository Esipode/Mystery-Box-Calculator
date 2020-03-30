import React from 'react';

export default class BoxSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	onChangeBox = () => {
		if (this.props.activeBox !== this.props.name || this.props.activeBox === '') {
			this.props.changeBox(this.props.name);
		}
	};
	checkMatch = () => {
		return this.props.activeBox === this.props.name ? ' selected' : ' unselected';
	};
	render() {
		return (
			<div className={`box ${this.checkMatch()}`} onClick={this.onChangeBox}>
				<img src={this.props.image} alt={this.props.name} draggable="false" />
				<h3>{this.props.name}</h3>
			</div>
		);
	}
}
