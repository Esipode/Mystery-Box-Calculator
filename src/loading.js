import React from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';

export default class Loading extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<div className="loading">
				<LogoSVG/>
			</div>
		)
	}
}