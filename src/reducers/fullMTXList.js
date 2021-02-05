const fullMTXList = (state = [], action) => {
	switch (action.type) {
		case 'FULL_MTX_LIST':
			return action.value;
		default:
			return state;
	}
};

export default fullMTXList;
