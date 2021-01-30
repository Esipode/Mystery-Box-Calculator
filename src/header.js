import React, {useMemo} from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';

import {useSelector, useDispatch} from 'react-redux';
import {setStep, setStepThree} from './actions';

export default function Header() {

	const dispatch = useDispatch();
	const currStep = useSelector(state => state.currStep);
	const currBox = useSelector(state => state.currBox);
	const activeMTX = useSelector(state => state.activeMTX);
	const simRunning = useSelector(state => state.simRunning);
	const allowStepThree = useSelector(state => state.allowStepThree);
	const statList = useSelector(state => state.statList);

	const simList = statList.itemList.length > 0 ? true : false;

	const stepInfo = useMemo(() => [
		'Select a box', 'Select desired MTXs', 'Simulate Boxes', 'Global Stats'
	], [])

	const onStepButton = (step) => {
		step === 1 && dispatch(setStepThree(false));
		dispatch(setStep(step));
	}

	const onCheckStepVisibilityForward = (step) => {
		if (simRunning) {
			return ''
		}
		else {
			switch (step) {
				case 0:
					return (currBox === "") ? '' : 'headerVisible';
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
		if (simRunning) {
			return ''
		}
		else {
			if (currStep > 0) {
				return 'headerVisible'
			}
			else {
				return ''
			}
		}
	}

	return (
		<div className="header">
			<div className={`backStep ${onCheckStepVisibilityBackward()}`} onClick={() => onStepButton(currStep - 1)} >
				<div>
					<h3>Step {currStep > 0 ? currStep : 1}</h3>
					<span>{currStep > 0 ? stepInfo[currStep - 1] : stepInfo[0]}</span>
				</div>
				<i className="fas fa-arrow-circle-left" />
			</div>
			<LogoSVG />
			<h1>MTX Calc</h1>
			<h2>Step {currStep + 1}:<span>{stepInfo[currStep]}</span></h2>
			<div className={`forwardStep ${onCheckStepVisibilityForward(currStep)}`} onClick={() => onStepButton(currStep + 1)}>
				<i className="fas fa-arrow-circle-right" />
				<div>
					<h3>Step {
						!activeMTX.length && !allowStepThree ? 2 :
						currStep === 1 && allowStepThree ? 3 :
						currStep < 2 ? currStep + 2 : 
						currStep === 2 && !simList ? 3 :
						currStep === 2 ? 4 :
						currStep + 1
						}
					 </h3>
					<span> {
						!activeMTX.length && !allowStepThree ? stepInfo[1] : 
						currStep === 1 && allowStepThree ? stepInfo[2] :
						currStep < 2 ? stepInfo[currStep + 1] : 
						currStep === 2 && !simList ? stepInfo[2] :
						currStep === 2 ? stepInfo[3] : 
						stepInfo[currStep]
						}
					</span>
				</div>
			</div>
		</div>
	);

}