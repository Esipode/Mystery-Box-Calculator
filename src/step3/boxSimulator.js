import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SimBoxes from './simBoxes';
import startSim from './startSim';

export default function BoxSimulator({simToggle, isRunning, curMTXList, fullMTXList, setStatList, boxChanged, safariCheck}) {
	
	const [boxVal, setBoxVal] = useState(undefined);
	const [completedList, setCompletedList] = useState([]);
	const [resultsPending, setResultsPending] = useState(false);
	const [resultsSubmitted, setSubmitted] = useState(false);

	//Forces waiting between each time an item is randomly selected
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	const listStats = () => {
		let rawList = JSON.parse(JSON.stringify(completedList))
		let sortedItems = rawList;
		return new Promise(resolve => {
			let statList = {};
			statList._id = rawList[0].box;
			statList.total = (() => {
				let sum = 0;
				for (let i = 0; i < rawList.length; i++) {
					sum += rawList[i].count;
				}
				return sum;
			})();
			statList.itemList = (() => {
				
				sortedItems.sort((a, b) => {
					//Sort by index
					if (a.position < b.position) {
						return -1;
					}
					return 0;
				})
				return sortedItems;
			})();
		resolve(statList);
		})
	}

	const onSubmitResults = async () => {
		setResultsPending(true);
		let stat = await listStats();
		if (process.env.REACT_APP_TESTING_ENV) {
			//TESTING POST
			stat._id += "TEST";
			await axios.post('http://localhost:5000/stats/update/'+stat._id, stat)
			.then(res => {
				console.log('Testing stats updated!');
				setStatList(res.data);
				setSubmitted(true);
				setResultsPending(false);
			})
			.catch(async (err) => {
				console.log('Could not find existing table, attempting to create new table!')
				//TESTING ADD
				await axios.post('http://localhost:5000/stats/add/', stat)
				.then(res => {
					setSubmitted(true);
					setResultsPending(false);
					console.log('Table added!');
				})
				.catch((err) => {
					setResultsPending(false);
				});
			});
		}
		else {
			//PRODUCTION POST
			axios.post('/stats/update/'+stat._id, stat)
				.then(res => {
					console.log('Stats updated!');
					setStatList(res.data);
					setSubmitted(true);
					setResultsPending(false);
				})
				.catch((err) => {
					setResultsPending(false);
				});
		}
	}

	useEffect(() => {
		isRunning && boxVal > 0 && startSim(fullMTXList, boxVal, isRunning, curMTXList, setCompletedList, simToggle, setSubmitted, sleep);
	}, [isRunning])

	return (
		<div style={{minWidth: '100vw'}}>
			<SimBoxes safariCheck={safariCheck} isRunning={isRunning} onSubmitResults={onSubmitResults} completedList={completedList} boxChanged={boxChanged} resultsSubmitted={resultsSubmitted} setBoxVal={setBoxVal} boxVal={boxVal} simToggle={simToggle} resultsPending={resultsPending} fullMTXList={fullMTXList} />
		</div>
	);

}