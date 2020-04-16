import React from 'react';
import axios from 'axios';
import SimResults from './simResults';

export default class BoxSimulator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boxVal: '',
			curProgress: 0,
			percentLoaded: 0,
			completedList: [],
			resultsSubmitted: false
		};
	}
	onStartSimulating = () => {
		if (this.props.curStep === 2) {
			if (!this.props.isRunning && (this.state.boxVal > 0 && this.state.boxVal < 1000)) {
				this.props.simToggle();
				this.simRun();
			}
			else if (this.state.boxVal > 0 && this.state.boxVal < 1000) {
				this.props.simToggle();
			}
		}
	}
	//Prevent pasting into input
	stopPaste = (e) => {
		e.preventDefault();
		return false;
	}
	//Forces waiting between each time an item is randomly selected
	sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	simRun = async () => {
		this.setState({
			resultsSubmitted: false
		})
		let selectedItems = JSON.parse(JSON.stringify(this.props.fullMTXList));
		let fullList = JSON.parse(JSON.stringify(this.props.fullMTXList));
		//Execute for as long as the number of items randomly selected is less than the number of boxes to be opened
		for (let i = 1; i <= this.state.boxVal;) {
			//Forces waiting between each time an item is randomly selected to prevent browser freezing
			await this.sleep(5);
			if (this.props.isRunning) {
				//Variable to store selected rarity of items to select from
				let curRarity;
				//Random number to decided rarity
				let chanceRoll = Math.floor(Math.random()*(100)+1);
				//Weighted categories for deciding rarity
				switch (true) {
					case (chanceRoll <= 20):
						curRarity = 'rare';
						break;
					case (chanceRoll <= 55 && chanceRoll > 20):
						curRarity = 'uncommon';
						break;
					case (chanceRoll > 55):
						curRarity = 'common'
						break;
					default:
						curRarity = ''
						break;
				}
				//The index of the item to be selected, taken from the full list
				let curItemIndex = (Math.floor(Math.random()*(fullList.length)));
				//Check to see if the randomly selected rarity matched the rarity of the random item
				if (curRarity === fullList[curItemIndex].rarity) {
					//Create variable storing the currently selected item taken from the index of the full list
					let curItem = JSON.parse(JSON.stringify(fullList[curItemIndex]));
					let itemCheck = this.props.curMTXList.filter((item) => item.name === curItem.name);
					for (let j = 0; j <= selectedItems.length; j++) {
						if (j < selectedItems.length && curItem.name === selectedItems[j].name) {
							selectedItems[j].count++;
							if (itemCheck.length) {
								if (itemCheck[0].name === selectedItems[j].name) {
									selectedItems[j].selected = true;
								}
								else {
									selectedItems[j].selected = false;
								}
							}
							selectedItems[j].rolled = true;
							i++;
							break;
						}
					}
					this.setState({
						curProgress: i - 1,
						percentLoaded: ((i / this.state.boxVal) * 100)
					});
				}
			}
			else {
				break;
			}
		}
		//Checks total number of items rolled in box
		// let sum = 0;
		// for (let k = 0; k < selectedItems.length; k++) {
		// 	sum += selectedItems[k].count;
		// }
		selectedItems.sort((a, b) => {
			if (a.rolled !== b.rolled) {
				return a.rolled ? -1 : 1;
			}
			//First sort by if the item is desired or not and items that were rolled
			if (a.selected !== b.selected) {
				return a.selected ? -1 : 1;
			}
			//Then sort by item rarity and items that were rolled
			if (a.rarity !== b.rarity) {
				if (a.rarity === 'rare' && (b.rarity === 'uncommon' || b.rarity === 'common')) {
					return -1;
				}
				else if (a.rarity === 'uncommon' && b.rarity === 'rare') {
					return 1;
				}
				else if (a.rarity === 'uncommon' && b.rarity === 'common') {
					return -1;
				}
				else if (a.rarity === 'common' && (b.rarity === 'rare' || b.rarity === 'uncommon')) {
					return 1;
				}
			}
			//Then sort by point value and items that were rolled
			if (a.value !== b.value) {
				return b.value - a.value;
			}
			//Then sort by name and items that were rolled
			if (a.name !== b.name) {
				return a - b;
			}
			return 0;
		})
		await this.sleep(100);
		this.setState({
			curProgress: 0,
			percentLoaded: 0,
			completedList: selectedItems
		})
		if (this.props.isRunning) {
			this.onStartSimulating();
		}
	}
	listStats = () => {
		let rawList = JSON.parse(JSON.stringify(this.state.completedList))
		let sortedItems = rawList;
		return new Promise(resolve => {
			let statList = [];
			statList.total = (() => {
				let sum = 0;
				for (let i = 0; i < rawList.length; i++) {
					sum += rawList[i].count;
				}
				return sum;
			})();
			statList.box = rawList[0].box;
			statList.itemList = (() => {
				
				sortedItems.sort((a, b) => {
					//Sort by item rarity
					if (a.rarity !== b.rarity) {
						if (a.rarity === 'rare' && (b.rarity === 'uncommon' || b.rarity === 'common')) {
							return -1;
						}
						else if (a.rarity === 'uncommon' && b.rarity === 'rare') {
							return 1;
						}
						else if (a.rarity === 'uncommon' && b.rarity === 'common') {
							return -1;
						}
						else if (a.rarity === 'common' && (b.rarity === 'rare' || b.rarity === 'uncommon')) {
							return 1;
						}
					}
					//Then sort by point value
					if (a.value !== b.value) {
						return b.value - a.value;
					}
					//Then sort by name
					if (a.name !== b.name) {
						return a - b;
					}
					return 0;
				})
				return sortedItems;
			})();
		resolve(statList);
		})
	}
	onSubmitResults = async () => {
		const stat = await this.listStats();
		console.log(stat);
		let masterList = await axios.get('http://localhost:5000/stats');
		console.log(masterList);
		let boxIndex = await masterList.data.findIndex((name) => {return name._id === stat.box});
		let curBox = masterList.data[boxIndex];
		curBox.total += stat.total;
		for (let i = 0; i < curBox.itemList.length; i++) {
			if (stat.itemList[i].count > 0) {
				curBox.itemList[i].count += stat.itemList[i].count;
				if (stat.itemList[i].selected) {
					curBox.itemList[i].wanted += stat.itemList[i].count;
				}
				else {
					curBox.itemList[i].unwanted += stat.itemList[i].count;
				}
			}
		}
		this.setState({
			resultsSubmitted: true
		})
		const statList = {
			_id: stat.box,
            total: curBox.total,
            itemList: curBox.itemList
		}
		this.props.simList(statList);
		// axios.post('http://localhost:5000/stats/update/'+statList._id, statList)
		// 	.then(res => console.log(res.data))
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
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
						disabled={this.props.isRunning} 
						onChange={(e) => this.setState({boxVal: e.target.value.replace(/\D/,'')})} 
						value={this.state.boxVal} 
						placeholder="# of boxes"
						onPaste={this.stopPaste}
					/>
					</h4>
					<h4>Points: {this.state.boxVal * 30}</h4>
					<button onClick={this.onStartSimulating} style={{borderColor: this.props.isRunning ? '#ff5f5f' : 'var(--mainColor)'}}>
						<i className={this.props.isRunning ? 'fas fa-stop' : 'fas fa-play' }/>
					</button>
					<div
						className="progressBar"
						style={{
							width: `${(this.state.percentLoaded / 100) * 68}%`,
							opacity: this.state.percentLoaded >= 1 && this.state.percentLoaded < 100 ? 1 : 0
						}}
					/>
				</div>
				<p className="progressCount" style={{display: this.props.isRunning && !this.props.boxChanged && this.state.curProgress !== this.state.boxVal ? 'block' : 'none'}}>{this.state.curProgress}/{this.state.boxVal}</p>
				<p className={`submitResults ${this.state.resultsSubmitted ? 'submitted' : ''}`} onClick={this.onSubmitResults} style={{display: !this.props.isRunning && this.state.completedList.length && !this.props.boxChanged ? 'block' : 'none'}}>{this.state.resultsSubmitted ? <i className="fas fa-check"></i> : 'Submit Results'}</p>
				<table style={{display: this.state.completedList.length && !this.props.isRunning && !this.props.boxChanged ? 'table' : 'none'}}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Rarity</th>
							<th>Image</th>
							<th>Count</th>
						</tr>
					</thead>
					<tbody>
						{this.state.completedList.map((item) => (
							<SimResults
								item={item}
								key={item.name}
							/>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
