import React from 'react';
export default class BoxSimulator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boxVal: '',
			running: false,
			percentLoaded: 0
		};
	}
	render() {
		return (
			<div className="boxSimulator">
				<div className="searchContainer">
					<h4>Boxes:
					<input 
						type="text" 
						pattern={"[0-9]*"} 
						maxLength="3" 
						disabled={this.state.running} 
						onChange={(e) => this.setState({boxVal: e.target.value.replace(/\D/,'')})} 
						value={this.state.boxVal} 
						placeholder="# of boxes" 
					/>
					</h4>
					<h4>Points: {this.state.boxVal * 30}</h4>
					<button 
						onClick={() => {this.setState({running: this.state.running ? false : true})}} 
						style={{borderColor: this.state.running ? '#ff5f5f' : 'var(--selectColor)'}}><i className={this.state.running ? 'fas fa-stop' : 'fas fa-play' }/>
					</button>
				</div>
				<div className="loadingBar" style={{display: this.state.running ? 'flex' : 'none'}}>
					<div className="loadedPercent" style={{width: this.state.percentLoaded + '%'}}/>
					<h4>{this.state.percentLoaded}%</h4>
				</div>
				{/* <table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Rarity</th>
							<th>Image</th>
						</tr>
					</thead>
					<tbody>
						{mtxList.map((mtxData, index) => (
								<MTX
									item={mtxList[index]}
									name={mtxList[index].name}
									image={mtxList[index].image}
									value={mtxList[index].value}
									rarity={mtxList[index].rarity}
									key={mtxList[index].name}
									modifyMTX={this.props.modifyMTX}
								/>
						))}
					</tbody>
				</table> */}
			</div>
		);
	}
}
