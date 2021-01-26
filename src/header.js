import React, {useMemo} from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';

export default function Header({curStep, changeStep, boxSelected, activeMTX, isSimulating, simList, allowStepThree}) {

	const stepInfo = useMemo(() => [
		'Select a box', 'Select desired MTXs', 'Simulate Boxes', 'Global Stats'
	], [])

	const onStepButton = (direction) => {
		changeStep(curStep + direction)
	}

	const onCheckStepVisibilityForward = (step) => {
		if (isSimulating) {
			return ''
		}
		else {
			switch (step) {
				case 0:
					return (boxSelected === "") ? '' : 'headerVisible';
				case 1:
					return (activeMTX.length < 1) ? '' : 'headerVisible';
				case 2:
					return (simList) ? 'headerVisible' : '';
				case 3:
					return '';
				default:
					return
			}
		}
	}

	const onCheckStepVisibilityBackward = () => {
		if (isSimulating) {
			return ''
		}
		else {
			if (curStep > 0) {
				return 'headerVisible'
			}
			else {
				return ''
			}
		}
	}

	return (
		<div className="header">
			<div className={`backStep ${onCheckStepVisibilityBackward()}`} onClick={() => onStepButton(-1)} >
				<div>
					<h3>Step {curStep > 0 ? curStep : 1}</h3>
					<span>{curStep > 0 ? stepInfo[curStep - 1] : stepInfo[0]}</span>
				</div>
				<i className="fas fa-arrow-circle-left" />
			</div>
			<LogoSVG />
			<h1>MTX Calc</h1>
			<h2>Step {curStep + 1}:<span>{stepInfo[curStep]}</span></h2>
			<div className={`forwardStep ${onCheckStepVisibilityForward(curStep)}`} onClick={() => onStepButton(+1)}>
				<i className="fas fa-arrow-circle-right" />
				<div>
					<h3>Step {
						!activeMTX.length && !allowStepThree ? 2 :
						curStep === 1 && allowStepThree ? 3 :
						curStep < 2 ? curStep + 2 : 
						curStep === 2 && !simList ? 3 :
						curStep === 2 ? 4 :
						curStep + 1
						}
					 </h3>
					<span> {
						!activeMTX.length && !allowStepThree ? stepInfo[1] : 
						curStep === 1 && allowStepThree ? stepInfo[2] :
						curStep < 2 ? stepInfo[curStep + 1] : 
						curStep === 2 && !simList ? stepInfo[2] :
						curStep === 2 ? stepInfo[3] : 
						stepInfo[curStep]
						}
					</span>
				</div>
			</div>
		</div>
	);

}