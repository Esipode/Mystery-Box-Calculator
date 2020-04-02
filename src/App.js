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
			fullMTXList: [],
			activeMTX: [],
			simulatorRunning: false
		};
	}
	onChangeStep = (step) => {
		this.setState({
			curStep: step
		})
	}
	onChangeMTXBox = (boxName, mtxList) => {
		this.setState({
			curStep: 1,
			curBox: boxName,
			fullMTXList: mtxList,
			activeMTX: []		
		});
	};
	onModifyMTXItem = (mtx, add) => {
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
	onToggleSimulator = () => {
		this.setState(prevState => ({
			simulatorRunning: !prevState.simulatorRunning
		}))
	}
	render() {
		return (
			<div className="App">
				<Header curStep={this.state.curStep} changeStep={this.onChangeStep} boxSelected={this.state.curBox} activeMTX={this.state.activeMTX} isSimulating={this.state.simulatorRunning} />
				<div className="mainWrapper" style={{transform: 'translateX('+(this.state.curStep * -100)+'vw)'}}>
					<BoxSelection changeMTXBox={this.onChangeMTXBox} />
					<MTXSelection curMTX={this.state.curBox} modifyMTXItem={this.onModifyMTXItem} />
					<BoxSimulator simToggle={this.onToggleSimulator} isRunning={this.state.simulatorRunning} curMTXList={this.state.activeMTX} fullMTXList={this.state.fullMTXList} />
				</div>
			</div>
		);
	}
}
