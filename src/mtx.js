import React from 'react';

export default class MTX extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		};
	}
	onAddRemoveMTX = () => {
		this.setState(prevState => ({
			active: !prevState.active
		}), () => {this.props.modifyMTXItem(this.props.item, this.state.active)})
	};
	checkActive = () => {
		return this.state.active ? 'active' : 'inactive';
	};
	render() {
		return (
			<tr className={`mtx ${this.checkActive()}`} onClick={this.onAddRemoveMTX}>
					<td>{this.props.item.name}</td>
					<td>{this.props.item.value}</td>
					<td className={this.props.item.rarity}>{this.props.item.rarity}</td>
					<td><img src={this.props.item.image} alt={this.props.item.name} /></td>
			</tr>
		);
	}
}
