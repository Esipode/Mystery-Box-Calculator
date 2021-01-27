import React from 'react';
import SimResults from './simResults';

export default function simBoxes({safariCheck, setStatList, setSubmitted, setResultsPending, isRunning, onSubmitResults, completedList, resultsSubmitted, setBoxVal, boxVal, simToggle, resultsPending, fullMTXList}) {

	return (
		<div className={`boxSimulator${safariCheck() ? ' safari' : ''}`}>
			<div className="searchContainer">
				<h4>Boxes:
				<input 
					type="text" 
					pattern={"[0-9]*"} 
					maxLength="3" 
					disabled={isRunning} 
					onChange={(e) => setBoxVal(e.target.value.replace(/\D/,''))} 
					value={boxVal}
					placeholder="#"
					onPaste={(e) => e.preventDefault()}
				/>
				</h4>
				<h4>Points: {(boxVal * 30) || 0}</h4>
				<button 
					className={!boxVal > 0 || boxVal > 999 || isRunning ? 'disable-btn' : ''} 
					onClick={() => simToggle()} 
					disabled={!boxVal > 0 || boxVal > 999 || isRunning}
				>
					<i className='fas fa-play'/>
				</button>
			</div>
			<button
				className={`submitResults${resultsSubmitted ? ' submitted' : ''}${resultsPending ? ' pending' : ''}${isRunning || !completedList.length ? ' hideResults' : ''}`}
				onClick={() => onSubmitResults(completedList, setStatList, setSubmitted, setResultsPending)}
				disabled={isRunning || !completedList.length}
			>
				{resultsSubmitted ? <i className="fas fa-check"></i> : 'Submit Results'}
			</button>
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
					{!completedList?.length && 
						fullMTXList?.map((item) => (
							<SimResults
								item={item}
								key={item.name}
							/>
						))
					}
					{completedList?.length &&
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
