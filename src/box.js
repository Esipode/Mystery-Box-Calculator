import React from 'react';

export default function Box({name, image, changeBox, activeBox}) {

	const onChangeBox = () => {
		if (activeBox !== name || activeBox === '') {
			changeBox(name);
		}
	};

	const checkMatch = () => {
		return activeBox === name ? 'selected' : 'unselected';
	};

	return (
		<div className={`box ${checkMatch()}`} onClick={onChangeBox}>
			<img src={image} alt={name} draggable="false" />
			<h3>{name}</h3>
		</div>
	);

}