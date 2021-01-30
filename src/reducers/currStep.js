const currStep = (state = 0, action) => {
	switch (action.type) {
		case 'STEP':
			return action.value;
		default:
			return state;
	}
}

export default currStep;