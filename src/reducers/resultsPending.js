const resultsPending = (state = false, action) => {
	switch (action.type) {
		case 'RESULTS_PENDING':
			return action.value;
		default:
			return state;
	}
};

export default resultsPending;
