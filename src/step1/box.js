import React from 'react';
import { mtxData as data } from '../data.json';

import {useSelector, useDispatch} from 'react-redux';
import {setStep, setBox, setBoxChanged, setFullMTXList, setActiveMTX, setStatList, setStepThree, setActiveBox} from '../actions';

export default function Box({name, image}) {

	const dispatch = useDispatch();
	const activeBox = useSelector(state => state.activeBox);

	

	const onChangeMTXBox = (mtxList) => {
		dispatch(setStep(1));
		dispatch(setBox(name));
		dispatch(setBoxChanged(true));
		dispatch(setFullMTXList(mtxList));
		dispatch(setActiveMTX([]));
		dispatch(setStatList({itemList: []}));
		dispatch(setStepThree(false));
	};

	const onSelectBox = () => {
		dispatch(setActiveBox(name));
		let mtxList = data.filter((item) => item.box === name).map(item => ({...item, count: 0}));
		onChangeMTXBox(mtxList);
	};

	return (
		<div className={`box ${activeBox === name ? 'selected' : 'unselected'}`} onClick={() => onSelectBox()}>
			<img src={image} alt={name} draggable="false" />
			<h3>{name}</h3>
		</div>
	);

}