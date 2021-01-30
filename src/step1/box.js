import React from 'react';
import { mtxData as data } from '../data.json';

import {useSelector, useDispatch} from 'react-redux';
import {setStep, setBox, setBoxChanged, setFullMTXList, setActiveMTX, setStatList, setStepThree, setActiveBox} from '../actions';

export default function Box({name, image}) {

	const dispatch = useDispatch();
	const activeBox = useSelector(state => state.activeBox);

	const onChangeMTXBox = (boxName, mtxList) => {
		dispatch(setStep(1));
		dispatch(setBox(boxName));
		dispatch(setBoxChanged(true));
		dispatch(setFullMTXList(mtxList));
		dispatch(setActiveMTX([]));
		dispatch(setStatList({itemList: []}));
		dispatch(setStepThree(false));
	};

	const onSelectBox = (newBox) => {
		if (activeBox !== name || activeBox === '')
		dispatch(setActiveBox(newBox));
		let mtxList = data.filter((item) => item.box === newBox).map(item => ({...item, count: 0}));
		onChangeMTXBox(newBox, mtxList);
	};

	return (
		<div className={`box ${activeBox === name ? 'selected' : 'unselected'}`} onClick={() => onSelectBox(name)}>
			<img src={image} alt={name} draggable="false" />
			<h3>{name}</h3>
		</div>
	);

}