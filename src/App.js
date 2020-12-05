import React from 'react';
import './App.scss';
import Header from './header';
import BoxSelection from './boxSelection';
import MTXSelection from './mtxSelection';
import BoxSimulator from './boxSimulator';
import Statistics from './statistics';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curStep: 0,
			curBox: '',
			boxChanged: false,
			fullMTXList: [],
			activeMTX: [],
			statList: {itemList: []},
			simulatorRunning: false
		};
	}
	
	mobileSafariCheck = () => {
		let ua = window.navigator.userAgent;
		let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
		let webkit = !!ua.match(/WebKit/i);
		let isBrave = !!((navigator.brave && navigator.brave.isBrave()) || false);
		let iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !isBrave;
		return iOSSafari;
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
			boxChanged: true,
			fullMTXList: mtxList,
			activeMTX: [],
			statList: {itemList: []},
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
			mtx.selected = false;
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
			simulatorRunning: !prevState.simulatorRunning,
			boxChanged: false
		}))
	}
	onSimFinish = (list) => {
		this.setState({
			statList: list
		})
	}
	render() {
		return (
			<div className={`App ${this.state.curBox.replace(/[^A-Z0-9]+/ig, "_")}`} style={ this.state.curBox === '' ? {backgroundColor: '#2a2a2a'} : {backgroundColor: 'var(--bgColor)'}}>
				<Header 
					curStep={this.state.curStep}
					changeStep={this.onChangeStep}
					boxSelected={this.state.curBox}
					activeMTX={this.state.activeMTX}
					isSimulating={this.state.simulatorRunning}
					simList={this.state.statList.itemList.length > 0 ? true : false}
					allowStepThree={this.state.allowStepThree}
				/>
				<div className="mainWrapper" style={{transform: 'translateX('+(this.state.curStep * -100)+'vw)'}}>
					<BoxSelection changeMTXBox={this.onChangeMTXBox} />
					<MTXSelection curMTX={this.state.curBox} modifyMTXItem={this.onModifyMTXItem} safariCheck={this.mobileSafariCheck} />
					<BoxSimulator
						simToggle={this.onToggleSimulator}
						isRunning={this.state.simulatorRunning}
						curMTXList={this.state.activeMTX}
						fullMTXList={this.state.fullMTXList}
						curStep={this.state.curStep}
						simList={this.onSimFinish}
						boxChanged={this.state.boxChanged}
						safariCheck={this.mobileSafariCheck}
					/>
					<Statistics stats={this.state.statList} boxChanged={this.state.boxChanged} safariCheck={this.mobileSafariCheck} />
				</div>
			</div>
		);
	}
}
