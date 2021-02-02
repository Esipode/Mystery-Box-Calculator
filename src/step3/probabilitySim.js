import React, {useState, useEffect, useMemo} from 'react';
import { mtxData as data } from '../data.json';
import { images as box } from '../data.json';
import Select from 'react-select';

import {useSelector, useDispatch} from 'react-redux';
import {} from '../actions';

export default function ProbabilitySim({simMode}) {

	const dispatch = useDispatch();
	const fullMTXList = useSelector(state => state.fullMTXList);
	const activeBox = useSelector(state => state.activeBox);

	const itemList = useMemo(() => {
		return fullMTXList.map(item => {
			return {value: {item}, label: <div className='listItem'>{item.name}<img src={item.image} /></div>}
		})
	}, [activeBox])
	
	const [probFilter, setProbFilter] = useState('box');
	const [itemSelected, setItemSelected] = useState(itemList[0]);

	useEffect(() => {
		setItemSelected(itemList[0]);
	}, [activeBox])

	const getBoxImage = () => activeBox && box.filter(boxName => boxName.name === activeBox && boxName.image)[0].image;

	return (
		<div className={`probabilitySim${simMode === "probability" ? '' : ' hideContainer'}`}>
			{activeBox &&
				<div className="selectorContainer">
					<h4 className={`boxSelector ${probFilter === "box" ? 'activeFilter' : ''}`} onClick={() => setProbFilter('box')}>
						<img src={getBoxImage()}/>
						<span>Selected Items</span>
					</h4>
					<button>
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
		</div>
	);
}
