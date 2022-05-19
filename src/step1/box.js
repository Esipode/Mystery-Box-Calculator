import React, { useMemo } from 'react';
import { boxes } from '../data.json';

import { useSelector, useDispatch } from 'react-redux';
import {
	setStep,
	setMode,
	setBox,
	setBoxChanged,
	setFullMTXList,
	setActiveMTX,
	setStatList,
	setStepThree,
	setActiveBox
} from '../actions';

export default function Box({ name, image }) {
	const dispatch = useDispatch();
	const activeBox = useSelector((state) => state.activeBox);

	const onChangeMTXBox = (mtxList, name) => {
		dispatch(setStep(1));
		dispatch(setMode(boxes.filter((box) => box.name === name)[0].mode));
		dispatch(setBox(name));
		dispatch(setBoxChanged(true));
		dispatch(setFullMTXList(mtxList));
		dispatch(setActiveMTX([]));
		dispatch(setStatList({ itemList: [] }));
		dispatch(setStepThree(false));
	};

	const onSelectBox = () => {
		dispatch(setActiveBox(name));
		let mtxList = boxes.filter((box) => box.name === name)[0].mtx?.map((item) => ({ ...item, count: 0 }));
		onChangeMTXBox(mtxList, name);
	};

	const fallbackImage = useMemo(() => {
		const mtxList = boxes.filter((box) => box.name === name)[0].mtx;
		const imageIndex = Math.floor(Math.random() * mtxList.length);
		return mtxList[imageIndex].image;
	}, [name])

	return (
		<div className={`box ${activeBox === name ? 'selected' : 'unselected'}`} onClick={() => onSelectBox()}>
			<img src={image || fallbackImage} alt={name} draggable="false" onError={(e) => e.target.src = "/images/img_missing.svg"} />
			<h3>{name}</h3>
		</div>
	);
}
