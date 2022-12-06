import React, { useEffect, useRef, useState } from 'react';
import SimResults from './helperFunctions/simResults';
// Disabled for now due to not using backend server
// import onSubmitResults from './helperFunctions/onSubmitResults';
import BoxSimToggle from './boxSimToggle';

import {useSelector, useDispatch} from 'react-redux';
// Disabled for now due to not using backend server
// import {setStatList, setBoxVal, setResultsPending, setResultsSubmitted} from '../actions';
import { setBoxVal } from '../actions';

export default function SimBoxes({simMode, simToggle}) {
	const tableHeaderRef = useRef();
	const [fakeHeaderWidths, setFakeHeaderWidths] = useState([]);

	const dispatch = useDispatch();
	const fullMTXList = useSelector(state => state.fullMTXList);
	const mode = useSelector(state => state.currMode);
	const simRunning = useSelector(state => state.simRunning);
	const boxVal = useSelector(state => state.boxVal);
	const prevBoxVal = useSelector(state => state.prevBoxVal);
	const completedList = useSelector(state => state.completedList);
	// Disabled for now due to not using backend server
	// const resultsPending = useSelector(state => state.resultsPending);
	// const resultsSubmitted = useSelector(state => state.resultsSubmitted);
	// const boxName = useSelector(state => state.currBox);
	const ownedList = useSelector(state => state.ownedList);

	const calcProfit = () => {
		if (!completedList.length || simRunning) {
			return 0;
		}
		else {
			let selectedItems = completedList.filter(item => item.rolled && item.selected)
			let pointsTotal = 0;
			for (let i in selectedItems) {
				pointsTotal += parseInt(selectedItems[i].value);
			}
			return (pointsTotal - (prevBoxVal * (mode === 'new' ? 50 : 30)))
		}
	}

	//Correct number of boxes if it exceeds number of options in new mode
	useEffect(() => {
		const maxSize = fullMTXList.length - ownedList.length;
		if (mode === 'new' && boxVal > maxSize) {
			dispatch(setBoxVal(maxSize));
		}
	}, [boxVal, fullMTXList, mode, dispatch, ownedList])

	//Get fake table header widths
	const checkWidths = () => {
		let widths = [];
		if (tableHeaderRef?.current) {
			for (let i in tableHeaderRef?.current?.children[0].children) {
				let width = tableHeaderRef?.current?.children[0].children[i].offsetWidth;
				if (width !== undefined) {
					widths[i] = tableHeaderRef?.current?.children[0].children[i].offsetWidth;
				}
			}
			setFakeHeaderWidths(widths);
		}
		return widths;
	}

	const isDisabled = () => (
		simRunning ||
		(boxVal === null || boxVal === 0 || boxVal > 999) || 
		(mode === 'new' && boxVal > (fullMTXList.length - ownedList.length))
	)

	//Get fake table header widths
	useEffect(() => {
		if (mode && fullMTXList) {
			window.addEventListener("resize", checkWidths);
			setFakeHeaderWidths(checkWidths());
			return () => {
				window.removeEventListener("resize", checkWidths);
			};
		}
	}, [mode, fullMTXList]);

	return (
		<div className={`boxSimulator${simMode === "simulator" ? '' : ' hideContainer'}`}>
			<div className="sim-header">
				<BoxSimToggle />
				<div className="searchContainer">
					<h4 className="box-input">Boxes:
					<input 
						type="text" 
						pattern={"[0-9]*"} 
						maxLength="3" 
						disabled={simRunning}
						onChange={(e) => dispatch(setBoxVal(parseInt(e.target.value.replace(/\D/,'')) || 0))}
						value={boxVal || ''}
						placeholder="#"
						onPaste={(e) => e.preventDefault()}
					/>
					</h4>
					<button 
						className={isDisabled() ? 'disable-btn' : ''} 
						onClick={() => simToggle()} 
						disabled={isDisabled()}
					>
						<i className='fas fa-play'/>
					</button>
					<h4 className="points-amount">Points: {(boxVal * (mode === 'new' ? 50 : 30)) || 0}</h4>
				</div>
				<div className="simInfoContainer">
					{/* Disabled for now due to not using backend server */}
					{/* <button
						className={`submitResults${resultsSubmitted ? ' submitted' : ''}${resultsPending ? ' pending' : ''}${simRunning || !completedList.length ? ' hideResults' : ''}`}
						onClick={() => onSubmitResults(dispatch, completedList, setStatList, setResultsSubmitted, setResultsPending, boxName)}
						disabled={simRunning || !completedList.length}
					>
						{resultsSubmitted ? <i className="fas fa-check"></i> : 'Submit Results'}
					</button> */}
					<p className="profitContainer">
						<span>Profit</span>
						/
						<span>Loss</span>
						:
						<span className={`amount${calcProfit() > 0 ? '-positive' : calcProfit() < 0 ? '-negative' : ''}`}>
							{calcProfit().toString().replace('-', '')}
						</span> 
						Points
					</p>
				</div>
			</div>			
			<div className='table-wrapper'>
				<table className={`fake-header ${simRunning ? 'hide-table' : 'show-table'}`}>
					<thead>
						<tr>
							<th style={{width: fakeHeaderWidths?.[0] || 'auto'}}>Name</th>
							<th style={{width: fakeHeaderWidths?.[1] || 'auto'}}>Value</th>
							<th style={{width: fakeHeaderWidths?.[2] || 'auto'}}>{mode === 'new' ? 'Chance' : 'Rarity'}</th>
							<th style={{width: fakeHeaderWidths?.[3] || 'auto'}}>Image</th>
							{mode === 'old' &&<th style={{width: fakeHeaderWidths?.[4] || 'auto'}}>Count</th>}
						</tr>
					</thead>
				</table>
				<table className={simRunning ? 'hide-table' : 'show-table'}>	
					<thead ref={tableHeaderRef}>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>{mode === 'new' ? 'Chance' : 'Rarity'}</th>
							<th>Image</th>
							{mode === 'old' &&<th>Count</th>}
						</tr>
					</thead>
					<tbody>
						{!completedList?.length ? 
							fullMTXList?.map((item) => (
								<SimResults
									item={item}
									key={item.name}
								/>
							)) :
							completedList?.map((item) => (
								<SimResults
									item={item}
									key={item.name}
								/>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	);
}
