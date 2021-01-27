import React, {useState} from 'react';
import './scss/App.scss';
import Header from './header';
import BoxSelection from './step1/boxSelection';
import MTXSelection from './step2/mtxSelection';
import BoxSimulator from './step3/boxSimulator';
import Statistics from './step4/statistics';

export default function App() {

	const [curStep, setCurStep] = useState(0);
	const [curBox, setCurBox] = useState('');
	const [boxChanged, setBoxChanged] = useState(false);
	const [fullMTXList, setFullMTXList] = useState([]);
	const [activeMTX, setActiveMTX] = useState([]);
	const [statList, setStatList] = useState({itemList: []});
	const [simRunning, setSimRunning] = useState(false);
	const [allowStepThree, setStepThree] = useState(false);

	const mobileSafariCheck = () => {
		let ua = window.navigator.userAgent;
		let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
		let webkit = !!ua.match(/WebKit/i);
		let isBrave = !!((navigator.brave && navigator.brave.isBrave()) || false);
		let iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !isBrave;
		return iOSSafari;
	}

	const onChangeStep = (step) => {
		step === 1 && setStepThree(false);
		setCurStep(step);
	}

	const onChangeMTXBox = (boxName, mtxList) => {
		setCurStep(1);
		setCurBox(boxName);
		setBoxChanged(true);
		setFullMTXList(mtxList);
		setActiveMTX([]);
		setStatList({itemList: []});
		setStepThree(false);
	};

	const onModifyMTXItem = (mtx, add) => {
		let arr = activeMTX;
		if (add) {
			mtx.selected = true;
			arr = activeMTX.concat(mtx);
		}
		else {
			arr = arr.filter((item) => item !== mtx);
			mtx.selected = false;
		}
		setStepThree(true);
		setActiveMTX(arr);
	}

	const onToggleSimulator = () => {
		setSimRunning(!simRunning);
		setBoxChanged(false);
	}

	return (
		<div className={`App ${curBox.replace(/[^A-Z0-9]+/ig, "_")}`} style={ curBox === '' ? {backgroundColor: '#2a2a2a'} : {backgroundColor: 'var(--bgColor)'}}>
			<Header 
				curStep={curStep}
				changeStep={onChangeStep}
				boxSelected={curBox}
				activeMTX={activeMTX}
				isSimulating={simRunning}
				simList={statList.itemList.length > 0 ? true : false}
				allowStepThree={allowStepThree}
			/>
			<div className="mainWrapper" style={{transform: 'translateX('+(curStep * -100)+'vw)'}}>
				<BoxSelection changeMTXBox={onChangeMTXBox} />
				<MTXSelection
					curMTX={curBox}
					modifyMTXItem={onModifyMTXItem}
					safariCheck={mobileSafariCheck}
				/>
				<BoxSimulator
					simToggle={onToggleSimulator}
					isRunning={simRunning}
					curMTXList={activeMTX}
					fullMTXList={fullMTXList}
					curStep={curStep}
					setStatList={setStatList}
					boxChanged={boxChanged}
					safariCheck={mobileSafariCheck}
				/>
				<Statistics
					stats={statList}
					boxChanged={boxChanged}
					safariCheck={mobileSafariCheck}
				/>
			</div>
		</div>
	);
}
