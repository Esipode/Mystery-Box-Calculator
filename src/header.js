import React from 'react';
import { ReactComponent as LogoSVG } from './images/chesticon.svg';
export default class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<LogoSVG />
			</div>
		);
	}
}
