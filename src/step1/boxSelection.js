import React, {useState} from 'react';
import { images as box } from '../data.json';
import Box from './box';

export default function BoxSelection() {

	return (
		<div className="boxSelection">
			{box?.map((image, index) => (
				<Box
					name={box[index].name}
					image={box[index].image}
					key={box[index].name}
				/>
			))}
		</div>
	);

}