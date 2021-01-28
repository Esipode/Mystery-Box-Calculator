export default async function startSim(fullMTXList, boxVal, isRunning, curMTXList, setCompletedList, simToggle, setSubmitted, sleep, setPrevBoxVal) {
	let startTime = performance.now();
	setPrevBoxVal(0);
	await sleep(500);
	setSubmitted(false);
	let selectedItems = JSON.parse(JSON.stringify(fullMTXList));
	let fullList = JSON.parse(JSON.stringify(fullMTXList));
	//Execute for as long as the number of items randomly selected is less than the number of boxes to be opened
	for (let i = 1; i <= boxVal;) {
		if (!isRunning || boxVal > 999) {
			break;
		}
		else {
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
			//Create filtered list of item indexes matching selected rarity
			let listFiltered = [];
			for (let i in fullList) {
				fullList[i].rarity === curRarity && listFiltered.push(i);
			}
			//The index of the item to be selected, taken from the full list
			let curItemIndex = listFiltered[Math.floor(Math.random()*(listFiltered.length))];
			//Check to see if the randomly selected rarity matched the rarity of the random item
			if (curRarity === fullList[curItemIndex].rarity) {
				//Create variable storing the currently selected item taken from the index of the full list
				let curItem = JSON.parse(JSON.stringify(fullList[curItemIndex]));
				let itemCheck = curMTXList.filter((item) => item.name === curItem.name);
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
			}
		}
	}
	selectedItems.forEach((item, index) => {
		item.position = index;
	});
	selectedItems.sort((a, b) => {
		if (a.rolled !== b.rolled) {
			return a.rolled ? -1 : 1;
		}
		//First sort by if the item is desired or not and items that were rolled
		if (a.selected !== b.selected) {
			return a.selected ? -1 : 1;
		}
		//Then sort by index
		if (a.position < b.position) {
			return -1;
		}
		return 0;
	})
	setCompletedList(selectedItems);
	isRunning && simToggle();
	setPrevBoxVal(boxVal);
	let endTime = performance.now();
	// console.log("%cSimulation Time: ", "color: #0a0" , ((endTime - startTime) / 1000).toFixed(2) + " Seconds");
}