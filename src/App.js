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
			statList: [],
			simulatorRunning: false
		};
	}
	onChangeStep = (step) => {
		if (step === 1) {
			this.setState({
				allowStepThree: false
			})
		}
		this.setState({
			curStep: step
		})
	}
	onChangeMTXBox = (boxName, mtxList) => {
		this.setState({
			curStep: 1,
			curBox: boxName,
			fullMTXList: mtxList,
			activeMTX: [],
			allowStepThree: false
		});
	};
	onModifyMTXItem = (mtx, add) => {
		let arr = this.state.activeMTX;
		if (add) {
			mtx.selected = true;
			arr = this.state.activeMTX.concat(mtx);
		}
		else {
			arr = arr.filter((item) => item !== mtx);
		}
		this.toggleStepThree(true);
		this.setState({
			activeMTX: arr
		})
	}
	toggleStepThree = (val) => {
		this.setState({
			allowStepThree: val ? true : false
		})
	}
	onToggleSimulator = () => {
		this.setState(prevState => ({
			simulatorRunning: !prevState.simulatorRunning
		}))
	}
	onSimFinish = (list) => {
		this.setState({
			statList: list
		})
	}
	render() {
		return (
			<div className="App">
				<Header 
					curStep={this.state.curStep}
					changeStep={this.onChangeStep}
					boxSelected={this.state.curBox}
					activeMTX={this.state.activeMTX}
					isSimulating={this.state.simulatorRunning}
					simList={this.state.statList.length < 1 ? false : true}
					allowStepThree={this.state.allowStepThree}
				/>
				<div className="mainWrapper" style={{transform: 'translateX('+(this.state.curStep * -100)+'vw)'}}>
					<BoxSelection changeMTXBox={this.onChangeMTXBox} />
					<MTXSelection curMTX={this.state.curBox} modifyMTXItem={this.onModifyMTXItem} />
					<BoxSimulator
						simToggle={this.onToggleSimulator}
						isRunning={this.state.simulatorRunning}
						curMTXList={this.state.activeMTX}
						fullMTXList={this.state.fullMTXList}
						curStep={this.state.curStep}
						simList={this.onSimFinish}
					/>
				</div>
			</div>
		);
	}
}
