import React, {useState} from 'react';
import { images as box } from './data.json';
import { mtxData as data } from './data.json';
import Box from './box';

export default function BoxSelection({changeMTXBox}) {

	const [activeBox, setActiveBox] = useState('');

	const onChangeActiveBox = (newBox) => {
		setActiveBox(newBox);
		let fullMTXList = data.filter((item) => item.box === newBox).map(item => ({...item, count: 0}));
		changeMTXBox(newBox, fullMTXList);
	};

	return (
		<div className="boxSelection">
			{box?.map((image, index) => (
				<Box
					name={box[index].name}
					image={box[index].image}
					key={box[index].name}
					changeBox={onChangeActiveBox}
					activeBox={activeBox}
				/>
			))}
		</div>
	);

}