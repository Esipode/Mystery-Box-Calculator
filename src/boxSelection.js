import React from 'react';
import {images as box} from './data.json';
import Box from './box.js'

export default class BoxSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            boxList: box
        }
        console.log(this.state.boxList);
	}
	render() {
		return (
			<div className="boxSelection">
                {this.state.boxList.map((image, index) => (
                    <Box
                        name={this.state.boxList[index].name}
                        image={this.state.boxList[index].image}
                    />
				))}
			</div>
		)
	}
}