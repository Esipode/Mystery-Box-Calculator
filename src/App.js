import React from 'react';
import './App.css';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';
import Loading from './loading';
import BoxSelection from './boxSelection';
import MTXSelection from './mtxSelection';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curBox: ''
		};
	}
	onChangeMTX = (boxName) => {
		this.setState({
			curBox: boxName
		});
	};
	render() {
		return (
			<div className="App">
				<LogoSVG />
				<BoxSelection changeMTX={this.onChangeMTX} />
				<MTXSelection curMTX={this.state.curBox} />
				<Loading />
			</div>
		);
	}
}
