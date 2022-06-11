import sleep from "./sleep";
import { 
	getRarity,
	filterList,
	addIndex,
	sortSelected,
	getRangeTotal,
	setRanges,
	getIndex, 
} from './filterFuncs';



export default async function startSim(
	curMTXList,
	boxVal,
	ownedList,
  	dispatch,
	fullMTXList,
  	mode,
	setSubmitted,
	setPrevBoxVal,
	isRunning,
	simToggle,
) {
	dispatch(setPrevBoxVal(0));
	await sleep(500);
	dispatch(setSubmitted(false));
	let selectedItems = JSON.parse(JSON.stringify(fullMTXList));
	let fullList = JSON.parse(JSON.stringify(fullMTXList));

	if (mode === 'new') selectedItems = await setRanges(selectedItems);

	//Execute for as long as the number of items randomly selected is less than the number of boxes to be opened
	for (let i = 1; i <= boxVal; ) {
		if (!isRunning || boxVal > 999) {
			break;
		} else {
			if (mode === 'old') {
				const curRarity = await getRarity();
				//Create filtered list of item indexes matching selected rarity
				let listFiltered = await filterList(fullList, curRarity);
				//The index of the item to be selected, taken from the filtered list
				let curItemIndex = listFiltered[Math.floor(Math.random() * listFiltered.length)];
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
								} else {
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
			else if (mode === 'new') {
				const totalRange = await getRangeTotal(fullList);
				const randomRange = Math.random() * totalRange;
				const selectedIndex = await getIndex(selectedItems, randomRange);

				let curItem = JSON.parse(JSON.stringify(fullList[selectedIndex]));
				let itemCheck = curMTXList.filter((item) => item.name === curItem.name);
				const isOwned = !!ownedList.filter((item) => (curItem.name === item.name) && item.owned).length;
				
				if (!selectedItems[selectedIndex].count && !isOwned) {
					for (let j = 0; j <= selectedItems.length; j++) {
						if (j < selectedItems.length && curItem.name === selectedItems[j].name) {
							selectedItems[j].count = 1;
							if (itemCheck.length) {
								if (itemCheck[0].name === selectedItems[j].name) {
									selectedItems[j].selected = true;
								} else {
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
	}
	selectedItems = await addIndex(selectedItems);
	selectedItems = await sortSelected(selectedItems);
	
	isRunning && simToggle();
	
	return {selectedItems, newBoxVal: boxVal}
}
