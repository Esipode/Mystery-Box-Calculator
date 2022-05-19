import React from 'react';
import { boxes } from '../data.json';
import Box from './box';

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