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
	onStepButton = (direction) => {
		this.props.changeStep(this.props.curStep + direction)
	}
	onCheckStepVisibilityForward = (step) => {
		if (this.props.isSimulating) {
			return {display: 'none'}
		}
		else {
			switch (step) {
				case 0:
					return (this.props.boxSelected === "") ? {display: 'none'} : {display: 'flex'};
				case 1:
					return (this.props.activeMTX.length < 1) ? {display: 'none'} : {display: 'flex'};
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
	}
	onCheckStepVisibilityBackward = () => {
		if (this.props.isSimulating) {
			return {display: 'none'}
		}
		else {
			if (this.props.curStep > 0) {
				return {display: 'flex'}
			}
			else {
				return {display: 'none'}
			}
		}
	}
	render() {
		return (
			<div className="header">
				<div className="backStep" onClick={() => this.onStepButton(-1)} style={this.onCheckStepVisibilityBackward()}>
					<div>
						<h3>Step {this.props.curStep}</h3>
						<span>{this.state.stepInfo[this.props.curStep - 1]}</span>
					</div>
					<i className="fas fa-arrow-circle-left" />
				</div>
				<LogoSVG />
				<h1>MTX Calc</h1>
				<h2>Step {this.props.curStep + 1}:<span>{this.state.stepInfo[this.props.curStep]}</span></h2>
				<div className="forwardStep" onClick={() => this.onStepButton(+1)} style={this.onCheckStepVisibilityForward(this.props.curStep)}>
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
