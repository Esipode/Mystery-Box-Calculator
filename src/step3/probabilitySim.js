import React, {useState, useEffect, useMemo} from 'react';
import { mtxData as data } from '../data.json';
import { images as box } from '../data.json';
import Select from 'react-select';

import {useSelector, useDispatch} from 'react-redux';
import {setSimRunning} from '../actions';

export default function ProbabilitySim({simMode, sleep}) {

	const dispatch = useDispatch();
	const fullMTXList = useSelector(state => state.fullMTXList);
	const activeBox = useSelector(state => state.activeBox);
	const activeMTX = useSelector(state => state.activeMTX);
	const simRunning = useSelector(state => state.simRunning);

	const itemList = useMemo(() => {
		return fullMTXList.map(item => {
			return {value: {item}, label: <div className='listItem'>{item.name}<img src={item.image} /></div>}
		})
	}, [activeBox])
	
	const [probFilter, setProbFilter] = useState('box');
	const [itemSelected, setItemSelected] = useState(itemList[0]);
	const [iterations, setIterations] = useState(10);
	const [boxCalcCurrent, setBoxCalcCurrent] = useState({
		iteration: 0,
		boxes: 0,
		points: 0,
		found: [0, 0],
		percent: 0
	});
	const [boxCalcList, setBoxCalcList] = useState([]);

	//Reset displayed item when box changes
	useEffect(() => {
		setBoxCalcCurrent({
			iteration: 0,
			boxes: 0,
			points: 0,
			found: [0, 0],
			percent: 0
		});
		setBoxCalcList([]);
		setItemSelected(itemList[0]);
	}, [activeBox])

	//Run box calculation when start button pressed
	useEffect(() => {
		simRunning && activeBox && calcBox();
	}, [simRunning])

	const getBoxImage = () => activeBox && box.filter(boxName => boxName.name === activeBox && boxName.image)[0].image;

	const calcBox = async () => {
		let fullList = JSON.parse(JSON.stringify(fullMTXList));
		let selectList = JSON.parse(JSON.stringify(activeMTX));
		let currVals = {
			iteration: 0,
			boxes: 0,
			points: 0,
			found: [0, 0],
			percent: 0
		}
		for (let j in selectList) {
			selectList[j].count = 0;
		}
		for (let i = 0; i < iterations;) {
			await sleep(10);
			if (!simRunning) {
				break;
			}
			else {
				currVals.boxes++
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
				selectList.filter(mtx => {
					if (mtx.name === fullList[curItemIndex].name) {
						mtx.count++;
					}
				})
				currVals = {
					iteration: i + 1,
					boxes: currVals.boxes,
					points: currVals.boxes * 30,
					found: [selectList.filter(mtx => mtx.count >= 1).length , selectList.length],
					percent: ((selectList.filter(mtx => mtx.count >= 1).length * 100) / currVals.boxes || 0).toFixed(2)
	
				}
				if (selectList.filter(mtx => mtx.count >= 1).length === selectList.length) {
					let newList = boxCalcList;
					newList.unshift({
						iteration: i + 1,
						boxes: currVals.boxes,
						points: currVals.boxes * 30,
						found: [selectList.filter(mtx => mtx.count >= 1).length , selectList.length],
						percent: ((selectList.filter(mtx => mtx.count >= 1).length * 100) / currVals.boxes || 0).toFixed(2)
					})
					setBoxCalcList(newList);
					currVals = {
						iteration: i + 2,
						boxes: 0,
						points: 0,
						found: [0, selectList.length],
						percent: 0
		
					}
					for (let j in selectList) {
						selectList[j].count = 0;
					}
					i++;
					console.log(newList);
				}
				setBoxCalcCurrent(currVals)
			}
		}
		dispatch(setSimRunning(false));
	}
		
	return (
		<div className={`probabilitySim${simMode === "probability" ? '' : ' hideContainer'}`}>
			{activeBox &&
				<div className="selectorContainer">
					<h4 className={`boxSelector ${probFilter === "box" ? 'activeFilter' : ''}`} onClick={() => setProbFilter('box')}>
						<img src={getBoxImage()}/>
						<span>Selected Items</span>
					</h4>
					<button 
						className={`${simRunning ? 'disable-btn' : ''}`} 
						onClick={() => {
							setBoxCalcCurrent({
								iteration: 0,
								boxes: 0,
								points: 0,
								found: [0, 0],
								percent: 0})
							setBoxCalcList([]);
							dispatch(setSimRunning(true));
						}}
						disabled={simRunning}>
						<i className='fas fa-play'/>
					</button>
					<Select 
						className={`react-select ${probFilter === 'item' ? 'activeSelect': ''}`}
						classNamePrefix="react-select"
						defaultValue={itemList[0]}
						value={itemSelected}
						onChange={(e) => {setItemSelected(e); setProbFilter('item')}}
						options={itemList}
						isSearchable={false}
					/>
				</div>
			}
			<h4 className="iteration-input">Iterations:
				<input 
					type="text" 
					pattern={"[0-9]*"} 
					maxLength="2" 
					disabled={simRunning}
					onChange={(e) => setIterations(e.target.value)} 
					value={iterations}
					placeholder="#"
					onPaste={(e) => e.preventDefault()}
				/>
			</h4>
			<div className="boxCalcListContainer">
				<table>
					<thead>
						<tr>
							<th>Iteration</th>
							<th>Boxes Opened</th>
							<th>Points Spent</th>
							<th>Selected Found</th>
							<th>Percent Chance</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td># {boxCalcCurrent.iteration}</td>
							<td>{boxCalcCurrent.boxes}</td>
							<td>{boxCalcCurrent.points}</td>
							<td>{boxCalcCurrent.found[0]} / {boxCalcCurrent.found[1]}</td>
							<td>{boxCalcCurrent.percent} %</td>
						</tr>
						{boxCalcList.map((round, index) => {
							return <tr key={index}>
								<td># {round.iteration}</td>
								<td>{round.boxes}</td>
								<td>{round.points}</td>
								<td>{round.found[0]} / {round.found[1]}</td>
								<td>{round.percent} %</td>
							</tr>
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
