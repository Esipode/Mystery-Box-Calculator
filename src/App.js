import React from 'react';
import './App.css';
import Loading from './loading';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<div className="App">
				<Loading/>
			</div>
		)
	}
}