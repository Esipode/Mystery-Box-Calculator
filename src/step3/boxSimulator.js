import React, {useEffect, useState} from 'react';
import SimBoxes from './simBoxes';
import startSim from './startSim';
import onSubmitResults from './onSubmitResults';

export default function BoxSimulator({simToggle, isRunning, curMTXList, fullMTXList, setStatList, boxChanged, safariCheck}) {
	
	const [boxVal, setBoxVal] = useState();
	const [prevBoxVal, setPrevBoxVal] = useState(0);
	const [completedList, setCompletedList] = useState([]);
	const [resultsPending, setResultsPending] = useState(false);
	const [resultsSubmitted, setSubmitted] = useState(false);

	//Forces waiting between each time an item is randomly selected
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	useEffect(() => {
		isRunning && boxVal > 0 && startSim(fullMTXList, boxVal, isRunning, curMTXList, setCompletedList, simToggle, setSubmitted, sleep, setPrevBoxVal);
	}, [isRunning])

	return (
		<div className="boxSimulatorContainer">
		{/* <div className="boxSimToggle">
			<p>Open Boxes</p>
			<p>Calculate Probability</p>
		</div> */}
			<SimBoxes 
				safariCheck={safariCheck}
				setStatList={setStatList}
				setSubmitted={setSubmitted}
				setResultsPending={setResultsPending}
				isRunning={isRunning}
				onSubmitResults={onSubmitResults}
				completedList={completedList}
				boxChanged={boxChanged}
				resultsSubmitted={resultsSubmitted}
				setBoxVal={setBoxVal}
				boxVal={boxVal}
				simToggle={simToggle}
				resultsPending={resultsPending}
				fullMTXList={fullMTXList}
				prevBoxVal={prevBoxVal}
			/>
		</div>
	);

}