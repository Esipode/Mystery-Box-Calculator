const statList = (state = {itemList: []}, action) => {
	switch (action.type) {
		case 'STAT_LIST':
			return action.value;
		default:
			return state;
	}
}

export default statList;