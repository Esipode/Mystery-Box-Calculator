const ownedList = (state = [], action) => {
	switch (action.type) {
		case 'OWNED_LIST':
			return action.value;
		default:
			return state;
	}
};

export default ownedList;