import React from 'react';
import SimResults from './simResults';

export default function simBoxes({safariCheck, setStatList, setSubmitted, setResultsPending, isRunning, onSubmitResults, completedList, resultsSubmitted, setBoxVal, boxVal, simToggle, resultsPending, fullMTXList, prevBoxVal, setPrevBoxVal}) {

	const calcProfit = () => {
		if (!completedList.length || isRunning) {
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
		<div className={`boxSimulator${safariCheck() ? ' safari' : ''}`}>
			<div className="searchContainer">
				<h4 className="box-input">Boxes:
				<input 
					type="text" 
					pattern={"[0-9]*"} 
					maxLength="3" 
					disabled={isRunning} 
					onChange={(e) => setBoxVal(e.target.value.replace(/\D/,''))} 
					value={boxVal || ''}
					placeholder="#"
					onPaste={(e) => e.preventDefault()}
				/>
				</h4>
				<button 
					className={(boxVal <= 0 || boxVal > 999) || isRunning ? 'disable-btn' : ''} 
					onClick={() => simToggle()} 
					disabled={(boxVal <= 0 || boxVal > 999) || isRunning}
				>
					<i className='fas fa-play'/>
				</button>
				<h4 className="points-amount">Points: {(boxVal * 30) || 0}</h4>
			</div>
			<div className="simInfoContainer">
				<button
					className={`submitResults${resultsSubmitted ? ' submitted' : ''}${resultsPending ? ' pending' : ''}${isRunning || !completedList.length ? ' hideResults' : ''}`}
					onClick={() => onSubmitResults(completedList, setStatList, setSubmitted, setResultsPending)}
					disabled={isRunning || !completedList.length}
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
			<table className={isRunning ? 'hide-table' : 'show-table'}>
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
