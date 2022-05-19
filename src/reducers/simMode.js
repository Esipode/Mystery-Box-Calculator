const currMode = (state = 'simulator', action) => {
	switch (action.type) {
		case 'SIM_MODE':
			return action.value;
		default:
			return state;
	}
};

export default currMode;
