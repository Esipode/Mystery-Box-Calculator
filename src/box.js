import React from 'react';

export default class BoxSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            
        }
        
	}
	render() {
		return (
			<div className="box">
               <img src={this.props.image} alt={this.props.name} />
               <h3>{this.props.name}</h3>
			</div>
		)
	}
}