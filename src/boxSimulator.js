import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SimResults from './simResults';

export default function BoxSimulator({simToggle, isRunning, curMTXList, fullMTXList, curStep, setStatList, boxChanged, safariCheck}) {

	const [, updateState] = React.useState();
  	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	const [boxVal, setBoxVal] = useState('');
	const [curProgress, setCurProg] = useState(0);
	const [percentLoaded, setPercent] = useState(0);
	const [completedList, setCompletedList] = useState([]);
	const [resultsPending, setResultsPending] = useState(false);
	const [resultsSubmitted, setSubmitted] = useState(false);

	//Forces waiting between each time an item is randomly selected
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	const startSim = async () => {
		let startTime = performance.now();
		setSubmitted(false);
		let selectedItems = JSON.parse(JSON.stringify(fullMTXList));
		let fullList = JSON.parse(JSON.stringify(fullMTXList));
		//Execute for as long as the number of items randomly selected is less than the number of boxes to be opened
		for (let i = 1; i <= boxVal;) {
			//Forces waiting between each time an item is randomly selected to prevent browser freezing
			await sleep(5);
			if (!isRunning) {
				break;
			}
			else {
				//Variable to store selected rarity of items to select from
				let curRarity;
				//Random number to decided rarity
				let chanceRoll = Math.floor(Math.random()*(100)+1);
				//Weighted categories for deciding rarity
				switch (true) {
					case (chanceRoll <= 20):
						curRarity = 'rare';
						break;
					case (chanceRoll <= 55 && chanceRoll > 20):
						curRarity = 'uncommon';
						break;
					case (chanceRoll > 55):
						curRarity = 'common'
						break;
					default:
						curRarity = ''
						break;
				}
				//Create filtered list of item indexes matching selected rarity
				let listFiltered = [];
				for (let i in fullList) {
					fullList[i].rarity === curRarity && listFiltered.push(i);
				}
				//The index of the item to be selected, taken from the full list
				let curItemIndex = listFiltered[Math.floor(Math.random()*(listFiltered.length))];
				//Check to see if the randomly selected rarity matched the rarity of the random item
				if (curRarity === fullList[curItemIndex].rarity) {
					//Create variable storing the currently selected item taken from the index of the full list
					let curItem = JSON.parse(JSON.stringify(fullList[curItemIndex]));
					let itemCheck = curMTXList.filter((item) => item.name === curItem.name);
					for (let j = 0; j <= selectedItems.length; j++) {
						if (j < selectedItems.length && curItem.name === selectedItems[j].name) {
							selectedItems[j].count++;
							if (itemCheck.length) {
								if (itemCheck[0].name === selectedItems[j].name) {
									selectedItems[j].selected = true;
								}
								else {
									selectedItems[j].selected = false;
								}
							}
							selectedItems[j].rolled = true;
							i++;
							break;
						}
					}
					setCurProg(i - 1);
					setPercent(((i / boxVal) * 100));
				}
			}
		}
		selectedItems.forEach((item, index) => {
			item.position = index;
		});
		selectedItems.sort((a, b) => {
			if (a.rolled !== b.rolled) {
				return a.rolled ? -1 : 1;
			}
			//First sort by if the item is desired or not and items that were rolled
			if (a.selected !== b.selected) {
				return a.selected ? -1 : 1;
			}
			//Then sort by index
			if (a.position < b.position) {
				return -1;
			}
			return 0;
		})
		await sleep(100);
		setCurProg(0);
		setPercent(0);
		setCompletedList(selectedItems);
		isRunning && simToggle();

		let endTime = performance.now();
		console.log("%cSimulation Time: ", "color: #0a0" , ((endTime - startTime) / 1000).toFixed(2) + " Seconds");
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
		isRunning && startSim();
	}, [isRunning])

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
				<h4>Points: {boxVal * 30}</h4>
				<button onClick={() => {forceUpdate(); simToggle()}} style={{borderColor: isRunning ? '#ff5f5f' : 'var(--mainColor)'}}>
					<i className={isRunning ? 'fas fa-stop' : 'fas fa-play' }/>
				</button>
				<div
					className="progressBar"
					style={{
						clipPath: `inset(0 ${(100 - percentLoaded)}% 0 0)`,
						WebkitClipPath: `inset(0 ${(100 - percentLoaded)}% 0 0)`,
						opacity: percentLoaded >= 1 && percentLoaded < 100 ? 1 : 0
					}}
				/>
			</div>
			<p className="progressCount" style={{display: isRunning && !boxChanged && curProgress !== boxVal ? 'block' : 'none'}}>{curProgress}/{boxVal}</p>
			<p 
				className={`submitResults${resultsSubmitted ? ' submitted' : ''}${resultsPending ? ' pending' : ''}`}
				onClick={() => onSubmitResults()} 
				style={{display: !isRunning && completedList.length && !boxChanged ? 'block' : 'none'}}
			>
				{resultsSubmitted ? <i className="fas fa-check"></i> : 'Submit Results'}
			</p>
			<table style={{display: completedList.length && !isRunning && !boxChanged ? 'table' : 'none'}}>
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
					{completedList.map((item) => (
						<SimResults
							item={item}
							key={item.name}
						/>
					))}
				</tbody>
			</table>
		</div>
	);

}