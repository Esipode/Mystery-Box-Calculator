import React from 'react';
import './App.css';
import Header from './header';
import BoxSelection from './boxSelection';
import MTXSelection from './mtxSelection';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curBox: '',
			activeMTX: []
		};
	}
	onChangeMTX = (boxName) => {
		this.setState({
			curBox: boxName,
			activeMTX: []
		});
	};
	onModifyMTX = (mtx, add) => {
		let arr = this.state.activeMTX;
		if (add) {
			arr = this.state.activeMTX.concat(mtx);
			this.setState({
				activeMTX: arr
			})
		}
		else {
			arr = arr.filter((item) => item !== mtx);
			this.setState({
				activeMTX: arr
			})
		}
	}
	render() {
		return (
			<div className="App">
				<Header />
				<BoxSelection changeMTX={this.onChangeMTX} />
				<MTXSelection curMTX={this.state.curBox} modifyMTX={this.onModifyMTX} />
			</div>
		);
	}
}
