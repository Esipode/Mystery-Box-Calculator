import React from 'react';
import data from '../data.json';
import Box from './box';

const { boxes } = data;

export default function BoxSelection() {

	return (
		<div className="boxSelection">
			{boxes.map((box) => (
				<Box
					name={box.name}
					image={box.image}
					key={box.name}
				/>
			))}
		</div>
	);

}