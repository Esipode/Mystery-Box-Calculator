const resultsSubmitted = (state = false, action) => {
	switch (action.type) {
		case 'RESULTS_SUBMITTED':
			return action.value;
		default:
			return state;
	}
};

export default resultsSubmitted;
