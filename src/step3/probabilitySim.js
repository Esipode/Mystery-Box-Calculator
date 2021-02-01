import React from 'react';
import { mtxData as data } from '../data.json';
import { images as box } from '../data.json';

import {useSelector, useDispatch} from 'react-redux';
import {} from '../actions';

export default function ProbabilitySim({simMode, probFilter, setProbFilter}) {

	const dispatch = useDispatch();
	const fullMTXList = useSelector(state => state.fullMTXList);
	const activeBox = useSelector(state => state.activeBox);

	const getBoxImage = () => activeBox && box.filter(boxName => boxName.name === activeBox && boxName.image)[0].image;

	return (
		<div className={`probabilitySim${simMode === "probability" ? '' : ' hideContainer'}`}>
			<div className="selectorContainer">
				<h4 className={`boxSelector ${probFilter === "box" ? 'activeFilter' : ''}`} onClick={() => setProbFilter('box')}>
					<img src={getBoxImage()}/>
					Selected Items
					</h4>
				<button>
					<i className='fas fa-play'/>
				</button>
				<h4 className={`itemSelector ${probFilter === "item" ? 'activeFilter' : ''}`} onClick={() => setProbFilter('item')}>Specific Item<img /></h4>
			</div>
		</div>
	);
}
