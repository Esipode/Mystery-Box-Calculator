import React from 'react';
import './App.css';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';
import Loading from './loading';
import BoxSelection from './boxSelection';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<div className="App">
				<LogoSVG/>
				<BoxSelection/>
				<Loading/>
			</div>
		)
	}
}