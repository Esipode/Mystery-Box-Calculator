const completedList = (state = [], action) => {
	switch (action.type) {
		case 'COMPLETED_LIST':
			return action.value;
		default:
			return state;
	}
};

export default completedList;
