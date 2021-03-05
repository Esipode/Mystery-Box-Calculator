import React from 'react';
import './scss/App.scss';
import Header from './header';
import BoxSelection from './step1/boxSelection';
import MTXSelection from './step2/mtxSelection';
import BoxSimulator from './step3/boxSimulator';
import Statistics from './step4/statistics';

import { useSelector } from 'react-redux';

export default function App() {
	const currStep = useSelector((state) => state.currStep);
	const currBox = useSelector((state) => state.currBox);

	return (
		<div
			className={`App ${currBox.replace(/[^A-Z0-9]+/gi, '_')}`}
			style={currBox === '' ? { backgroundColor: '#2a2a2a' } : { backgroundColor: 'rgb(var(--bgColor)' }}
		>
			<Header />
			<div className="mainWrapper" style={{ transform: 'translateX(' + currStep * -100 + 'vw)' }}>
				<BoxSelection />
				<MTXSelection />
				<BoxSimulator />
				<Statistics />
			</div>
		</div>
	);
}
