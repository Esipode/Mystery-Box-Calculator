import React from 'react';
import SimResults from './simResults';
import onSubmitResults from './onSubmitResults';

import {useSelector, useDispatch} from 'react-redux';
import {setStatList, setBoxVal, setResultsPending, setResultsSubmitted} from '../actions';

export default function SimBoxes({simMode, simToggle}) {

	const dispatch = useDispatch();
	const fullMTXList = useSelector(state => state.fullMTXList);
	const simRunning = useSelector(state => state.simRunning);
	const boxVal = useSelector(state => state.boxVal);
	const prevBoxVal = useSelector(state => state.prevBoxVal);
	const completedList = useSelector(state => state.completedList);
	const resultsPending = useSelector(state => state.resultsPending);
	const resultsSubmitted = useSelector(state => state.resultsSubmitted);

	const calcProfit = () => {
		if (!completedList.length || simRunning) {
			return 0;
		}
		else {
			let selectedItems = completedList.filter(item => {
				return item.selected;
			})
			let pointsTotal = 0;
			for (let i in selectedItems) {
				pointsTotal += parseInt(selectedItems[i].value);
			}
			return (pointsTotal - (prevBoxVal * 30))
		}
	}

	return (
		<div className={`boxSimulator${simMode === "simulator" ? '' : ' hideContainer'}`}>
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
					className={(boxVal === null || boxVal === 0 || boxVal > 999) || simRunning ? 'disable-btn' : ''} 
					onClick={() => simToggle()} 
					disabled={(boxVal === null || boxVal === 0 || boxVal > 999) || simRunning}
				>
					<i className='fas fa-play'/>
				</button>
				<h4 className="points-amount">Points: {(boxVal * 30) || 0}</h4>
			</div>
			<div className="simInfoContainer">
				<button
					className={`submitResults${resultsSubmitted ? ' submitted' : ''}${resultsPending ? ' pending' : ''}${simRunning || !completedList.length ? ' hideResults' : ''}`}
					onClick={() => onSubmitResults(dispatch, completedList, setStatList, setResultsSubmitted, setResultsPending)}
					disabled={simRunning || !completedList.length}
				>
					{resultsSubmitted ? <i className="fas fa-check"></i> : 'Submit Results'}
				</button>
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
			<table className={simRunning ? 'hide-table' : 'show-table'}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Value</th>
						<th>Rarity</th>
						<th>Image</th>
						<th>Count</th>
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
	);
}
