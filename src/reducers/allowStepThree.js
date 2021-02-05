const allowStepThree = (state = false, action) => {
	switch (action.type) {
		case 'STEP_THREE':
			return action.value;
		default:
			return state;
	}
};

export default allowStepThree;
