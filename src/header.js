import React from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stepInfo: [ 
				'Select a box',
				'Select desired MTXs',
				'Simulate Boxes',
				'Global Stats'
			]
		};
	}
	onStepButton = (direction) => {
		this.props.changeStep(this.props.curStep + direction)
	}
	onCheckStepVisibilityForward = (step) => {
		if (this.props.isSimulating) {
			return ''
		}
		else {
			switch (step) {
				case 0:
					return (this.props.boxSelected === "") ? '' : 'headerVisible';
				case 1:
					return (this.props.activeMTX.length < 1) ? '' : 'headerVisible';
				case 2:
					return (this.props.simList) ? 'headerVisible' : '';
				case 3:
					return '';
				default:
					return
			}
		}
	}
	onCheckStepVisibilityBackward = () => {
		if (this.props.isSimulating) {
			return ''
		}
		else {
			if (this.props.curStep > 0) {
				return 'headerVisible'
			}
			else {
				return ''
			}
		}
	}
	render() {
		return (
			<div className="header">
				<div className={`backStep ${this.onCheckStepVisibilityBackward()}`} onClick={() => this.onStepButton(-1)} >
					<div>
						<h3>Step {this.props.curStep > 0 ? this.props.curStep : 1}</h3>
						<span>{this.props.curStep > 0 ? this.state.stepInfo[this.props.curStep - 1] : this.state.stepInfo[0]}</span>
					</div>
					<i className="fas fa-arrow-circle-left" />
				</div>
				<LogoSVG />
				<h1>MTX Calc</h1>
				<h2>Step {this.props.curStep + 1}:<span>{this.state.stepInfo[this.props.curStep]}</span></h2>
				<div className={`forwardStep ${this.onCheckStepVisibilityForward(this.props.curStep)}`} onClick={() => this.onStepButton(+1)}>
					<i className="fas fa-arrow-circle-right" />
					<div>
						<h3>Step {
							!this.props.activeMTX.length && !this.props.allowStepThree ? 2 :
							this.props.curStep === 1 && this.props.allowStepThree ? 3 :
							this.props.curStep < 2 ? this.props.curStep + 2 : 
							this.props.curStep === 2 && !this.props.simList ? 3 :
							this.props.curStep === 2 ? 4 :
							this.props.curStep + 1
							}
						 </h3>
						<span> {
							!this.props.activeMTX.length && !this.props.allowStepThree ? this.state.stepInfo[1] : 
							this.props.curStep === 1 && this.props.allowStepThree ? this.state.stepInfo[2] :
							this.props.curStep < 2 ? this.state.stepInfo[this.props.curStep + 1] : 
							this.props.curStep === 2 && !this.props.simList ? this.state.stepInfo[2] :
							this.props.curStep === 2 ? this.state.stepInfo[3] : 
							this.state.stepInfo[this.props.curStep]
							}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
