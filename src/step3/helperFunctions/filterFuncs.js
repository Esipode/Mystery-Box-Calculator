export const getRarity = async () => {
	//Variable to store selected rarity of items to select from
	let rarity;
	//Random number to decided rarity
	let chanceRoll = Math.floor(Math.random() * 100 + 1);
	//Weighted categories for deciding rarity
	switch (true) {
		case chanceRoll <= 20:
			rarity = 'rare';
			break;
		case chanceRoll <= 55 && chanceRoll > 20:
			rarity = 'uncommon';
			break;
		case chanceRoll > 55:
			rarity = 'common';
			break;
		default:
			rarity = '';
			break;
	}
	return rarity;
}

export const filterList = async (fullList, rarity) => {
	let list = [];
	for (let i in fullList) {
		fullList[i].rarity === rarity && list.push(i);
	}
	return list;
}

export const addIndex = async (list) => {
	let arr = [...list];
	arr.forEach((item, index) => {
		item.position = index;
	});
	return arr;
}

export const sortSelected = async (list) => {
	return list.sort((a, b) => {
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
	});
}

export const getRangeTotal = async (list) => {
	return parseFloat(list.reduce((sum, item) => sum + parseFloat(item.chance), 0).toFixed(2));
}

export const setRanges = async (list) => {
	let range = 0;
	let newList = [...list];
	for (let i in newList) {
		newList[i].rangeMin = range;
		range = parseFloat((range + newList[i].chance).toFixed(2));
		newList[i].rangeMax = range;
	}
	return newList;
}

export const getIndex = async (list, range) => {
	return list.findIndex((item) => item.rangeMin < range && item.rangeMax > range);
}

export const price = (mode) => mode === 'new' ? 50 : 30;

export const checkCount = async (list, fullList, index) => {
	return {
	  updatedList: [...list].map((item) => ({...item, count: item.name === fullList[index].name ? item.count + 1 : item.count})),
	  updatedFullList: [...fullList].map((item) => ({...item, count: item.name === fullList[index].name ? item.count + 1 : item.count})),
	}
  }