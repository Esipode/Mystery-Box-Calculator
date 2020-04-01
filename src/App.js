import React from 'react';
import './App.css';
import Header from './header';
import BoxSelection from './boxSelection';
import MTXSelection from './mtxSelection';
import BoxSimulator from './boxSimulator';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curStep: 0,
			curBox: '',
			activeMTX: []
		};
	}
	onChangeStep = (step) => {
		this.setState({
			curStep: step
		})
	}
	onChangeMTX = (boxName) => {
		this.setState({
			curBox: boxName,
			activeMTX: [],
			curStep: 1
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
				<Header curStep={this.state.curStep} changeStep={this.onChangeStep} boxSelected={this.state.curBox} activeMTX={this.state.activeMTX} />
				<div className="mainWrapper" style={{transform: 'translateX('+(this.state.curStep * -100)+'vw)'}}>
					<BoxSelection changeMTX={this.onChangeMTX} />
					<MTXSelection curMTX={this.state.curBox} modifyMTX={this.onModifyMTX} />
					<BoxSimulator/>
				</div>
			</div>
		);
	}
}
