import React from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';
export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stepInfo: ['Select a box',
								 'Select desired MTXs',
								 'Simulate Boxes',
								 'Step 4 Info'	
								]
		};
	}
	onStepBack = () => {
		this.props.changeStep(this.props.curStep - 1)
	}
	onStepForward = () => {
		this.props.changeStep(this.props.curStep + 1)
	}
	onCheckStepVisibility = (step) => {
		switch (step) {
			case 0:
				return (this.props.boxSelected === "") ? {display: 'none'} : {display: 'flex'};
			case 1:
				console.log(this.props.activeMTX);
				return (this.props.activeMTX === []) ? {display: 'none'} : {display: 'flex'};
			case 2:
				return {
					display: 'none'
				};
			case 3:
				return {
					display: 'none'
				};
			default:
			 return
		}
	}
	render() {
		return (
			<div className="header">
				<div className="backStep" onClick={this.onStepBack} style={{display: this.props.curStep > 0 ? 'flex' : 'none'}}>
					<div>
						<h3>Step {this.props.curStep}</h3>
						<span>{this.state.stepInfo[this.props.curStep - 1]}</span>
					</div>
					<i className="fas fa-arrow-circle-left" />
				</div>
				<LogoSVG />
				<h1>MTX Calc</h1>
				<h2>Step {this.props.curStep + 1}:<span>{this.state.stepInfo[this.props.curStep]}</span></h2>
				<div className="forwardStep" onClick={this.onStepForward} style={this.onCheckStepVisibility(this.props.curStep)}>
					<i className="fas fa-arrow-circle-right" />
					<div>
						<h3>Step {this.props.curStep + 2}</h3>
						<span>{this.state.stepInfo[this.props.curStep + 1]}</span>
					</div>
				</div>
			</div>
		);
	}
}
